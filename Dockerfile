FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn add prisma -D
RUN yarn prisma generate

EXPOSE 5000

CMD ["yarn", "start"]
