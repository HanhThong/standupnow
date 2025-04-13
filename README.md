# StandUpNow

Most of this project is written by **Roo**, an AI software engineer, using its advanced capabilities for test-driven development, systematic debugging, architectural planning, and comprehensive documentation through its multi-mode system (Code, Test, Debug, Architect, and Ask modes).

A React Native Expo application for managing stand-up timing, built with modern web technologies and containerized for deployment.

## Features
- Cross-platform support (iOS, Android, Web)
- Containerized web deployment
- Automated CI/CD pipeline
- Security-first configuration

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. For web development:
```bash
npm run web
```

## Docker Deployment

### Local Development with Docker

1. Build the container:
```bash
docker build -t standupnow .
```

2. Run the container:
```bash
docker run -p 8080:80 standupnow
```

3. Access the application at `http://localhost:8080`

### Production Deployment

The application uses GitHub Actions for automated builds and deployments to Docker Hub.

#### Prerequisites

1. Create a Docker Hub account if you don't have one
2. Create an access token in Docker Hub (Security settings)
3. Add the following secrets to your GitHub repository:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token

#### Deployment Process

1. Push to main branch triggers automatic:
   - Build process
   - Security scanning
   - Push to Docker Hub

2. Pull the latest image:
```bash
docker pull [your-username]/standupnow:latest
```

3. Run in production:
```bash
docker run -d -p 80:80 [your-username]/standupnow:latest
```

## Security Features

- Multi-stage Docker builds for minimal attack surface
- Security headers configured in Nginx
- Automatic vulnerability scanning with Trivy
- Regular security updates via GitHub Actions
- Content Security Policy implementation
- HTTP security headers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License