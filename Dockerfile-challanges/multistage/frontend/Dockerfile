FROM node:20-alpine AS builder

WORKDIR /frontend

COPY . .

RUN npm install 

RUN npm run build

FROM node:20-alpine

WORKDIR /frontend

COPY package*.json .

RUN npm ci --omit=dev

EXPOSE 3000

COPY --from=builder /frontend/dist/server.js .

CMD [ "node", "server.js" ]