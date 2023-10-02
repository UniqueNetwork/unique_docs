from node:18-alpine3.17 as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

from nginx:stable-alpine as production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx"]
