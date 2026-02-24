<div align="center">

# RESOURCE HOG POD CHALLENGE

### Run a greedy container safely with hard resource limits

![Kubernetes](https://img.shields.io/badge/Kubernetes-Standalone%20Pod-326ce5?style=for-the-badge)
![CPU](https://img.shields.io/badge/CPU%20Limit-250m-e74c3c?style=for-the-badge)
![Memory](https://img.shields.io/badge/Memory%20Limit-500Mi-f39c12?style=for-the-badge)

</div>

---

## Challenge Objective

Deploy a resource-hungry Pod that continuously stresses CPU and memory, but keep the cluster stable by enforcing strict limits.

Target:
- Pod name: `hoggy`
- Namespace: `default`
- Image: `ghcr.io/iximiuz/labs/resource-hog/herder:v1.0.0`

---

## Requirements

- Deploy a standalone Pod named `hoggy`
- Ensure it restarts automatically after crashes/termination
- Enforce limits:
  - CPU: `250m`
  - Memory: `500Mi`

---

## Quick Start

1. Apply the manifest:

```bash
kubectl apply -f hoggy.yaml
```

2. Watch pod behavior:

```bash
kubectl get pod hoggy -w
```

3. Confirm limits are applied:

```bash
kubectl describe pod hoggy
```

---

## Included Manifest

- `hoggy.yaml`

---

## Success Criteria

- Pod `hoggy` is running in `default`
- Pod has `restartPolicy: Always`
- Resource limits are set to `250m` CPU and `500Mi` memory
- Pod may restart due to OOM/pressure but cluster remains responsive

<div align="center">

## Challenge Complete When All Checks Pass

</div>
