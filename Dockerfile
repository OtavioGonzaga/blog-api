ARG NODE_VERSION=22.13.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json tsconfig.build.json ./

RUN yarn --production
COPY node_modules ./node_modules

RUN yarn build

COPY dist ./dist

EXPOSE 3000

CMD ["yarn", "start:prod"]