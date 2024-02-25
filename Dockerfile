FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn add -D prisma
RUN yarn prisma generate

EXPOSE 5000

CMD ["yarn", "start"]
