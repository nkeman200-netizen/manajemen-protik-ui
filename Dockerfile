# ==========================================
# STAGE 1: Build React App dengan Node.js
# ==========================================
FROM node:20-alpine as builder

WORKDIR /app

# Salin file package untuk caching dependencies
COPY package*.json ./
RUN npm install

# Salin seluruh source code (termasuk .env.production)
COPY . .

# Build aplikasi (Vite akan memanggang VITE_API_URL ke dalam file statis)
RUN npm run build

# ==========================================
# STAGE 2: Serve dengan Nginx Alpine
# ==========================================
FROM nginx:alpine

# Salin konfigurasi Nginx khusus SPA React
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Salin hasil build dari Stage 1 ke folder publik Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]