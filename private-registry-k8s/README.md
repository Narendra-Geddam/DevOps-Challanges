<div align="center">

# Private Registry Kubernetes Challenge

### Authenticate to a private registry and run Nginx in-cluster

![Kubernetes](https://img.shields.io/badge/Kubernetes-Pod%20Auth-326ce5?style=for-the-badge)
![Registry](https://img.shields.io/badge/Registry-Private-ff6b00?style=for-the-badge)
![Image](https://img.shields.io/badge/Image-nginx:alpine-00b894?style=for-the-badge)

</div>

---

## Objective

Deploy Pod `nginx-1` in `default` using a private image and verify the Nginx welcome page is served.

Target:
- Image: `registry.iximiuz.com/nginx:alpine`
- Pod: `nginx-1`
- Namespace: `default`

---

## Credentials Used

- Registry: `registry.iximiuz.com`
- Username: `iximiuzlabs`
- Password: `rules!`

---

## Files

- `regcred-secret.yaml`
- `nginx-1.yaml`

---

## Deploy

```bash
kubectl apply -f regcred-secret.yaml
kubectl apply -f nginx-1.yaml
```

---

## Verify

```bash
kubectl get pod nginx-1 -n default
kubectl port-forward pod/nginx-1 8080:80 -n default
curl http://localhost:8080
```

Expected:
- Pod reaches `Running`
- Image pulls successfully from private registry
- `curl` returns default Nginx HTML page

---

## Common Problems Faced

1. `ImagePullBackOff`
- Cause: missing/incorrect image pull secret
- Fix: create secret correctly and reference it in pod spec

2. Secret exists in wrong namespace
- Cause: secret created outside `default`
- Fix: create/apply secret in same namespace as pod

3. Pod manifest missing `imagePullSecrets`
- Cause: pod cannot use registry credentials
- Fix: include `imagePullSecrets` with the secret name

---

## Final Status

- Private pull authentication: PASS
- Pod deployment: PASS
- Nginx response validation: PASS
