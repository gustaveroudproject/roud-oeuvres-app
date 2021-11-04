FROM node:alpine AS builder

WORKDIR /app

COPY package.json .
RUN npm install

COPY src src
COPY tsconfig.json .
COPY angular.json .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist/oeuvres-roud-app/* /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY pwd_file /etc/apache2/.htpasswd
