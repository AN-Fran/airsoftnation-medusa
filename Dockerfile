FROM node:20-alpine

WORKDIR /app

# Copiamos solo manifests (mejora cache)
COPY package.json package-lock.json ./

# Instalación reproducible
RUN npm ci

# Copiamos el resto del código
COPY . .

EXPOSE 9000

CMD ["npm", "run", "start"]

