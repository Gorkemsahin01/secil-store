# 1. Node taban imajını çek
FROM node:18-alpine AS builder

# 2. Çalışma dizini oluştur
WORKDIR /app

# 3. Paketleri yükle
COPY package*.json ./
RUN npm install

# 4. Kodları kopyala ve build et
COPY . .
RUN npm run build

# 5. Production imajı oluştur
FROM node:18-alpine AS runner
WORKDIR /app

# Sadece gerekli dosyaları al
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]