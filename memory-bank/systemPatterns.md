# System Patterns

2025-04-13 12:47:30 - Documenting container and deployment patterns

## Deployment Patterns

### Docker Container Structure
- Nginx base image for serving static files
- Multi-stage build process
  * Stage 1: Node.js build environment
  * Stage 2: Nginx runtime environment

### CI/CD Pattern
- GitHub Actions workflow
- Docker image versioning
- Automated testing and deployment
- Security scanning integration

## Infrastructure Patterns

### Container Runtime
- Nginx configuration for SPA
- Static file serving
- Caching strategies

### Security Patterns
- Docker image scanning
- Dependencies audit
- Minimal runtime image