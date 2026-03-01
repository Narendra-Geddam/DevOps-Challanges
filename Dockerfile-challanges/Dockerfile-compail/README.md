<div align="center">

# Build and Compile Apps in Dockerfiles

<p><strong>Challenge:</strong> containerize a TypeScript frontend and a Go backend that both require a build step.</p>

![Challenge](https://img.shields.io/badge/Lab-Iximiuz-0ea5e9?style=for-the-badge)
![Docker](https://img.shields.io/badge/Focus-Dockerfile%20Builds-2563eb?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Complete-16a34a?style=for-the-badge)

</div>

---

## Goal

Build two images:

- `my-frontend:v1.0.0` from TypeScript source
- `my-backend:v1.0.0` from Go source

Both must start and respond on runtime ports.

---

## Solution Layout

| Component | Path | Notes |
|---|---|---|
| Frontend | `./frontend` | Node + TypeScript compile with `npm run build` |
| Backend | `./backend` | Go compile with `go build` |

Detailed write-ups:

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

## Verification Commands

```bash
docker build -t my-frontend:v1.0.0 ./frontend
docker run --rm -p 3000:3000 my-frontend:v1.0.0

docker build -t my-backend:v1.0.0 ./backend
docker run --rm -p 8080:8080 my-backend:v1.0.0
```

---

## Build Evidence

<p align="center">
  <img src="./frontend/frontend.png" alt="Frontend build and run output" width="48%" />
  <img src="./backend/backend.png" alt="Backend build and run output" width="48%" />
</p>

---

## Key Fixes During Debugging

- Updated backend base image to `golang:1.26-alpine` to match `go.mod` (`go 1.26`).
- Fixed frontend container start command so `dist/server.js` is executed correctly.
- Confirmed both containers run successfully on ports `3000` and `8080`.

---

## Problems I Faced (Real Run Notes)

1. Backend build failed with:
   `go.mod requires go >= 1.26 (running go 1.22.12)`.
   Fix: upgraded Docker base image from `golang:1.22-alpine` to `golang:1.26-alpine`.
2. Tried `COPY go.mod go.sum ./` but `go.sum` did not exist.
   Fix: used `COPY . .` and direct `go build` for this challenge layout.
3. Frontend container initially failed with:
   `Cannot find module '/node dist/server.js'`.
   Fix: corrected Docker `CMD` exec form to `["node", "dist/server.js"]`.
4. Confusion while testing backend using `/`.
   Backend only exposes `/api/health` and `/api/message`, so `/` returned `404` by design.
5. Port conflict happened on `3000` (`port is already allocated`).
   Fix: removed old container or mapped a different host port.
6. Used wrong URL once: `//api/health` (double slash), which caused route miss.

---

## What I Learned (First Time with npm + Go)

- `npm` and `go` toolchains must match the project requirements before Docker build.
- TypeScript apps need a build step (`npm run build`) before running `node dist/server.js`.
- Go apps follow `go.mod`; Docker image Go version must satisfy that version.
- A running server does not mean `/` exists; only defined routes are valid.
- Small Docker syntax mistakes in `CMD`/`COPY` can break runtime.
- Layer caching can hide bad instructions; `--no-cache` helps when debugging.
