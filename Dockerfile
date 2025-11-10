# Stage 1: Build stage - Dùng để cài đặt dependencies và build project
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json để cài đặt dependencies
# Việc này tận dụng Docker cache, chỉ cài lại dependencies khi có thay đổi trong 2 file này
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm cả devDependencies)
RUN npm ci

# Sao chép toàn bộ source code của project vào container
COPY . .

# Build project NestJS, output sẽ nằm trong thư mục /usr/src/app/dist
RUN npm run build


# Stage 2: Production stage - Dùng để chạy ứng dụng
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json
COPY package*.json ./

# Chỉ cài đặt các production dependencies
# Lệnh này sẽ lấy từ node_modules của stage builder và loại bỏ devDependencies
# Điều này giúp image production nhẹ hơn rất nhiều
RUN npm ci --only=production && npm cache clean --force

# Sao chép thư mục dist đã được build từ stage "builder"
COPY --from=builder /usr/src/app/dist ./dist

# Mở cổng 3000 (cổng mặc định của NestJS)
EXPOSE 3000

# Lệnh để khởi chạy ứng dụng
CMD [ "node", "dist/main.js" ]