# Scalability Notes

This document outlines quick, practical approaches to scale the Secure Notes Vault backend.

1. Microservices
- Split responsibilities into services: `auth`, `notes`, `audit`.
- Each service can be deployed independently and scaled based on load.

2. Caching
- Use Redis for caching frequently-read notes metadata and session data.
- Cache JWT blacklist / revocation lists when needed.

3. Database Scaling
- Vertical scale for small loads; move to sharded MongoDB for large datasets.
- Use read replicas for read-heavy workloads (serve `GET /notes` from replicas).

4. Load Balancing
- Place API behind a load balancer (NGINX, AWS ELB) and run multiple stateless instances.
- Use health checks and autoscaling rules.

5. File and CDN
- If notes include attachments, store in object storage (S3) and serve via CDN.

6. Observability
- Add centralized logging (ELK) and metrics (Prometheus + Grafana) for capacity planning.

7. Security & Performance
- Rate limit auth endpoints to prevent abuse.
- Use HSM or KMS for encryption keys in production (don’t keep `ENCRYPTION_KEY` in plaintext env).

These steps prioritize horizontal scalability, stateless services, and fast read paths.
