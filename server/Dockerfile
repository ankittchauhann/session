#using the base image
FROM node:lts-alpine3.17

#setting the working directory
WORKDIR /app

#copying the package.json file
COPY package*.json .

#installing the dependencies
RUN npm install

#copying the rest of the files
COPY . .

#exposing the port
EXPOSE 5000

#running the app
CMD ["npm", "run", "server"]
