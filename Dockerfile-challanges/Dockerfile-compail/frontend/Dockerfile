FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm run build  

EXPOSE 3000

CMD ["node", "dist/server.js"]