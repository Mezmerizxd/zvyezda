FROM node:16.17.0

# Install Go
RUN apt-get update && apt-get install -y wget
RUN wget https://dl.google.com/go/go1.20.2.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.20.2.linux-amd64.tar.gz
ENV PATH $PATH:/usr/local/go/bin

WORKDIR /usr/src/zvyezda/

COPY ./package.json ./

COPY . .

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install ffmpeg -y

RUN yarn

CMD ["yarn", "start:prod"]

EXPOSE 4005
