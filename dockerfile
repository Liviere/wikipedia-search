FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

USER node

CMD ["yarn", "start"]