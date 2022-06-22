# Wikipedia Viewier

![Wikipedia Viewier](screen.jpg)

A simple application to search wikipedia entries.

You can try it [here](https://wikipedia.liviere.pl)

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

## Deployment

You can set a custom port for the app with the `.env` file, otherwise it
will run on port 3000.

```bash
PORT=3030
```

### Node.js

1. First, install dependecies:

```bash
npm install
# or
yarn install
```

> :warning: If you have incompatibility error while installing modules, try to update node version.

<br>

2. Build your application for production:

```bash
npm run build
# or
yarn build
```

3. Run the application:

```bash
npm run start
# or
yarn start
```

### PM2 (Daemon process manager)

It's recommended to use PM2 to manage Node.js applications.

First, install pm2:

```bash
sudo npm install pm2@latest -g
# or
sudo yarn global add pm2
```

Then run the application:

```bash
pm2 start pm2.config.js
```

You can learn more [here](https://pm2.keymetrics.io/docs/usage/quick-start/).

### Docker Deployment

1. install [Docker](https://docs.docker.com/get-docker/) and [Docker-Compose](https://docs.docker.com/compose/install/).
2. Build and run the application:

```bash
docker-compose up
```

### NGINX Basic Configuration

```
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         http://127.0.0.1:3000;
    }
}
```
