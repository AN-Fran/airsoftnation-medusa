FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build de Medusa
RUN npx medusa build

EXPOSE 9000

CMD ["npx", "medusa", "start", "--host", "0.0.0.0", "--port", "9000"]
