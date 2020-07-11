FROM node:alpine
WORKDIR /usr/app
RUN apk --no-cache add git curl
RUN mkdir -p /usr/app
COPY package.json package-lock.json /usr/app/
RUN npm install
COPY . /usr/app
EXPOSE 8080
ENTRYPOINT ["npm", "run", "start"]
