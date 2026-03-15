FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm run build

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["sh", "-c", "pnpm run db:migrate && pnpm start"]
