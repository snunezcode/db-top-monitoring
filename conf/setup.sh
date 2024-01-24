#!/bin/bash
#Verify code version
version="$(curl https://version.code.ds.wwcs.aws.dev/?codeId=dbtop'&'moduleId=deploy)"

#Install Software Packages
#sudo yum install -y openssl
#sudo yum install -y nginx

max_attempts=10
attempt_num=1
success=false
while [ $success = false ] && [ $attempt_num -le $max_attempts ]; do
  echo "Trying yum install"
  sudo yum install -y openssl nginx
  # Check the exit code of the command
  if [ $? -eq 0 ]; then
    echo "Yum install succeeded"
    success=true
  else
    echo "Attempt $attempt_num failed. Sleeping for 3 seconds and trying again..."
    sleep 3
    ((attempt_num++))
  fi
done



#Create Certificates
sudo mkdir /etc/nginx/ssl/
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/server.key -out /etc/nginx/ssl/server.crt -subj "/C=US/ST=US/L=US/O=Global Security/OU=IT Department/CN=127.0.0.1"

#Copy Configurations
sudo cp conf/api.core.service /usr/lib/systemd/system/api.core.service
sudo cp conf/server.conf /etc/nginx/conf.d/

#Enable Auto-Start
sudo chkconfig nginx on
sudo chkconfig api.core on

#Change permissions
sudo chown -R ec2-user:ec2-user /aws/apps

#Copy aws-exports.json
cp /aws/apps/conf/aws-exports.json /aws/apps/frontend/public/
cp /aws/apps/conf/aws-exports.json /aws/apps/server/

#Re-Start NGINX Services
sudo service nginx restart


#Download PEM Key for DocumentDB
cd /aws/apps/server/; wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem



#NodeJS Installation
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh --output install.sh
sh install.sh
. ~/.nvm/nvm.sh
nvm install 20.11


#NodeJS API Core Installation
cd /aws/apps/server/; npm install;

#Re-Start API Services
sudo service api.core restart

#React Application Installation
cd /aws/apps/frontend/; npm install; npm run build;


#Copy build content to www folder
cp -r /aws/apps/frontend/build/* /aws/apps/frontend/www/
