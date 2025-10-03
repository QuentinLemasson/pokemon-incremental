# Container Setup for Kaptain's React Template

This document explains how to run the Kaptain's React Template application using Docker or Podman.

## Prerequisites

- **Docker**: Docker installed on your system + Docker Compose (optional)
- **Podman**: Podman Desktop installed + podman-compose (recommended for Podman users)

## Production Build

### Using Docker:

```bash
# Build the production image
npm run docker:build

# Run the container
npm run docker:run

# Or with docker-compose
docker-compose up --build
```

### Using Podman (Podman Desktop):

```bash
# Build the production image
npm run podman:build

# Run the container
npm run podman:run

# Or with podman-compose (recommended)
npm run podman:compose
```

The application will be available at `http://localhost:3000`

## Development Build

### Using Docker:

```bash
# Build and run development container
npm run docker:dev
```

### Using Podman:

```bash
# Build and run development container
npm run podman:dev
```

The development server will be available at `http://localhost:5173`

## Podman-Specific Commands

Since you're using Podman Desktop, here are the specific commands for your setup:

### Production with Podman:

```bash
# Build
podman build -t kaptain-react-template .

# Run
podman run -p 3000:80 kaptain-react-template

# Or with podman-compose
podman-compose up --build
```

### Development with Podman:

```bash
# Build development image
podman build -f Dockerfile.dev -t kaptain-react-template-dev .

# Run with volume mounting for hot reload (interactive mode)
podman run -it --name kaptain-react-template-dev -p 5173:5173 -v "$(Get-Location):/app" kaptain-react-template-dev
```

**Note**: The `-it` flag is crucial for keeping the development server running interactively. The container will persist in Podman Desktop after stopping.

## Podman Desktop Integration

With Podman Desktop, you can also:

1. **Use the GUI**: Build and run containers through the Podman Desktop interface
2. **View logs**: Monitor container logs in the Desktop app
3. **Manage images**: View and manage built images
4. **Port forwarding**: Configure port mappings in the GUI

## Key Differences: Docker vs Podman

| Feature      | Docker               | Podman                   |
| ------------ | -------------------- | ------------------------ |
| **Rootless** | Requires root/sudo   | Runs rootless by default |
| **Daemon**   | Requires daemon      | No daemon required       |
| **Compose**  | `docker-compose`     | `podman-compose`         |
| **Desktop**  | Docker Desktop       | Podman Desktop           |
| **Security** | Requires root access | More secure, rootless    |

## Troubleshooting

### Podman-specific issues:

1. **Volume mounting on Windows**: Use absolute paths with forward slashes

   ```bash
   podman run -v /c/Users/YourName/project:/app galipette-portal-dev
   ```

2. **Port conflicts**: Check if ports are already in use

   ```bash
   podman ps -a
   ```

3. **Image cleanup**: Remove old images

   ```bash
   podman image prune
   ```

4. **Container cleanup**: Remove stopped containers
   ```bash
   podman container prune
   ```

### Development-specific issues:

5. **Hot reload not working**: This is a common issue when running Vite inside a container with mounted volumes on Windows. The solution is to configure Vite to use polling for file watching.

   The `vite.config.ts` file has been configured with:

   ```typescript
   server: {
     watch: {
       usePolling: true,
     },
     host: true,
     strictPort: true,
     port: 5173,
   }
   ```

6. **Rollup native binary errors**: If you see errors like "Cannot find module @rollup/rollup-linux-x64-gnu", this is because the container is trying to use Windows binaries in a Linux environment. The `Dockerfile.dev` includes a `VOLUME /app/node_modules` instruction to isolate the Linux-specific binaries from the host mount.

7. **Container disappears after stopping**: By default, containers with the `--rm` flag are automatically removed. The development setup uses `-it` without `--rm` to keep containers persistent in Podman Desktop for inspection and restart.

## Recommended Workflow for Podman Users

```bash
# Development workflow
npm run podman:dev

# Production build and test
npm run podman:build
npm run podman:run

# Or use compose for easier management
npm run podman:compose
```

This setup gives you the same functionality as Docker but with Podman's security and rootless advantages!
