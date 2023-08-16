# Update
apt-get update -y
apt-get upgrade -y

# Install Dependencies
apt-get install -y nginx

# Update Nginx configuration
cp default.conf /etc/nginx/conf.d/default.conf