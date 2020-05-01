FROM node:alpine as builder

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm build

FROM nginx
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
