<div align="center">

# First Dockerfile Challenge

### Containerize a basic Node.js HTTP server from scratch

![Docker](https://img.shields.io/badge/Docker-Dockerfile-2496ed?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-Built--in%20HTTP-339933?style=for-the-badge)
![Image](https://img.shields.io/badge/Image-my--app:v1.0.0-ff6b00?style=for-the-badge)

</div>

---

## Objective

Write your first Dockerfile for a simple Node.js app and verify it runs on port `3000`.

Targets:
- Dockerfile created in app workspace
- Image built as `my-app:v1.0.0`
- Container responds on:
  - `/`
  - `/api/health`

---

## App Overview

The app is a single `server.js` file using only Node.js built-in modules.

Quick local check:

```bash
node ~/app/server.js
curl localhost:3000
curl localhost:3000/api/health
```

---

## Dockerfile Used

```Dockerfile
FROM node:alpine3.22

WORKDIR /app

COPY app/server.js .

EXPOSE 3000

ENTRYPOINT ["node"]
CMD ["server.js"]
```

---

## Build and Run

```bash
docker build -t my-app:v1.0.0 .
docker run -d -p 3000:3000 my-app:v1.0.0
```

---

## Validation

```bash
curl localhost:3000
curl localhost:3000/api/health
```

Expected:
- `/` returns the welcome HTML
- `/api/health` returns `{"status":"ok"}`

---

## Final Status

- Dockerfile created: PASS
- Image build `my-app:v1.0.0`: PASS
- Container started on port `3000`: PASS
- Health endpoint check: PASS
