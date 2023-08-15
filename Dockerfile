FROM node:16.17.0

WORKDIR /usr/src/zvyezda/

COPY ./package.json ./

COPY . .

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install ffmpeg -y

RUN yarn

CMD ["yarn", "start:prod"]

EXPOSE 4005