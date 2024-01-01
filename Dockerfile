# First stage: Build static assets
FROM oven/bun:1 as bundler
WORKDIR /static
COPY public/scripts scripts
COPY public/styles styles
RUN bun build scripts/app.js --outfile scripts/app.min.js --minify
RUN bunx lightningcss-cli --minify --bundle --targets '>= 0.25%' styles/app.css -o styles/app.min.css

# Second stage: Build Go application
FROM golang:alpine as builder
RUN apk update && apk add --no-cache git
RUN rm -rf public/styles public/scripts
WORKDIR /app
COPY . .
# Copy static assets from first stage
COPY --from=bundler /static/scripts/app.min.js public/scripts/app.min.js
COPY --from=bundler /static/styles/app.min.css public/styles/app.min.css
RUN go mod tidy
RUN go build -o tmp/main ./cmd/web/main.go
ENTRYPOINT ["/app/tmp/main"]