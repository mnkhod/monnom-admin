FROM node:15.11.0

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

RUN npm install serve -g

COPY . .

ENV GENERATE_SOURCEMAP=false
RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build", "-p", "3000"]