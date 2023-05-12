FROM mhart/alpine-node:16 AS builder
WORKDIR /app
COPY build ./build

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["node", "/app/index.js"]
