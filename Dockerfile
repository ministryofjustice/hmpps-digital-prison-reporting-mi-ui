# Stage: base image
FROM node:24.12-bullseye-slim AS base

ARG BUILD_NUMBER=1_0_0
ARG GIT_REF=not-available
LABEL maintainer="HMPPS Digital Studio <info@digital.justice.gov.uk>"

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

RUN addgroup --gid 2000 --system appgroup && \
        adduser --uid 2000 --system appuser --gid 2000

WORKDIR /app

# Cache breaking
ENV BUILD_NUMBER=${BUILD_NUMBER:-1_0_0}

RUN apt-get update && \
        apt-get upgrade -y && \
        apt-get autoremove -y && \
        rm -rf /var/lib/apt/lists/*

# Stage: build assets
FROM base AS build

ARG BUILD_NUMBER=1_0_0
ARG GIT_REF=not-available

RUN apt-get update && \
        apt-get install -y make python g++

COPY package*.json ./
COPY .allowed-scripts.mjs ./
RUN CYPRESS_INSTALL_BINARY=0 npm run setup --no-audit
ENV NODE_ENV='production'

COPY . .
RUN npm run build

ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV GIT_REF=${GIT_REF}
RUN npm run record-build-info

RUN apt-get update && apt-get install -y ca-certificates

ENV RELEASE_GIT_SHA=${GIT_REF}
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN if [ -z "$SENTRY_AUTH_TOKEN" ]; then echo "No sentry env var, not running sourcemapping"; else npm run sentry:login && npm run sentry:sourcemaps; fi
RUN npm prune --no-audit --omit=dev
# Stage: copy production assets and dependencies
FROM base

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

CMD [ "npm", "start" ]
