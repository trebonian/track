FROM smebberson/alpine-nginx-nodejs

# Stream the nginx logs to stdout and stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# Build the npm modules
ADD root/track/package.json /track/package.json
RUN cd /track && npm install --production

# Add the files (works with .dockerignore to exclude /app/node_modules, so the above npm build isn't replaced)
ADD root /
