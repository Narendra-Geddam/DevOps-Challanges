FROM golang:1.26-alpine AS builder

WORKDIR /backend

COPY . .

RUN go build -o backend

FROM alpine:3.23

WORKDIR /backend

COPY --from=builder /backend .

CMD [ "./backend" ]