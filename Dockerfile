FROM golang:alpine as builder
ARG CLOUDINARY_URL
ENV CLOUDINARY_URL=$CLOUDINARY_URL
RUN apk update && apk add --no-cache git
WORKDIR /app
COPY . .

RUN go mod tidy

RUN go run ./cmd/build

# Install pip and python3 for cloudinary-cli
RUN apk add python3 && \
    python3 -m venv .venv && \
    . .venv/bin/activate && \
    python3 -m pip install cloudinary-cli && \
    cld uploader upload public/styles/app.min.css folder="assets" tags="assets" public_id="app.min.css" && \
    cld uploader upload public/scripts/app.min.js folder="assets" tags="assets" public_id="app.min.js"
RUN rm -rf public/styles public/scripts

RUN go build -o tmp/main ./cmd/web/main.go
ENTRYPOINT ["/app/tmp/main"]