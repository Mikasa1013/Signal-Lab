FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /app

# Copy backend package files
COPY apps/backend/package*.json ./
RUN npm install

# Copy backend source
COPY apps/backend/ .

# Copy prisma schema from repo root
COPY prisma/ ./prisma/

RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
