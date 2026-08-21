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
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist/oeuvres-roud-app/* /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf
