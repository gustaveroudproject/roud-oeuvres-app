# syntax=docker/dockerfile:1

# The Angular output is platform-independent. Build it once on the native
# BuildKit worker instead of running Node under QEMU for every target platform.
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

WORKDIR /app

COPY package-lock.json .
COPY package.json .
RUN npm ci

COPY src src
COPY scripts scripts
COPY tsconfig.json .
COPY angular.json .
# Several legacy component styles import the global Angular Material stylesheet.
# Serialise Sass compilation to avoid intermittent module-load loops until those
# imports are split into a dedicated shared-variables partial.
RUN NG_BUILD_MAX_WORKERS=1 npm run build

FROM nginx:alpine

COPY --from=builder /app/dist/oeuvres-roud-app/* /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf
