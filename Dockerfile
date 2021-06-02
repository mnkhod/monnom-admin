FROM node:15.11.0

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

RUN npm install serve -g

COPY . .

ENV GENERATE_SOURCEMAP=false
RUN npm run build

# environment variables
ENV REACT_APP_STRAPI_BASE_URL=https://strapi.monnom.mn
ENV REACT_APP_EXPRESS_BASE_URL=https://express.monnom.mn

# port
EXPOSE 3000

# start
CMD ["serve", "-s", "build", "-p", "3000"]