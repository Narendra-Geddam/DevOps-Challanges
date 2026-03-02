<div align="center">

# Build and Compile Apps in Dockerfiles

<p><strong>Challenge:</strong> containerize a TypeScript frontend and a Go backend that both require a build step.</p>

![Challenge](https://img.shields.io/badge/Lab-Iximiuz-0ea5e9?style=for-the-badge)
![Docker](https://img.shields.io/badge/Focus-Dockerfile%20Builds-2563eb?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Complete-16a34a?style=for-the-badge)

</div>

---

## Objective

Build two production-ready images from source code:

- `my-frontend:v1.0.0` (TypeScript -> JavaScript)
- `my-backend:v1.0.0` (Go -> compiled binary)

Both containers must start successfully and respond on expected ports.

---

## Concept Primer

This challenge tests a common real-world pattern: **build-time compile + runtime execute**.

- Frontend needs `npm run build` so TypeScript can become runnable JS.
- Backend needs `go build` so source can become an executable binary.

If compilation is missing in Dockerfile, container may build but fail to run.

---

## Solution Layout

| Component | Path | Why It Matters |
|---|---|---|
| Frontend | `./frontend` | Validates Node/TypeScript build flow and startup command correctness |
| Backend | `./backend` | Validates Go toolchain compatibility and binary execution |

Detailed sub-guides:

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

---

## Final Dockerfiles (Single-Stage)

### Frontend

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Backend

```dockerfile
FROM golang:1.26-alpine
WORKDIR /app
COPY . .
RUN go build -o app
EXPOSE 8080
CMD ["./app"]
```

---

## Build and Run

```bash
docker build -t my-frontend:v1.0.0 ./frontend
docker run --rm -p 3000:3000 my-frontend:v1.0.0

docker build -t my-backend:v1.0.0 ./backend
docker run --rm -p 8080:8080 my-backend:v1.0.0
```

---

## What Went Wrong (And How Solved)

1. Frontend startup failed due to incorrect `CMD` format.
Fix: use JSON array form: `CMD ["node", "dist/server.js"]`.

2. Backend build failed due to Go version mismatch.
Fix: use `golang:1.26-alpine` to match `go.mod` requirement.

3. Route validation confusion (`/` showed static page, not API behavior).
Fix: validate API routes directly (`/api/health`, `/api/message`).

---

## Validation Checklist

- [ ] both images build successfully
- [ ] both containers start without crash
- [ ] frontend responds on `3000`
- [ ] backend responds on `8080`
- [ ] health endpoints return expected output
