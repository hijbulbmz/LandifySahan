# Landify Backend Deployment Guide

## Production Environment Variables
Before running in production, ensure the following environment variables are set:

| Variable | Description |
|---|---|
| `DB_URL` | Production Database JDBC URL |
| `DB_USERNAME` | Database Username |
| `DB_PASSWORD` | Database Password |
| `JWT_SECRET` | Strong secret key for JWT (min 32 chars) |
| `JWT_EXPIRATION` | Token validity in milliseconds |

## JVM Optimizations
Recommended JVM flags for a production environment (assuming 2GB+ RAM):
```bash
java -Xms512m -Xmx1024m -XX:+UseG1GC -jar landify-backend.jar --spring.profiles.active=prod
```

## Production Checklist
- [ ] `spring.profiles.active` is set to `prod`.
- [ ] `spring.jpa.hibernate.ddl-auto` is set to `none`.
- [ ] Sensitive secrets are handled via environment variables.
- [ ] Logback is configured to write to a rolling file with 30-day retention.
- [ ] Spring Boot Actuator is enabled, and detail exposure is restricted.
- [ ] CORS is restricted to the production frontend domain.
- [ ] `spring.jpa.open-in-view` is disabled to prevent memory leaks and N+1 issues.
- [ ] Verification that all endpoints require authentication unless explicitly public.
- [ ] Health check (`/actuator/health`) is reachable and returning `UP`.

## Monitoring
- Health Check: `/actuator/health`
- Info: `/actuator/info`
