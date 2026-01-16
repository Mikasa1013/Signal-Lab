FROM node:20-alpine

WORKDIR /app

COPY apps/frontend/package*.json ./
RUN npm install

COPY apps/frontend/ .

EXPOSE 3000

CMD ["npm", "run", "dev"]
