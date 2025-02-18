FROM node:18-alpine3.16 AS build

WORKDIR /dockerbuild
COPY . .

RUN npm install \
    && npm run build \
    && rm -rf /dockerbuild/lib/scripts

FROM node:18-alpine3.16

ENV MONGO_CONNECTION_URL="mongodb://mongo:27017"
ENV MONGONAUT_READONLY="true"

WORKDIR /opt/mongonaut

COPY --from=build /dockerbuild/* /opt/mongonaut/

RUN apk -U add --no-cache \
        bash=5.1.16-r2 \
        tini=0.19.0-r0 \
    && yarn workspaces focus --production

EXPOSE 8081

CMD ["/sbin/tini", "--", "npm", "start"]