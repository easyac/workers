FROM quay.io/ivanvanderbyl/docker-nightmare:latest

ADD . /workspace
RUN npm install # if you have package.json and/or yarn.lock

CMD node index.js
