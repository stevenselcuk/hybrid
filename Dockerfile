FROM node:13

COPY ./ ./

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

EXPOSE 3000

CMD yarn build

CMD yarn start




# envs --
#ENV SECRET jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu
#ENV MONGODB_URI mongodb://localhost:27017/coeusTest
#ENV REDIS_URL redis://redis:6379
#ENV RATE_LIMIT 100
# -- envs

# processes --
#ENV WEB_CONCURRENCY 1
# -- processes
