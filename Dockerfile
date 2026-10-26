# Stage: build assets
FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine AS build

WORKDIR /app

ARG BUILD_NUMBER=1_0_0
ARG GIT_REF=not-available

COPY package*.json .npmrc .allowed-scripts.mjs ./
RUN CYPRESS_INSTALL_BINARY=0 NPM_CONFIG_AUDIT=false NPM_CONFIG_FUND=false npm run setup
ENV NODE_ENV='production'

COPY . .
RUN npm run build

ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV GIT_REF=${GIT_REF}
RUN npm run record-build-info

RUN apk upgrade --no-cache && apk add --no-cache ca-certificates

ENV RELEASE_GIT_SHA=${GIT_REF}
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN if [ -z "$SENTRY_AUTH_TOKEN" ]; then echo "No sentry env var, not running sourcemapping"; else npm run sentry:login && npm run sentry:sourcemaps; fi
RUN npm prune --no-audit --omit=dev --no-fund

# Stage: copy production assets and dependencies
FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine-runtime

COPY --from=build --chown=appuser:appgroup \
        /app/package.json \
        /app/package-lock.json \
        ./

COPY --from=build --chown=appuser:appgroup \
        /app/build-info.json ./dist/build-info.json

COPY --from=build --chown=appuser:appgroup \
        /app/dist ./dist

COPY --from=build --chown=appuser:appgroup \
        /app/node_modules ./node_modules

EXPOSE 3000 3001

ENV NODE_ENV='production'
USER 2000

CMD ["sh", "-c", "node $NODE_OPTIONS dist/server.js | bunyan -o short"]
