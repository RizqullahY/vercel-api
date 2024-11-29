FROM node 
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD [ "npx tsx watch", "api/app.ts" ]
