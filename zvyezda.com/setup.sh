# Update
apt-get update -y
apt-get upgrade -y

# Install Dependencies
apt-get install -y nginx

# Update Nginx configuration
cp default.conf /etc/nginx/conf.d/default.conf

# Install Go
apt-get install -y wget
wget https://dl.google.com/go/go1.20.2.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.20.2.linux-amd64.tar.gz
PATH $PATH:/usr/local/go/bin

# Install NodeJs
apt install -y curl
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc
nvm install 16.14.0
nvm use 16.14.0
npm install -g yarn