# ---- Builder Stage ----
# Installs all dependencies, builds the project, and then removes dev dependencies.
FROM node:23-alpine AS builder
WORKDIR /usr/src/app

# Copy dependency manifests and install ALL dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build the TypeScript project
COPY . .
RUN npm run build

# ---- Runner Stage ----
# Final, minimal image.
FROM node:23-alpine
WORKDIR /usr/src/app

# Set the environment to development
ENV NODE_ENV=development

# Copy the built application, production node_modules, and package.json from the builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./

# Create a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /usr/src/app/logs && chown -R appuser:appgroup /usr/src/app/logs
USER appuser

# Expose port and define the command to run the app
EXPOSE 3010
CMD ["npx", "clinicaltrialsgov-mcp-server"]