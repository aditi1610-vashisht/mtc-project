# Use the lightweight Nginx Alpine image as the base
FROM nginx:alpine

# Copy your website files into the Nginx server directory
# This assumes your index.html is in the same folder as the Dockerfile
COPY . /usr/share/nginx/html

# Expose port 80 to allow traffic to the web server
EXPOSE 80