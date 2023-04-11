FROM node:18

WORKDIR /opt/meny

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

CMD [ "npm", "run", "start:dev" ]
