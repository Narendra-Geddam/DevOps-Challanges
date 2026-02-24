<div align="center">

# Resource Hog Pod Challenge

### Run a greedy workload safely with strict Kubernetes limits

![Kubernetes](https://img.shields.io/badge/Kubernetes-Pod-326ce5?style=for-the-badge)
![CPU](https://img.shields.io/badge/CPU%20Limit-250m-e74c3c?style=for-the-badge)
![Memory](https://img.shields.io/badge/Memory%20Limit-500Mi-f39c12?style=for-the-badge)

</div>

---

## Objective

Deploy a standalone Pod that aggressively consumes resources, while keeping node stability by enforcing hard limits.

Target values:
- Pod: `hoggy`
- Namespace: `default`
- Image: `ghcr.io/iximiuz/labs/resource-hog/herder:v1.0.0`
- CPU limit: `250m`
- Memory limit: `500Mi`

---

## Files

- `hoggy.yaml`

---

## Deploy

```bash
kubectl apply -f hoggy.yaml
```

---

## Verify

```bash
kubectl get pod hoggy -n default
kubectl describe pod hoggy -n default
```

Expected:
- `hoggy` exists in `default`
- `restartPolicy: Always`
- Limits show `cpu: 250m` and `memory: 500Mi`
- Restarts may occur under pressure, but behavior is controlled

---

## Common Problems Faced

1. Pod runs but limits are missing
- Cause: limits not set under `resources.limits`
- Fix: add explicit `cpu` and `memory` limits

2. Wrong unit used for memory
- Cause: `500M` instead of `500Mi`
- Fix: use binary unit `Mi` as required

3. Pod name mismatch
- Cause: manifest name differs from expected `hoggy`
- Fix: set `metadata.name: hoggy`

---

## Final Status

- Manifest applied: PASS
- Limits enforced: PASS
- Challenge checks: PASS
