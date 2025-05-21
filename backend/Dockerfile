# STAGE 1: build stage using golang image to compile the service
FROM golang:1.24.3-alpine3.21 AS builder

# install git to download go dependencies
RUN apk add --no-cache git

#make a directory in the container to store all our application and navigate into it
WORKDIR /app/


# copy go.mod and go.sum files to the WORKDIR in the container
COPY go.mod go.sum ./

# download all dependencies
RUN go mod download

# copy all files from THIS directory to the WORKDIR in the container
COPY . .

# compile the service
RUN go build -o joinmun-backend ./cmd/api/main.go

# STAGE 2: Run stage using Alpine, but as a non-root user
FROM alpine:3.21

# add certificates 
RUN apk --no-cache add ca-certificates

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the current working directory in the container
WORKDIR /home/appuser/

# Copy binary before switching users (avoids permission issues)
COPY --from=builder /app/joinmun-backend /usr/local/bin/joinmun-backend

# Ensure binary is executable
RUN chmod +x /usr/local/bin/joinmun-backend

# Switch to the non-root user
USER appuser

# Run the compiled binary
CMD ["joinmun-backend"]