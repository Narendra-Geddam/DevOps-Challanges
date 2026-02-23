# Deploy a Pod from a Private Registry

Deploy an Nginx Pod using an image hosted in a private container registry.

## Goal

Create a Pod that uses:

- Image: `registry.iximiuz.com/nginx:alpine`
- Pod name: `nginx-1`
- Namespace: `default`

And ensure it serves the default Nginx welcome page.

## Registry Credentials

- Registry: `registry.iximiuz.com`
- Username: `iximiuzlabs`
- Password: `rules!`

## Step 1: Create Image Pull Secret

```bash
kubectl create secret docker-registry regcred \
  --docker-server=registry.iximiuz.com \
  --docker-username=iximiuzlabs \
  --docker-password='rules!' \
  -n default
```

## Step 2: Create Pod Manifest

Create `nginx-1.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-1
  labels:
    run: nginx-1
spec:
  containers:
  - name: nginx-1
    image: registry.iximiuz.com/nginx:alpine
  imagePullSecrets:
  - name: regcred
```

Apply it:

```bash
kubectl apply -f nginx-1.yaml
```

## Step 3: Verify

Check Pod status:

```bash
kubectl get pod nginx-1 -n default
```

Test response:

```bash
kubectl port-forward pod/nginx-1 8080:80 -n default
curl http://localhost:8080
```

Expected result: HTML for the default Nginx welcome page.

## Success Criteria

- Pod `nginx-1` exists in namespace `default`
- Pod uses image `registry.iximiuz.com/nginx:alpine`
- Nginx in the Pod responds with the welcome page
