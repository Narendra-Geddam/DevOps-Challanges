<div align="center">

# OOM Killer Savior Challenge

### Keep Pods alive through OOM pressure without kubelet-wide changes

![Kubernetes](https://img.shields.io/badge/Kubernetes-1.28--1.32-326ce5?style=for-the-badge)
![OOM Behavior](https://img.shields.io/badge/OOM-Workload%20Scoped-success?style=for-the-badge)
![CPU Limit](https://img.shields.io/badge/CPU%20Limit-250m-e74c3c?style=for-the-badge)
![Memory Limit](https://img.shields.io/badge/Memory%20Limit-256Mi-f39c12?style=for-the-badge)

</div>

---

## Objective

Deploy a multi-process workload that survives OOM events **without restarts**, while keeping strict resource limits and one pod per node.

Challenge targets:
- Workload: `Deployment/herder` in `default`
- Image: `ghcr.io/iximiuz/labs/resource-hog/herder:v1.0.0`
- Replicas: at least number of cluster nodes
- Scheduling: one `herder` pod per node
- Limits per pod: `cpu: 250m`, `memory: 256Mi`
- Stability: run at least 60s with `RESTARTS = 0`

---

## What Changed in Kubernetes

| Version | Default OOM Behavior | Practical Effect |
|---|---|---|
| `<= 1.27` | process-level OOM kill possible | child can die while container stays alive |
| `1.28 - 1.31` | stronger group-style kill behavior | one OOM can restart full container |
| `1.32+` | kubelet flag `singleProcessOOMKill` available | can restore old behavior, but only node-wide |

Key insight: node-wide kubelet tuning is too broad for mixed workloads. This challenge requires a **selective, workload-level** solution.

---

## Learning Journey (From Previous Challenges)

### 1) From `resourceHogPod`
- Learned strict resource limit wiring in Kubernetes manifests.
- Learned how aggressive workloads behave when CPU/memory are constrained.

### 2) From `cgroupsOOMlinux`
- Learned direct cgroup controls (`memory.max`, `cpu.max`, `memory.oom.group`).
- Learned how group-vs-process OOM behavior changes failure mode.

### 3) Applied in `OOMKillerSavior`
- Combined Kubernetes scheduling/limits with cgroup OOM strategy.
- Built a solution that preserves pod uptime under memory pressure.

---

## Final Working Strategy

Use **two workloads**:

1. `DaemonSet` (`disable-memory-oom-group`)
- Runs once per node.
- Continuously sets `memory.oom.group=0` for Kubernetes container cgroups on that node.

2. `Deployment` (`herder`)
- Runs resource-hog app with strict limits.
- Uses required anti-affinity so each pod lands on a different node.

Why this works:
- OOM kills the offending memory-hog process instead of forcing full container restart.
- Behavior is applied where needed, without global kubelet reconfiguration.

---

## Common Failures I Hit (And Fixed)

1. `CrashLoopBackOff` from repeated OOM
- Cause: default post-1.28 behavior killed container.
- Fix: enforce `memory.oom.group=0` via node helper DaemonSet.

2. `exec: "sh": executable file not found`
- Cause: `herder` image is minimal and does not include shell.
- Fix: avoid shell-based command overrides in main container.

3. Selector/label mismatch while patching Deployment
- Cause: changed immutable selectors during update.
- Fix: recreate deployment cleanly with stable labels.

---

## Validation Checklist

```bash
kubectl get ds disable-memory-oom-group
kubectl get deploy herder
kubectl get pods -o wide
kubectl get pods
```

Expected:
- DaemonSet ready on all nodes
- `herder` replicas distributed one per node
- `STATUS=Running`
- `RESTARTS=0` for at least 60 seconds

---

## Final Status

- OOM behavior tuned at workload scope: PASS
- Resource limits enforced (`250m` / `256Mi`): PASS
- One pod per node: PASS
- 60s+ runtime without restart: PASS
- Lessons from `resourceHogPod` + `cgroupsOOMlinux` documented: PASS
