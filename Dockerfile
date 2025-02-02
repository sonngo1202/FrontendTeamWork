FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy mã nguồn vào container
COPY . .

RUN npm run build

#Sử dụng Nginx để phục vụ ứng dụng React đã build
FROM nginx:alpine

# Copy các file đã build từ container build vào thư mục phục vụ của Nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
