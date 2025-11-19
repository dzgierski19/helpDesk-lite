FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install -g @angular/cli

CMD ["sh", "-c", "npm install && npm start -- --host 0.0.0.0 --port 4200"]
