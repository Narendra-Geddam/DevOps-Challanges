<div align="center">

# PRIVATE REGISTRY K8S CHALLENGE

### Pull a private image, run Nginx, verify like a pro

![Kubernetes](https://img.shields.io/badge/Kubernetes-Pod%20Deployment-326ce5?style=for-the-badge)
![Registry](https://img.shields.io/badge/Registry-Private%20Image-ff6b00?style=for-the-badge)
![Challenge](https://img.shields.io/badge/Iximiuz-Labs-00b894?style=for-the-badge)

</div>

---

## Challenge Objective

Deploy an Nginx Pod using an image from a **private container registry** and confirm it serves the default Nginx welcome page.

Target:
- Image: `registry.iximiuz.com/nginx:alpine`
- Pod name: `nginx-1`
- Namespace: `default`

---

## Registry Access

- Registry: `registry.iximiuz.com`
- Username: `iximiuzlabs`
- Password: `rules!`

---

## Quick Start

1. Apply the pull secret:

```bash
kubectl apply -f regcred-secret.yaml
```

2. Apply the pod manifest:

```bash
kubectl apply -f nginx-1.yaml
```

3. Verify pod state:

```bash
kubectl get pod nginx-1 -n default
```

4. Validate Nginx response:

```bash
kubectl port-forward pod/nginx-1 8080:80 -n default
curl http://localhost:8080
```

Expected result: default Nginx welcome HTML.

---

## Included Manifests

- `regcred-secret.yaml`
- `nginx-1.yaml`

---

## Success Criteria

- Pod `nginx-1` is running in `default`
- Pod pulls `registry.iximiuz.com/nginx:alpine`
- `curl http://localhost:8080` returns the Nginx welcome page

<div align="center">

## Challenge Complete When All Checks Pass

</div>
