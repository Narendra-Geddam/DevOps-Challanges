
<div align="center">
  <h1>Linux cgroups OOM Challenge</h1>
  <h3>Enforce group-wide OOM kill for hogherder + memhog</h3>
  <p>
    <img alt="Linux" src="https://img.shields.io/badge/Linux-cgroups_v2-1f6feb?style=for-the-badge" />
    <img alt="OOM" src="https://img.shields.io/badge/OOM-Group%20Kill-critical?style=for-the-badge" />
    <img alt="Memory" src="https://img.shields.io/badge/Memory-500MB-2ea44f?style=for-the-badge" />
  </p>
</div>

# Linux cgroups OOM Challenge

> **Goal:** If one worker hits OOM, kill the entire `hogherder + memhog` process group.

## Challenge Snapshot

| Item | Target | Final Value |
|---|---:|---:|
| CPU limit | 20% | `20000 100000` in `cpu.max` |
| Memory limit | 500 MB | `524288000` in `memory.max` |
| OOM behavior | Group kill | `1` in `memory.oom.group` |

## Scenario

This challenge models a master-worker application:
- `hogherder` = parent/master process
- `memhog` = child worker processes that aggressively allocate memory

Default behavior can kill only one worker on OOM. The requirement here is stricter: one OOM event should terminate the full cgroup workload so the service fails fast and recovers cleanly.

## Problems I Faced (and Fixes)

### 1) Wrong write path inside the cgroup folder

**What happened**
- I was already in `herder-group/` but tried writing to `herder-group/memory.max` and `herder-group/cpu.max`.
- Got: `No such file or directory`.

**Fix**
- Write directly to local files:
  - `memory.max`
  - `cpu.max`

### 2) Memory limit not applied at first

**What happened**
- `cat memory.max` returned `max` (unlimited).

**Fix**
- Set 500 MB in bytes:

```bash
echo $((500*1024*1024)) | sudo tee memory.max
```

**Result**
- `memory.max` became `524288000`.

### 3) CPU limit format confusion

**What happened**
- Needed the exact cgroup v2 format for `cpu.max`.

**Fix**
- Use `quota period` format:

```bash
echo "20000 100000" | sudo tee cpu.max
```

**Result**
- CPU capped at 20%.

### 4) OOM killed only one process by default

**What happened**
- Without grouping, OOM may kill a single `memhog` and leave the parent running.

**Fix**

```bash
echo 1 | sudo tee memory.oom.group
```

**Result**
- OOM event kills all processes in the cgroup.

### 5) Process start/verification command issue

**What happened**
- Attempted `ps aux | hogherder`, which is not a valid way to launch the process.

**Fix**
- Start `hogherder` normally, then verify using `ps aux`, `memory.events`, and process exits.

## Final Working Steps

```bash
# create cgroup
sudo mkdir -p /sys/fs/cgroup/herder-group
cd /sys/fs/cgroup/herder-group

# enforce limits
echo $((500*1024*1024)) | sudo tee memory.max
echo "20000 100000" | sudo tee cpu.max
echo 1 | sudo tee memory.oom.group

# move running hogherder process into cgroup
echo <HOGHERDER_PID> | sudo tee cgroup.procs
```

## Validation Checklist

- `cat memory.max` -> `524288000`
- `cat cpu.max` -> `20000 100000`
- `cat memory.oom.group` -> `1`
- Under memory pressure, `hogherder` and all `memhog` workers terminate together.

## Why This Design Is Safer

Group OOM handling avoids partial failure states where only one worker dies and the parent remains in a broken condition. This makes failure deterministic and restart automation more reliable.

## Final Status

- `memory.max` configured: PASS
- `cpu.max` configured: PASS
- `memory.oom.group` configured: PASS
- Full challenge documentation added: PASS
