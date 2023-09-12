// AWS API Variables
const fs = require('fs');
var configData = JSON.parse(fs.readFileSync('./aws-exports.json'));

// API Application Variables
const express = require('express');
const cors = require('cors')
const uuid = require('uuid');
const axios = require('axios');

const app = express();
const port = configData.aws_api_port;
app.use(cors());
app.use(express.json())

// API Protection
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var bodyParser = require('body-parser')
const csrfProtection = csrf({
  cookie: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrfProtection);



// AWS Variables
var AWS = require('aws-sdk');
AWS.config.update({region: configData.aws_region});

var rds = new AWS.RDS();
var cloudwatch = new AWS.CloudWatch();
var cloudwatchlogs = new AWS.CloudWatchLogs();


// Security Variables
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
var request = require('request');
var secretKey =  crypto.randomBytes(32).toString('hex')
var pems;
var issCognitoIdp = "https://cognito-idp." + configData.aws_region + ".amazonaws.com/" + configData.aws_cognito_user_pool_id;
        

// Mysql Variables
const mysql = require('mysql')
var db=[];
var aurora=[];

// Postgresql Variables
const postgresql = require('pg').Pool


// SQLServer Variables
const mssql = require('mssql')

// ORACLE Variables
const oracle = require('oracledb')

// REDIS Variables
const redis = require("redis");
const redisInfo = require('redis-info');
var redisClient=[];
var elasticache = new AWS.ElastiCache();
var memorydb = new AWS.MemoryDB();
var dbRedis = {};


// Startup - Download PEMs Keys
gatherPemKeys(issCognitoIdp);



//--#################################################################################################### 
//   ---------------------------------------- SECURITY
//--#################################################################################################### 


//-- Generate new standard token
function generateToken(tokenData){
    const token = jwt.sign(tokenData, secretKey, { expiresIn: 60 * 60 * configData.aws_token_expiration });
    return token ;
};


//-- Verify standard token
const verifyToken = (token) => {

    try {
        const decoded = jwt.verify(token, secretKey);
        return {isValid : true, session_id: decoded.session_id};
    }
    catch (ex) { 
        return {isValid : false, session_id: ""};
    }

};


//-- Gather PEMs keys from Cognito
function gatherPemKeys(iss)
{

    if (!pems) {
        //Download the JWKs and save it as PEM
        return new Promise((resolve, reject) => {
                    request({
                       url: iss + '/.well-known/jwks.json',
                       json: true
                     }, function (error, response, body) {
                         
                        if (!error && response.statusCode === 200) {
                            pems = {};
                            var keys = body['keys'];
                            for(var i = 0; i < keys.length; i++) {
                                //Convert each key to PEM
                                var key_id = keys[i].kid;
                                var modulus = keys[i].n;
                                var exponent = keys[i].e;
                                var key_type = keys[i].kty;
                                var jwk = { kty: key_type, n: modulus, e: exponent};
                                var pem = jwkToPem(jwk);
                                pems[key_id] = pem;
                            }
                        } else {
                            //Unable to download JWKs, fail the call
                            console.log("error");
                        }
                        
                        resolve(body);
                        
                    });
        });
        
        } 
    
    
}


//-- Validate Cognito Token
function verifyTokenCognito(token) {

   try {
        //Fail if the token is not jwt
        var decodedJwt = jwt.decode(token, {complete: true});
        if (!decodedJwt) {
            console.log("Not a valid JWT token");
            return {isValid : false, session_id: ""};
        }
        
        
        if (decodedJwt.payload.iss != issCognitoIdp) {
            console.log("invalid issuer");
            return {isValid : false, session_id: ""};
        }
        
        //Reject the jwt if it's not an 'Access Token'
        if (decodedJwt.payload.token_use != 'access') {
            console.log("Not an access token");
            return {isValid : false, session_id: ""};
        }
    
        //Get the kid from the token and retrieve corresponding PEM
        var kid = decodedJwt.header.kid;
        var pem = pems[kid];
        if (!pem) {
            console.log('Invalid access token');
            return {isValid : false, session_id: ""};
        }

        const decoded = jwt.verify(token, pem, { issuer: issCognitoIdp });
        return {isValid : true, session_id: ""};
    }
    catch (ex) { 
        console.log("Unauthorized Token");
        return {isValid : false, session_id: ""};
    }
    
};



//-- Authenticate User Database 
app.post("/api/security/rds/auth/", csrfProtection, (req,res)=>{
    
    // Token Validation
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid"});

    // API Call
    var params = req.body.params;
    
    
    try {
        
        switch(params.engine)
        {
            //-- MYSQL CONNECTION
            case 'mysql':
            case 'mariadb':   
            case 'aurora-mysql':
                    var dbconnection= mysql.createConnection({
                    host: params.host,
                    user: params.username,
                    password: params.password,
                    port: params.port
                    })
                
                    dbconnection.connect(function(err) {
                      if (err) {
                        res.status(200).send( {"result":"auth0", "session_id": 0});
                      } else {
                        dbconnection.end();
                        var session_id=uuid.v4();
                        
                        if (params.mode == "cluster")
                            aurora[session_id] = {};
                        else
                            mysqlOpenConnection(session_id,params.host,params.port,params.username,params.password);
                        
                        var token = generateToken({ session_id: session_id });
                        res.status(200).send( {"result":"auth1", "session_id": session_id, "session_token": token });
                      }
                      
                    });
                    
                    break;
                    
            //-- POSTGRESQL CONNECTION
            case 'postgres':
            case 'aurora-postgresql':
                    
                    var dbconnection = new postgresql({
                      user: params.username,
                      host: params.host,
                      database: 'postgres',
                      password: params.password,
                      port: params.port,
                      max: 1,
                    })
                    dbconnection.connect(function(err) {
                      if (err) {
                        res.status(200).send( {"result":"auth0", "session_id": 0});
                      } else {
                        dbconnection.end();
                        var session_id=uuid.v4();
                        postgresqlOpenConnection(session_id,params.host,params.port,params.username,params.password);
                        
                        var token = generateToken({ session_id: session_id});
                        res.status(200).send( {"result":"auth1", "session_id": session_id, "session_token": token});
                      }
                      
                    });
                    break;
            
            //-- MSSQL CONNECTION    
            case 'sqlserver-se':
            case 'sqlserver-ee':
            case 'sqlserver-ex':
            case 'sqlserver-web':
                    
                    
                    var dbconnection = new mssql.ConnectionPool({
                        user: params.username,
                        password: params.password,
                        server: params.host,
                        database: 'master',
                        port : params.port,
                        pool: {
                            max: 2,
                            min: 0,
                            idleTimeoutMillis: 30000
                        },
                        options: {
                            trustServerCertificate: true,
                        }
                    });
    
                   
                    dbconnection.connect(function(err) {
                      if (err) {
                        res.status(200).send( {"result":"auth0", "session_id": 0});
                      } else {
                        dbconnection.close();
                        var session_id=uuid.v4();
                        mssqlOpenConnection(session_id,params.host,params.port,params.username,params.password);
                        
                        var token = generateToken({ session_id: session_id});
                        res.status(200).send( {"result":"auth1", "session_id": session_id, "session_token": token});
                      }
                      
                    });
                    
                    break;
            
            //-- ORACLE CONNECTION
            case 'oracle-ee':
            case 'oracle-ee-cdb':
            case 'oracle-se2':
            case 'oracle-se2-cdb':
                    
                    oracle.getConnection({
                    user: params.username,
                    password: params.password,
                    connectString: params.host + ":" + params.port + "/" + params.instance 
                    }, function(err,connection) {
                        if (err) {
                            console.log(err);
                            res.status(200).send( {"result":"auth0", "session_id": 0});
                        } 
                        else {
                            connection.close(function(err) {
                              if (err) {console.log(err);}
                            });
                            var session_id=uuid.v4();
                            oracleOpenConnection(session_id,params.host,params.port,params.username,params.password,params.instance);
                            
                            var token = generateToken({ session_id: session_id});
                            res.status(200).send( {"result":"auth1", "session_id": session_id, "session_token": token});
                        
                        }
                        
                    });
                
                    break;
                    
            
  
        }
        


    } catch(error) {
        console.log(error)
        res.status(200).send({"result":"auth0"});
                
    }
    
    
});


//-- Database Disconnection
app.get("/api/security/rds/disconnect/", (req,res)=>{

    // Token Validation
    var standardToken = verifyToken(req.headers['x-token']);
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (standardToken.isValid === false || cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid. StandardToken : " + String(standardToken.isValid) + ", CognitoToken : " + String(cognitoToken.isValid) });


    // API Call
    
    try {
        
        switch(req.query.engine)
        {
            case 'mysql':
            case 'aurora-mysql':
                console.log("API MYSQL Disconnection - SessionID : " + req.query.session_id)
                db[req.query.session_id].end();
                delete db[req.query.session_id];
                res.status(200).send( {"result":"disconnected", "session_id": req.query.session_id});
                break;
                
            case 'postgres':
            case 'aurora-postgresql':
                console.log("API POSTGRESQL Disconnection - SessionID : " + req.query.session_id)
                db[req.query.session_id].end();
                delete db[req.query.session_id];
                res.status(200).send( {"result":"disconnected", "session_id": req.query.session_id});
                break;
            
            case 'mariadb':
                console.log("API MARIADB Disconnection - SessionID : " + req.query.session_id)
                db[req.query.session_id].end();
                delete db[req.query.session_id];
                res.status(200).send( {"result":"disconnected", "session_id": req.query.session_id});
                break;
            
            case 'sqlserver-se':
            case 'sqlserver-ee':
            case 'sqlserver-ex':
            case 'sqlserver-web':
                console.log("API MSSQL Disconnection - SessionID : " + req.query.session_id)
                db[req.query.session_id].close();
                delete db[req.query.session_id];
                res.status(200).send( {"result":"disconnected", "session_id": req.query.session_id});
                break;

            case 'oracle-ee':
            case 'oracle-ee-cdb':
            case 'oracle-se2':
            case 'oracle-se2-cdb':
                
                console.log("API ORACLE Disconnection - SessionID : " + req.query.session_id)
                db[req.query.session_id].close(function(err) {
                        if (err) {
                            delete db[req.query.session_id];
                            res.status(401).send( {"result":"disconnected", "session_id": req.query.session_id});
                        } 
                        else {
                            delete db[req.query.session_id];
                            res.status(200).send( {"result":"disconnected", "session_id": req.query.session_id});
                            
                        }
                        
                    });
                
                break;

        }
        
    
    }
    
    catch(error) {

        res.status(200).send( {"result":"failed", "session_id": req.query.session_id});
        console.log(error)
        
    }
    
});



//--#################################################################################################### 
//   ---------------------------------------- MSSQL
//--#################################################################################################### 

// MSSQL : Create Connection
function mssqlOpenConnection(session_id,host,port,user,password){
    
    db[session_id] = new mssql.ConnectionPool({
                        user: user,
                        password: password,
                        server: host,
                        database: 'master',
                        port : port,
                        pool: {
                            max: 2,
                            min: 0,
                            idleTimeoutMillis: 30000
                        },
                        options: {
                            trustServerCertificate: true,
                        }
                    });
    
    db[session_id].connect(function(err) {
                      if (err) {
                        console.log("mssql error connection");
                      }
                      
    });
    
    console.log("Mssql Connection opened for session_id : " + session_id);
    
    
}


// MSSQL : API Execute SQL Query
app.get("/api/mssql/sql/", (req,res)=>{

    // Token Validation
    var standardToken = verifyToken(req.headers['x-token']);
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (standardToken.isValid === false || cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid. StandardToken : " + String(standardToken.isValid) + ", CognitoToken : " + String(cognitoToken.isValid) });


    // API Call
    var params = req.query;
    
    try {
        
        db[standardToken.session_id].query(params.sql_statement, (err,result)=>{
                        if(err) {
                            console.log(err)
                            res.status(404).send(err);
                        } 
                        else {
                            res.status(200).send(result);
                        }

                }
            );   


    } catch(error) {
        console.log(error)
                
    }

});


//--#################################################################################################### 
//   ---------------------------------------- POSTGRESQL
//--#################################################################################################### 

// POSTGRESQL : Create Connection
function postgresqlOpenConnection(session_id,host,port,user,password){
    
    db[session_id]  = new postgresql({
            host: host,
            user: user,
            password: password,
            database: "postgres",
            port: port,
            max: 2,
    })
    
    console.log("Postgresql Connection opened for session_id : " + session_id);
    
    
}


// POSTGRESQL : API Execute SQL Query
app.get("/api/postgres/sql/", (req,res)=>{

    // Token Validation
    var standardToken = verifyToken(req.headers['x-token']);
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (standardToken.isValid === false || cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid. StandardToken : " + String(standardToken.isValid) + ", CognitoToken : " + String(cognitoToken.isValid) });


    // API Call
    var params = req.query;
    
    try {
        
        db[standardToken.session_id].query(params.sql_statement, (err,result)=>{
                        if(err) {
                            console.log(err)
                            res.status(404).send(err);
                        } 
                        else {
                            res.status(200).send(result);
                        }

                }
            );   


    } catch(error) {
        console.log(error)
                
    }

});



//--#################################################################################################### 
//   ---------------------------------------- MYSQL
//--#################################################################################################### 


// MYSQL : Create Connection
function mysqlOpenConnection(session_id,host,port,user,password){

    db[session_id]  = mysql.createPool({
            host: host,
            user: user,
            password: password,
            database: "",
            acquireTimeout: 3000,
            port: port,
            connectionLimit:2
    })

    console.log("Mysql Connection opened for session_id : " + session_id);

}

// MYSQL : Create Connection per cluster node
app.get("/api/mysql/cluster/connection/open", (req,res)=>{

    // Token Validation
    var standardToken = verifyToken(req.headers['x-token']);
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (standardToken.isValid === false || cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid. StandardToken : " + String(standardToken.isValid) + ", CognitoToken : " + String(cognitoToken.isValid) });


    // API Call
    var params = req.query;
    var sessionId =  "$" + standardToken.session_id;
    var instanceId = "$" + params.instance;
    try {
        
            if (!(params.instance in aurora[standardToken.session_id])) {
                    aurora[sessionId][instanceId]= function() {}
                     aurora[sessionId][instanceId]  = mysql.createPool({
                            host: params.host,
                            user: params.username,
                            password: params.password,
                            database: "",
                            acquireTimeout: 3000,
                            port: params.port,
                            connectionLimit:2
                    })
                    
                    console.log("Mysql Connection opened for session_id : " + standardToken.session_id + "#" + params.instance);
                    res.status(200).send( {"result":"connection opened", "session_id": standardToken.session_id });
            }
            else {
                console.log("Re-using - MySQL Instance connection : " + standardToken.session_id + "#" + params.instance )
                res.status(200).send( {"result":"auth1" });
            }
            
    }
    catch(err) {
        res.status(404).send(err);
    }
   
    
})


// MYSQL : Close Connection per cluster node
app.get("/api/mysql/cluster/connection/close", (req,res)=>{
    
    // Token Validation
    var standardToken = verifyToken(req.headers['x-token']);
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (standardToken.isValid === false || cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid. StandardToken : " + String(standardToken.isValid) + ", CognitoToken : " + String(cognitoToken.isValid) });

    var params = req.query;
    
    try
            {
                
                var instances = aurora[standardToken.session_id];
                for (index of Object.keys(instances)) {
                        try
                          {
                                console.log("MySQL Cluster Disconnection : " + standardToken.session_id + "#" + index );
                                instances[index]["connection"].end();
                          }
                          catch{
                              console.log("MySQL Cluster Disconnection error : " + standardToken.session_id + "#" + index );
                          }
                }
                
                delete aurora[standardToken.session_id];
                res.status(200).send( {"result":"disconnected"});
    }
    catch(err){
                console.log(err);
    }
})



// MYSQL : API Execute SQL Query
app.get("/api/mysql/cluster/sql/", (req,res)=>{

    // Token Validation
    var standardToken = verifyToken(req.headers['x-token']);
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (standardToken.isValid === false || cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid. StandardToken : " + String(standardToken.isValid) + ", CognitoToken : " + String(cognitoToken.isValid) });

    // API Call
    var params = req.query;
    try {
        
        var sessionId =  "$" + standardToken.session_id;
        var instanceId = "$" + params.instance;
    
        aurora[sessionId][instanceId]["connection"].query(params.sql_statement, (err,result)=>{
                        if(err) {
                            console.log(err)
                            res.status(404).send(err);
                        } 
                        else
                        {
                            res.status(200).send(result);
                         }
                        
                }
            );   

           
    } catch(error) {
        console.log(error)
                
    }

});




// MYSQL : API Execute SQL Query
app.get("/api/mysql/sql/", (req,res)=>{

    // Token Validation
    var standardToken = verifyToken(req.headers['x-token']);
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (standardToken.isValid === false || cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid. StandardToken : " + String(standardToken.isValid) + ", CognitoToken : " + String(cognitoToken.isValid) });

    // API Call
    var params = req.query;

    try {
        
        db[standardToken.session_id].query(params.sql_statement, (err,result)=>{
                        if(err) {
                            console.log(err)
                            res.status(404).send(err);
                        } 
                        else
                        {
                            res.status(200).send(result);
                         }
                        
                }
            );   

           
    } catch(error) {
        console.log(error)
                
    }

});



//--#################################################################################################### 
//   ---------------------------------------- ORACLE
//--#################################################################################################### 

app.get('/api/oracle/sql/', function (req, res) {

    var standardToken = verifyToken(req.headers['x-token']);
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (standardToken.isValid === false || cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid. StandardToken : " + String(standardToken.isValid) + ", CognitoToken : " + String(cognitoToken.isValid) });

    // API Call
    var params = req.query;
    db[standardToken.session_id].execute(params.sql_statement, (err,result)=>{
                    if(err) {
                        console.log(err)
                        res.status(404).send(err);
                    } 
                    else {
                        return res.status(200).send({ rows : result.rows, metadata : result.metaData });
                    }

            }
    );   

})

// ORACLE : Create Connection
async function oracleOpenConnection(session_id,host,port,user,password,instance){

    try {
         db[session_id] = await oracle.getConnection({
                    user: user,
                    password: password,
                    connectString: host + ":" + port + "/" + instance
                    });
     } 
    catch (err) {
        console.log(err.message);
    } 
    console.log("Oracle Connection opened for session_id : " + session_id);

}


//--#################################################################################################### 
//   ---------------------------------------- REDIS
//--#################################################################################################### 


// REDIS : Auth Connection
app.post("/api/redis/connection/auth/", authRedisConnection);

async function authRedisConnection(req, res) {
 

    var params = req.body.params;

     
    try {
        
            
                    var options = {};
                    var protocol = "redis://";
                    
                    if ( params.ssl == "required" )
                        protocol = "rediss://";
    
                    switch (params.auth){
                        
                        case "modeIam" :
                        case "modeNonAuth":
                        case "modeOpen":
                                options = {
                                        url: protocol + params.host + ":" + params.port,
                                        socket : { reconnectStrategy : false},
                                        
                                };
                                break;
                                
                                
                        
                        case "modeAuth":
                        
                                options = {
                                        url: protocol + params.host + ":" + params.port,
                                        password : params.password,
                                        socket : { reconnectStrategy : false},
                                        
                                };
                                break;
                
                        case "modeRbac" :
                        case "modeAcl" :
                                
                                options = {
                                        url: protocol + params.username + ":" + params.password + "@" + params.host + ":" + params.port,
                                        socket : { reconnectStrategy : false},
                                        
                                };
                                break;
                        
                    }
                    
                    
                    
                    var dbconnection = redis.createClient(options);
                    dbconnection.on('error', err => {       
                              console.log(err.message);
                    });   
                
                    var session_id=uuid.v4();
                    var token = generateToken({ session_id: session_id});
                    await dbconnection.connect();
                    var command = await dbconnection.info();
                    dbRedis[session_id] = {}
                    dbconnection.quit();
                    res.status(200).send( {"result":"auth1", "session_id": session_id, "session_token": token });
                   
                   
      } catch (error) {
        console.log(error);
        res.status(200).send( {"result":"auth0", "session_id": session_id, "session_token": token });
    }
    
    
}



// REDIS : Open Connection - Single
app.get("/api/redis/connection/open/", openRedisConnectionSingle);

async function openRedisConnectionSingle(req, res) {
 
    var params = req.query;
         
    try {
        
            
            var options = {};
            var protocol = "redis://";
            
            if ( params.ssl == "required" )
                protocol = "rediss://";
            
            switch (params.auth){
                
                case "modeIam" :
                case "modeNonAuth":
                case "modeOpen":
                        options = {
                            url: protocol + params.instance + ":" + params.port,
                            socket : { reconnectStrategy : false}
                        };
                        
                        break;
                
                case "modeAuth":
                        
                        options = {
                            url: protocol + params.instance + ":" + params.port,
                            password : params.password ,
                            socket : { reconnectStrategy : false}
                        };
                        
                        break;
        
        
        
                case "modeRbac" :
                case "modeAcl" :    
                        options = {
                            url: protocol + params.username + ":" + params.password + "@" + params.instance + ":" + params.port,
                            socket : { reconnectStrategy : false}
                        };
                        
                        break;
                
            }
            
            if (!(params.instance in dbRedis[params.connectionId])) {
            
                dbRedis[params.connectionId][params.instance] = redis.createClient(options);
                            
                dbRedis[params.connectionId][params.instance].on('error', err => {       
                              console.log(err.message);
                });   

                dbRedis[params.connectionId][params.instance].connect()
                    .then(()=> {
                        console.log("Redis Instance Connected : " + params.connectionId + "#" + params.instance )
                        res.status(200).send( {"result":"auth1" });
                        
                    })
                    .catch(()=> {
                        console.log("Redis Instance Connected with Errors : " + params.connectionId + "#" + params.instance )
                        res.status(200).send( {"result":"auth0" });
                    });
                    
            }
            else {
                console.log("Re-using - Redis Instance connection : " + params.connectionId + "#" + params.instance )
                res.status(200).send( {"result":"auth1" });
            }
    
        
    }
    catch (error) {
        console.log(error)
        res.status(500).send(error);
    }}
    




// REDIS : Close Connection
app.get("/api/redis/connection/close/", closeRedisConnectionAll);

async function closeRedisConnectionAll(req, res) {
 
        try
            {
                var params = req.query;
                var instances = dbRedis[params.connectionId];
                for (index of Object.keys(instances)) {
                        try
                          {
                                console.log("Redis Disconnection : " + params.connectionId + "#" + index );
                                instances[index].quit();
                          }
                          catch{
                              console.log("Redis Disconnection error : " + params.connectionId + "#" + index );
                          }
                }
                
                delete dbRedis[params.connectionId];
                res.status(200).send( {"result":"disconnected"});
        }
        catch(err){
                console.log(err);
        }
}



// REDIS : API Command Stats - Single
app.get("/api/redis/commandstats/single/", getRedisCommandStatsSingle);

async function getRedisCommandStatsSingle(req, res) {
 
    var params = req.query;

    try {
          
          var command = await dbRedis[params.connectionId][params.instance].sendCommand(['INFO','Commandstats']);
          var iRowLine = 0;
          var dataResult = "";
          command.split(/\r?\n/).forEach((line) => {
              try
              {
                  if (iRowLine > 0) {
                      var record =  line.split(":");
                      var metricGropuName = record[0];
                      var counterList = record[1].split(",");
                      var metricList = "";
                      counterList.forEach((line) => {
                            var metric = line.split("=");
                            var key = metric[0];
                            var value = metric[1];
                            metricList = metricList + '"' + key + '":' + value + ",";
                            
                      });
                      dataResult = dataResult + '"' + metricGropuName + '": { ' + metricList.slice(0, -1) + ' },';
                  }
                  iRowLine ++;
              }
              catch {
                
              }
              
              
          });
          
          
          return res.status(200).json({
                      data: JSON.parse('{' + dataResult.slice(0, -1) + ' } ')
                    });
    
      } catch (error) {
        console.error(error);
        res.status(404).send("Data unavailable");
      }
}




// REDIS : API Cluster Stats - Single
app.get("/api/redis/clusterstats/single/", getRedisClusterStats);

async function getRedisClusterStats(req, res) {
    
    var params = req.query;
 
    try {
        
          var rawStats = await dbRedis[params.connectionId][params.instance].info();
          var jsonStats = redisInfo.parse(rawStats);
          //console.log(jsonStats);
          return res.status(200).json({
                      data: jsonStats
                    });
    
      } catch (error) {
        console.error(error);
        res.status(404).send("Data unavailable");
    }
}



//--#################################################################################################### 
//   ---------------------------------------- AWS
//--#################################################################################################### 


// AWS : List Instances - by Region
app.get("/api/aws/aurora/cluster/region/list/", (req,res)=>{
   
    // Token Validation
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);
    
    if (cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid"});

    // API Call
    var rds_region = new AWS.RDS({region: configData.aws_region});
    
    var params = {
        MaxRecords: 100
    };

    try {
        rds_region.describeDBClusters(params, function(err, data) {
            if (err) 
                console.log(err, err.stack); // an error occurred
            res.status(200).send({ csrfToken: req.csrfToken(), data:data });
        });

    } catch(error) {
        console.log(error)
                
    }

});



// AWS : List Instances - by Region
app.get("/api/aws/aurora/cluster/region/endpoints/", (req,res)=>{
   
    // Token Validation
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);
    
    if (cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid"});

    // API Call
    var rds_region = new AWS.RDS({region: configData.aws_region});
    var paramsQuery = req.query;
    
    var params = {
        MaxRecords: 100,
        Filters: [
                {
                  Name: 'db-cluster-id',
                  Values: [paramsQuery.cluster]
                },
        ],
    };

    try {
        rds_region.describeDBInstances(params, function(err, data) {
            if (err) 
                console.log(err, err.stack); // an error occurred
            res.status(200).send({ csrfToken: req.csrfToken(), data:data });
        });

    } catch(error) {
        console.log(error)
                
    }

});




// AWS : List Instances - by Region
app.get("/api/aws/rds/instance/region/list/", (req,res)=>{
   
    // Token Validation
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);
    
    if (cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid"});

    // API Call
    var rds_region = new AWS.RDS({region: configData.aws_region});
    
    var params = {
        MaxRecords: 100
    };

    try {
        rds_region.describeDBInstances(params, function(err, data) {
            if (err) 
                console.log(err, err.stack); // an error occurred
            res.status(200).send({ csrfToken: req.csrfToken(), data:data });
        });

    } catch(error) {
        console.log(error)
                
    }

});






// AWS : Cloudwatch Information
app.get("/api/aws/clw/query/", (req,res)=>{
    
    var standardToken = verifyToken(req.headers['x-token']);
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (standardToken.isValid === false || cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid. StandardToken : " + String(standardToken.isValid) + ", CognitoToken : " + String(cognitoToken.isValid) });

    try {
            
            var params = req.query;
            
            params.MetricDataQueries.forEach(function(metric) {
                                metric.MetricStat.Metric.Dimensions[0]={ Name: metric.MetricStat.Metric.Dimensions[0]['[Name]'], Value: metric.MetricStat.Metric.Dimensions[0]['[Value]']};
                     
            })
                        
            cloudwatch.getMetricData(params, function(err, data) {
                if (err) 
                    console.log(err, err.stack); // an error occurred
                res.status(200).send(data);
            });
            
    
                   
    } catch(error) {
            console.log(error)
                    
    }
    

});


// AWS : Cloudwatch Information
app.get("/api/aws/clw/region/query/", (req,res)=>{

    var standardToken = verifyToken(req.headers['x-token']);
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (standardToken.isValid === false || cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid. StandardToken : " + String(standardToken.isValid) + ", CognitoToken : " + String(cognitoToken.isValid) });

    try {
        
        var params = req.query;
        var cloudwatch_region = new AWS.CloudWatch({region: configData.aws_region, apiVersion: '2010-08-01'});
        params.MetricDataQueries.forEach(function(metric) {
                
                for(i_dimension=0; i_dimension <  metric.MetricStat.Metric.Dimensions.length; i_dimension++) {
                    metric.MetricStat.Metric.Dimensions[i_dimension]={ Name: metric.MetricStat.Metric.Dimensions[i_dimension]['[Name]'], Value: metric.MetricStat.Metric.Dimensions[i_dimension]['[Value]']};
                }          
        })
                    
        cloudwatch_region.getMetricData(params, function(err, data) {
            if (err) 
                console.log(err, err.stack); // an error occurred
            res.status(200).send(data);
        });
        

               
    } catch(error) {
        console.log(error)
                
    }


});


// AWS : Cloudwatch Information
app.get("/api/aws/clw/region/logs/", (req,res)=>{
    
    var standardToken = verifyToken(req.headers['x-token']);
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);

    if (standardToken.isValid === false || cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid. StandardToken : " + String(standardToken.isValid) + ", CognitoToken : " + String(cognitoToken.isValid) });

    
    try {
        
        var params = req.query;
        var params_logs = {
          logStreamName: params.resource_id,
          limit: '1',
          logGroupName: 'RDSOSMetrics',
          startFromHead: false
        };
    
        cloudwatchlogs.getLogEvents(params_logs, function(err, data) {
          if (err) 
            console.log(err, err.stack); // an error occurred
          else   {
              res.status(200).send(data);
            
            }
        });
            
            

  

    } catch(error) {
        console.log(error)
                
    }


});



// AWS : Elasticache List nodes
app.get("/api/aws/region/elasticache/cluster/nodes/", (req,res)=>{

    
    // Token Validation
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);
    
    if (cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid"});


    var params = req.query;

    var parameter = {
      MaxRecords: 100,
      ReplicationGroupId: params.cluster
    };
    elasticache.describeReplicationGroups(parameter, function(err, data) {
      if (err) {
            console.log(err, err.stack); // an error occurred
            res.status(401).send({ ReplicationGroups : []});
      }
      else {
            res.status(200).send({ csrfToken: req.csrfToken(), ReplicationGroups : data.ReplicationGroups})
          }
    });


});





// AWS : MemoryDB List nodes
app.get("/api/aws/region/memorydb/cluster/nodes/", (req,res)=>{
    
    
    // Token Validation
    var cognitoToken = verifyTokenCognito(req.headers['x-token-cognito']);
    
    if (cognitoToken.isValid === false)
        return res.status(511).send({ data: [], message : "Token is invalid"});


    var params = req.query;

    var parameter = {
      ClusterName: params.cluster,
      ShowShardDetails: true
    };
    memorydb.describeClusters(parameter, function(err, data) {
      if (err) {
            console.log(err, err.stack); // an error occurred
            res.status(401).send({ Clusters : []});
      }
      else {
            res.status(200).send({ csrfToken: req.csrfToken(), Clusters : data.Clusters})
          }
    });


});


//--#################################################################################################### 
//   ---------------------------------------- MAIN API CORE
//--#################################################################################################### 


app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})