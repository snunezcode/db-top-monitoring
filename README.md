# DBTop Monitoring Solution for AWS Database Services

> **Disclaimer:** The sample code; software libraries; command line tools; proofs of concept; templates; or other related technology (including any of the foregoing that are provided by our personnel) is provided to you as AWS Content under the AWS Customer Agreement, or the relevant written agreement between you and AWS (whichever applies). You are responsible for testing, securing, and optimizing the AWS Content, such as sample code, as appropriate for production grade use based on your specific quality control practices and standards. Deploying AWS Content may incur AWS charges for creating or using AWS chargeable resources, such as running Amazon EC2 instances, using Amazon CloudWatch or Amazon Cognito.


## What is DBTop Monitoring ?

DBTop Monitoring is evolution of [RDSTop Monitoring Solution](https://github.com/aws-samples/rds-top-monitoring) initiative.

DBTop Monitoring is lightweight application to perform realtime monitoring for AWS Database Resources. 
Based on same simplicity concept of Unix top utility, provide quick and fast view of database performance, just all in one screen.


<img width="1089" alt="image" src="./images/img01.png">


## How looks like DBTop Monitoring ?

<img width="1089" alt="image" src="./images/img04.png">


## How it works?

<img width="1089" alt="image" src="./images/img02.png">




## Database engine support

DBTop Monitoring Solution currently supports following database engines:

- AWS RDS for MySQL
- AWS RDS for PostgreSQL
- AWS RDS for MariaDB
- Amazon Aurora MySQL-Compatible Edition (Instance Level)
- Amazon Aurora PostgreSQL-Compatible Edition (Instance Level)
- AWS RDS for Oracle
- AWS RDS for SQLServer
- Amazon ElastiCache for Redis
- Amazon MemoryDB for Redis
- Amazon Aurora Clusters (MySQL-Compatible Edition)

Additional expanded support coming later to :

- Amazon Aurora Clusters (PostgreSQL-Compatible Edition)
- Amazon DocumentDB



## Solution Components

- **Frontend.** React Developed Application to provide user interface to visualize performance database information.

- **Backend.** NodeJS API Component to gather performance information from database engines, AWS CloudWatch and RDS Enhanced Monitoring.


## Architecture

<img width="1023" alt="image" src="./images/img03.png">


## Use cases

- **Monitor instance performance.**
    Visualize performance data on realtime, and correlate data to understand and resolve the root cause of performance issues in your database instances.

- **Perform root cause analysis.**
    Analyze database and operating system metrics to speed up debugging and reduce overall mean time to resolution.

- **Optimize resources proactively.**
    Identify top consumer sessions, gather SQL statements and resource usages.



## Solution Requirements

#### Amazon RDS Enhanced Monitoring

Amazon RDS provides metrics in real time for the operating system (OS) that your DB instance runs on. DBTop Monitoring solution integrate metrics from Enhanced Monitoring and it has to be enabled. 
Follow procedure below to turn on Enhanced Monitoring.

https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.Enabling.html


#### VPC Network Access to AWS Database Instances

DBTop Monitoring Solution needs to access privately AWS Database resources, grant access inboud rules and security groups.




## Solution Deployment



> **Time to deploy:** Approximately 10 minutes.


### Create database monitoring users

Database credentials are needed to connect to the database engine and gather real-time metrics, use following statements to create the monitoring users.

#### MySQL
```
CREATE USER 'monitor'@'%' IDENTIFIED BY '<PASSWORD>';
GRANT PROCESS ON *.* TO 'monitor'@'%' ;
```

#### PostgreSQL
```
CREATE USER monitor WITH PASSWORD '<PASSWORD>';
GRANT pg_read_all_stats TO monitor;
```

#### MS SQLServer
```
USE [master]
GO
CREATE LOGIN [monitor] WITH PASSWORD=N'<PASSWORD>', DEFAULT_DATABASE=[master], CHECK_EXPIRATION=ON, CHECK_POLICY=ON
GO
use [master]
GO
GRANT CONNECT SQL TO [monitor]
GO
GRANT VIEW SERVER STATE TO [monitor]
GO
```

#### Oracle
```
CREATE USER monitor IDENTIFIED BY '<PASSWORD>';
GRANT CREATE SESSION,SELECT ANY DICTIONARY TO monitor;
```


### Launch CloudFormation Stack

Follow the step-by-step instructions to configure and deploy the RDSTop into your account.

1. Make sure you have sign in AWS Console already.
2. Download AWS Cloudformation Template (DBMonitoringSolution.template) located into conf folder.
3. Click the following button to launch the CloudFormation Console in your account and create an stack using Cloudformation template (DBMonitoringSolution.template) already downloaded.

[![Launch AWS CloudFormation Console](./images/launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/create/template?stackName=DBTopMonitoringSolution)

4. Input **Stack name** parameter. 
5. Acknowledge **Application Update - Disclaimer** parameter.
5. Input **Username** parameter, this username will be used to access the application. An email will be sent with temporary password from AWS Cognito Service. 
6. Input **AWS Linux AMI** parameter, this parameter specify AWS AMI to build App EC2 Server. Keep default value.
7. Select **Instance Type** parameter, indicate what instance size is needed.
8. Select **VPC Name** parameter, indicate VPC to be used to deploy application server.
9. Select **Subnet Name** parameter, indicate subnet to be used to deploy application server, this subnet needs to have outbound internet access to reach AWS APIs. Also application server needs to be able to reach AWS Database Resources, add appropiate inboud rules on AWS RDS security groups to allow network connections.
10. Select **Public IP Address** parameter, the deployment will assign private IP Address by default to access the application, you can assign Public IP Address to access the application in case you need it, Select (true) to assign Public IP Address.
11. Input **CIDR** parameter, specify CIDR inbound access rule, this will grant network access for the application.
12. Click **Next**, Click **Next**, select **acknowledge that AWS CloudFormation might create IAM resources with custom names**. and Click **Submit**.
13. Once Cloudformation has been deployed, gather application URL from output stack section. Username will be same you introduce on step 4 and temporary password will be sent by AWS Cognito Service.
14. Application deployment will take around 5 minutes to be completed.

> **Note:** Because you are connecting to a site with a self-signed, untrusted host certificate, your browser may display a series of security warnings. 
Override the warnings and proceed to the site. To prevent site visitors from encountering warning screens, you must obtain a trusted, 
CA-signed certificate that not only encrypts, but also publicly authenticates you as the owner of the site.








