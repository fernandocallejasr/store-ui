FROM node:24.14.1-alpine3.23 AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# --------  Production image build   ---------
FROM nginx:1.28.3-alpine3.23 AS production
COPY --from=builder  /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]