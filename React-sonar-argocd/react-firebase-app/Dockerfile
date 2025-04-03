# Stage 1: Build React App
FROM node:18-slim AS react_builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Copy all project files, including .env.production
COPY . .
COPY .env.production .env  

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=react_builder /app/build .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
