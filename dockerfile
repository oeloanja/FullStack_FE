FROM --platform=$BUILDPLATFORM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all project files
COPY . .

ARG TARGETPLATFORM
ARG BUILDPLATFORM

# Build the application
RUN echo "Building on $BUILDPLATFORM, targeting $TARGETPLATFORM" && \
    npm run build

FROM --platform=$TARGETPLATFORM node:18-alpine AS runner

WORKDIR /app

# Copy necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/app ./app
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the application
CMD ["npm", "start"]