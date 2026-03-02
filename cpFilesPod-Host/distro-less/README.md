<div align="center">

# Copy Files To/From a Distroless Kubernetes Pod

<p><strong>Fix live Nginx config and export binary when `kubectl cp` fails</strong></p>

![Kubernetes](https://img.shields.io/badge/Kubernetes-Distroless%20Debugging-326ce5?style=for-the-badge)
![Problem](https://img.shields.io/badge/Problem-no%20tar%20in%20container-critical?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Completed-16a34a?style=for-the-badge)

</div>

---

## Original Challenge (Preserved)

There is a Pod named `web` in `default` using `cgr.io/chainguard/nginx`.

Tasks:
- copy `~/nginx.conf` into container at `/etc/nginx/nginx.conf`
- reload Nginx without restarting pod
- copy `/usr/sbin/nginx` from pod to host as `~/nginx-bin`

---

## Why `kubectl cp` Breaks in Distroless

`kubectl cp` depends on `tar` in the target container.
Distroless images usually do not include:

- shell utilities
- package manager
- tar

So normal copy flow fails with:
`exec: "tar": executable file not found in $PATH`.

---

## Working Approach

Use an ephemeral debug container and access target container filesystem via `/proc/1/root`.

If normal `kubectl debug` is not privileged enough, create privileged ephemeral container through Kubernetes API patch.

---

## Step-by-Step

```bash
kubectl proxy &

curl -Lvk localhost:8001/api/v1/namespaces/default/pods/web/ephemeralcontainers \
  -XPATCH \
  -H 'Content-Type: application/strategic-merge-patch+json' \
  -d '
{
  "spec": {
    "ephemeralContainers": [
      {
        "name": "debugger-123",
        "command": ["sh"],
        "targetContainerName": "web",
        "image": "alpine",
        "stdin": true,
        "tty": true,
        "securityContext": { "privileged": true }
      }
    ]
  }
}'
```

Then attach and move files through `/proc/1/root`.

Reload Nginx:

```bash
kubectl exec web -- nginx -s reload
```

If PID file error appears (`/var/run/nginx.pid`), fallback to sending `HUP` to nginx process.

---

## Troubleshooting Notes

- `Permission denied` on `/proc/1/root` usually means debug container is not privileged.
- `kubectl debug` defaults may be insufficient for this case.
- `cdebug` can simplify this workflow if available.

---

## Validation Checklist

- [ ] new config exists at `/etc/nginx/nginx.conf`
- [ ] Nginx reload applied successfully
- [ ] binary copied to host as `~/nginx-bin`
- [ ] pod was not restarted

---

## Visuals

![Debug method](./image.png)
![Rootfs path hint](./image1.png)
