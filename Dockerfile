FROM node:12.13.0-alpine as developer
WORKDIR /usr/app
ENTRYPOINT ./endpoint.sh
EXPOSE 3000

FROM developer as builder
COPY ./ /usr/app
RUN npm install \
  && npm run build

FROM builder as production
RUN rm -rf /node_modules/
CMD ["node", "server.js"]