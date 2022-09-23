FROM node:18 AS builder

WORKDIR  /app
COPY . .
# Note: You can mount multiple secrets
RUN --mount=type=secret,id=npmrc,dst=/root/.npmrc yarn
RUN yarn build

FROM node:18 AS prod
ENV NODE_ENV=production
USER node
WORKDIR /usr/src/app
COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/yarn.lock ./
RUN npm pkg set scripts.postinstall="echo no-postinstall"
RUN --mount=type=secret,id=github,dst=/root/.npmrc yarn
COPY --from=builder --chown=node:node /app ./
CMD [ "yarn", "start" ]
