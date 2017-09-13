FROM node:6.10.2-alpine


ADD package.json /app/

RUN cd /app && \
    npm install --production

ADD . /app



CMD ["node","app/app.js" ]
CMD ["npm", "start"]
