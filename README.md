<div align="center">

# DevOps Challenge Track

### Hands-on labs from Iximiuz, documented as production-style runbooks

![Status](https://img.shields.io/badge/Status-Active-ff6b00?style=for-the-badge)
![Type](https://img.shields.io/badge/Type-Challenge%20Portfolio-00b894?style=for-the-badge)
![Focus](https://img.shields.io/badge/Focus-Kubernetes%20%7C%20Linux%20%7C%20Debugging-0984e3?style=for-the-badge)

</div>

---

## What This Repository Contains

This repository tracks solved DevOps challenges with practical commands, manifests, and troubleshooting notes.

Every challenge folder is structured to be:
- Reproducible
- Review-friendly
- Useful as a quick reference later

---

## Challenge Index

| Challenge | Focus Area | Status |
|---|---|---|
| `private-registry-k8s` | Kubernetes image pull secrets | Complete |
| `resourceHogPod` | Pod resource limits and restart behavior | Complete |
| `cgroupsOOMlinux` | Linux cgroup v2 memory/cpu and group OOM control | Complete |

---

## How To Use This Repo

1. Open a challenge directory.
2. Read the local `README.md` for objective and verification steps.
3. Apply manifests or commands exactly as listed.
4. Validate using the included checklist.

---

## Why This Matters

These labs focus on realistic failure conditions: OOM events, resource starvation, private image auth, and reliability under constraints.

The goal is not only to pass checks, but to build repeatable operational instincts.
