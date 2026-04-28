# Cloud & DevOps - Learning Guide

## 🎯 Goal
Master cloud infrastructure, containers, and DevOps — automate everything, deploy at scale. Every company needs DevOps engineers.

## 💰 Salary Range (India)
| Level | Salary |
|-------|--------|
| Fresher | ₹6-12 LPA |
| Mid (2-4 yrs) | ₹15-30 LPA |
| Senior / SRE | ₹30-55 LPA |
| Staff / Architect | ₹50-1 Cr+ |

---

## Core Concepts

1. **Linux Administration** — Shell, processes, networking, systemd
2. **Networking** — TCP/IP, DNS, load balancers, firewalls, CDN
3. **Containers** — Docker, images, volumes, multi-stage builds
4. **Orchestration** — Kubernetes, pods, services, deployments, Helm
5. **CI/CD** — GitHub Actions, Jenkins, GitLab CI, ArgoCD
6. **Infrastructure as Code** — Terraform, Pulumi, CloudFormation
7. **Cloud Providers** — AWS, Azure, GCP (pick one primary)
8. **Monitoring** — Prometheus, Grafana, ELK, Datadog, PagerDuty
9. **Security** — IAM, secrets management, network policies, scanning
10. **GitOps** — ArgoCD, Flux, declarative infrastructure

---

## AWS Core Services

| Service | Purpose |
|---------|---------|
| **EC2** | Virtual machines |
| **S3** | Object storage |
| **RDS** | Managed databases |
| **Lambda** | Serverless functions |
| **ECS/EKS** | Container orchestration |
| **CloudFront** | CDN |
| **Route53** | DNS |
| **IAM** | Access management |
| **VPC** | Virtual networking |
| **SQS/SNS** | Message queues |

---

## Quick Reference

### Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Terraform — AWS EC2
```hcl
provider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  
  tags = {
    Name = "Lessario-Server"
  }
}
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-api
  template:
    metadata:
      labels:
        app: my-api
    spec:
      containers:
      - name: api
        image: myregistry/api:v1
        ports:
        - containerPort: 3000
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
```

### GitHub Actions CI/CD
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Build Docker image
      run: docker build -t myapp .
    - name: Push to registry
      run: docker push myapp
    - name: Deploy to K8s
      run: kubectl apply -f k8s/
```

---

## SpaceX/Tesla Relevance
- SpaceX uses **Kubernetes** for Starlink ground station infrastructure
- Tesla uses **CI/CD** for continuous OTA vehicle software updates
- xAI runs massive **GPU clusters** on cloud/custom infra
- All Musk companies value **infrastructure automation**

---

## Tips
- **Learn Docker first** → then Kubernetes → then cloud
- **AWS is #1** in India market share — learn it first
- **Terraform is essential** — IaC is non-negotiable
- **Get AWS Solutions Architect cert** — opens many doors
- **Automate everything** — if you do it twice, script it

Automate the world! ☁️
