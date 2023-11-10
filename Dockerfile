FROM node:latest

WORKDIR /app

COPY . .

RUN npm install --quiet --no-optional --no-fund --loglevel=error

RUN npm run build

CMD ["npm", "run", "start:dev"]