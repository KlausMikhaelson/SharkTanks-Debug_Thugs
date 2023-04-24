FROM node:12.2.0-alpine

WORKDIR /app

COPY . /app/

RUN npm install

EXPOSE 3001

CMD ["node","index.js"]                   
