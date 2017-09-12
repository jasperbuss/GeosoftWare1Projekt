FROM node:6.10.2-alpine


ADD . /app/

RUN cd /app && \
    npm install --production

CMD ["node", "/app/app.js"]
