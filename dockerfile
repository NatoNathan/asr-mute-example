FROM node:16 AS builder



USER node
WORKDIR  /app
COPY --chown=node:node . .
# Note: You can mount multiple secrets
RUN --mount=type=secret,id=WORK_NPM_TOKEN \
    WORK_NPM_TOKEN="$(cat /run/secrets/WORK_NPM_TOKEN)" yarn
RUN yarn
RUN yarn build

FROM node:16 AS prod
ENV NODE_ENV=production
USER node
WORKDIR /usr/src/app
COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/yarn.lock ./
RUN npm pkg set scripts.postinstall="echo no-postinstall"
RUN yarn
COPY --from=builder --chown=node:node /app ./
CMD [ "yarn", "start" ]
