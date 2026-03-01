<div align="center">

# Frontend Dockerfile Challenge

![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge)
![Runtime](https://img.shields.io/badge/Runtime-Node%2020-22c55e?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Complete-16a34a?style=for-the-badge)

</div>

---

## Objective

Create a Docker image for a TypeScript frontend that:

- Uses a Node.js base image
- Installs dependencies (including compiler-related dev dependencies)
- Compiles TypeScript into JavaScript
- Starts the compiled output at container startup

---

## Dockerfile Used

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

---

## Build and Run

```bash
docker build -t my-frontend:v1.0.0 .
docker run --rm -p 3000:3000 my-frontend:v1.0.0
```

Quick checks:

```bash
curl http://localhost:3000
curl http://localhost:3000/api/health
```

---

## Screenshot

![Frontend build proof](./frontend.png)

---

## Problems Faced

1. Container failed with `Cannot find module '/node dist/server.js'`.
   Cause: wrong `CMD` format.
   Fix: `CMD ["node", "dist/server.js"]`.
2. UI looked static even when backend was running.
   Cause: homepage `/` is static by design; backend call is handled on `/api/greeting`.
3. Test call failed when using double slash (`//api/health`).
   Fix: use exact route `/api/health`.
4. Port `3000` was already in use by another process/container.
   Fix: stop old container or run with another host port.

---

## What I Learned (npm First Experience)

- `npm run build` is different from `npm build`; script must exist under `package.json > scripts`.
- `npm ci --omit=dev` is preferred for reproducible production installs.
- Build stage can include dev dependencies, runtime stage should keep only production deps.
- Route behavior must be tested endpoint by endpoint, not only by homepage output.
