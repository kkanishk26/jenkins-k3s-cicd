# Jenkins to K3s CI/CD Pipeline (Local, No AWS)

A complete CI/CD pipeline built entirely on a single local Ubuntu VM (UTM on Mac) — no cloud costs. Jenkins builds a Flask backend and React frontend, runs a basic health-check validation, loads the images directly into a local K3s cluster, updates the Kubernetes deployments, and verifies the rollout — all triggered automatically by a Git commit.

## Architecture
## Stack

Ubuntu, Git, GitHub, Jenkins, Docker, K3s, kubectl, Nginx, Flask, React (Vite).

## Why no external registry

Everything runs on one VM, so instead of pushing to Docker Hub, the pipeline builds the image locally and imports it directly into K3s's containerd image store (`k3s ctr images import`), then deploys with `imagePullPolicy: IfNotPresent`. Zero registry accounts, zero rate limits, zero external dependency for a single-node setup.

## Repository layout
## Ports

| Port | Purpose |
|---|---|
| 8080 | Jenkins UI |
| 6443 | K3s API server |
| 30080 | Frontend NodePort |
| 30081 | Backend NodePort |

## Running it yourself

1. Install Docker, K3s, and Jenkins on an Ubuntu VM.
2. Add the `jenkins` user to the `docker` group and give it a kubeconfig.
3. Create a Jenkins Pipeline job pointed at this repo, `Jenkinsfile` as the script path, with a Poll SCM trigger (`H/2 * * * *`).
4. `kubectl apply -f k8s/` once to create the baseline Deployments/Services.
5. Push a commit — Jenkins builds, validates, deploys, and verifies automatically.

## Screenshots

See `screenshots/` — Jenkins pipeline stages all green, `kubectl get pods`, `kubectl get svc`, and the running app in the browser.

## Future upgrade

Swap the local K3s import for a real registry (Docker Hub / Amazon ECR) and K3s for Amazon EKS once this version is solid.
