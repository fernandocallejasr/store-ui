FROM node:24.14.1-alpine3.23 AS builder
WORKDIR /app

# VITE_* values are baked into the public JS bundle and are visible to
# any user who opens the site. Never pass secrets here — only public config.
ARG VITE_API_BASE_URL
ARG VITE_AXIOS_DEFAULT_TIMEOUT=10000
ARG VITE_USE_MOCK_PRODUCTS=false

RUN test -n "$VITE_API_BASE_URL" || (echo "VITE_API_BASE_URL is required" && exit 1)

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_AXIOS_DEFAULT_TIMEOUT=$VITE_AXIOS_DEFAULT_TIMEOUT \
    VITE_USE_MOCK_PRODUCTS=$VITE_USE_MOCK_PRODUCTS

COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# --------  Production image build   ---------
FROM nginx:1.28.3-alpine3.23 AS production
COPY --from=builder  /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]