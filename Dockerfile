FROM node:23-alpine
WORKDIR /study-nest/1v
ADD package.json package.json
RUN npm i
ADD . .
RUN npm run build
RUN npm prune --production
CMD ["node", "./dist/main.js"]