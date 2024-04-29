# ---- Dependencies ----
    FROM base AS dependencies
    COPY ./package*.json ./
    RUN npm install -d
    
    # ---- Build ----
    FROM dependencies AS build
    WORKDIR /app
    COPY ./src /app/src
    COPY ./ts*.json ./
    COPY ormconfig.js ./
    RUN npm run build
    
    # ---- Polishing ----
    FROM base AS polishing
    COPY ./package*.json ./
    RUN npm install --production -d
    
    # --- Release with Alpine ----
    FROM node:16-alpine3.17 AS release
    WORKDIR /app
    RUN mkdir dist node_modules
    RUN chown -R node:node /app
    USER node
    COPY --from=polishing app/node_modules node_modules/
    COPY --from=build app/dist dist/
    COPY --from=build app/ormconfig.js ./
    EXPOSE 6001
    CMD ["node","dist/main.js"]

FROM node:18.13.0

WORKDIR /app
COPY package*.json .
RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/main"]