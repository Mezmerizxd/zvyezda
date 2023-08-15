# Social App V2
sudo docker kill social_app_v2
sudo docker rm social_app_v2

# Zvyezda
sudo docker kill zvyezda
sudo docker rm zvyezda

# Postgres
sudo docker kill postgres
sudo docker rm postgres

# Portfolio
sudo docker kill portfolio
sudo docker rm portfolio

# Delete old images
sudo docker image rm -f mezmerizxd/social_app_v2:latest
sudo docker image rm -f zvyezda:latest
sudo docker image rm -f mezmerizxd/portfolio:latest