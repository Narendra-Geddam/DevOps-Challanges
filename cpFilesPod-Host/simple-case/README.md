<div align="center">

# Copy Files Pod-to-Host Challenge

### Inject missing Nginx config into a live Pod and extract binary for analysis

![Kubernetes](https://img.shields.io/badge/Kubernetes-kubectl%20cp-326ce5?style=for-the-badge)
![Pod](https://img.shields.io/badge/Pod-web-00b894?style=for-the-badge)
![Nginx](https://img.shields.io/badge/Nginx-Config%20%2B%20Binary-ff6b00?style=for-the-badge)

</div>

---

## Art Problems I Faced

1. **`kubectl cp` argument order errors**
- I repeatedly swapped source and destination, which triggered `source and destination are required`.
- Fix: always use `kubectl cp <src> <dest>` with explicit pod path format (`web:/path`).

2. **Wrong remote path assumptions**
- Early attempts used invalid/irrelevant pod paths.
- Fix: target exact in-container path: `/etc/nginx/nginx.conf`.

3. **Reload validation gap**
- Copying file alone did not prove Nginx accepted it.
- Fix: run `kubectl exec web -- nginx -s reload` after each copy attempt.

4. **Binary copy destination confusion**
- Tried copying from wrong source path and inconsistent host destinations.
- Fix: use direct source path `web:/usr/sbin/nginx` and destination `~/nginx-bin`.

---

## Copy Files To/From a Running Kubernetes Pod: a Simple Case
There is an Nginx Pod called web running in the default namespace. Whoever started it forgot to add the required nginx.conf file to its container. Your task is to copy the config file to the Pod without restarting it. After that, you will need to copy the nginx binary from the Pod to the host for further analysis by the security team.

You can access the Nginx server at Pod's IP address on port 80.
The correct config file is located on the host at ~/nginx.conf.
The config file in the Pod is located at /etc/nginx/nginx.conf in the server container.
Use kubectl exec web -- nginx -s reload to trigger a config reload.
The Nginx binary is located in the server container of the web Pod at /usr/sbin/nginx.
Copy the Nginx binary to the host at ~/nginx-bin.
Good luck!

laborant@k3s-01:~$ ls
nginx.conf
laborant@k3s-01:~$ kubectl get po
NAME   READY   STATUS    RESTARTS   AGE
web    1/1     Running   0          108s
laborant@k3s-01:~$ kubectl cp ~/nginx.conf web /etc/nginx/nginx.conf
error: source and destination are required
laborant@k3s-01:~$ kubectl cp web ~/nginx.conf /etc/nginx/nginx.conf
error: source and destination are required
laborant@k3s-01:~$ kubectl cp po web ~/nginx.conf /etc/nginx/nginx.conf
error: source and destination are required
laborant@k3s-01:~$ kubectl cp --help
Copy files and directories to and from containers.

Examples:
  # !!!Important Note!!!
  # Requires that the 'tar' binary is present in your container  # image.  If 'tar' is not present, 'kubectl cp' will fail.
  #
  # For advanced use cases, such as symlinks, wildcard expansion or
  # file mode preservation, consider using 'kubectl exec'.
  
  # Copy /tmp/foo local file to /tmp/bar in a remote pod in namespace <some-namespace>
  tar cf - /tmp/foo | kubectl exec -i -n <some-namespace> <some-pod> -- tar xf - -C /tmp/bar
  
  # Copy /tmp/foo from a remote pod to /tmp/bar locally
  kubectl exec -n <some-namespace> <some-pod> -- tar cf - /tmp/foo | tar xf - -C /tmp/bar
  
  # Copy /tmp/foo_dir local directory to /tmp/bar_dir in a remote pod in the default namespace
  kubectl cp /tmp/foo_dir <some-pod>:/tmp/bar_dir
  
  # Copy /tmp/foo local file to /tmp/bar in a remote pod in a specific container
  kubectl cp /tmp/foo <some-pod>:/tmp/bar -c <specific-container>
  
  # Copy /tmp/foo local file to /tmp/bar in a remote pod in namespace <some-namespace>
  kubectl cp /tmp/foo <some-namespace>/<some-pod>:/tmp/bar
  
  # Copy /tmp/foo from a remote pod to /tmp/bar locally
  kubectl cp <some-namespace>/<some-pod>:/tmp/foo /tmp/bar

Options:
    -c, --container='':
        Container name. If omitted, use the kubectl.kubernetes.io/default-container annotation for selecting the container to be attached or the first container in the pod will be chosen

    --no-preserve=false:
        The copied file/directory's ownership and permissions will not be preserved in the container

    --retries=0:
        Set number of retries to complete a copy operation from a container. Specify 0 to disable or any negative value for infinite retrying. The default is 0 (no retry).

Usage:
  kubectl cp <file-spec-src> <file-spec-dest> [options]

Use "kubectl options" for a list of global command-line options (applies to all commands).
laborant@k3s-01:~$ kubectl cp web:~/nginx.conf /etc/nginx/nginx.conf
laborant@k3s-01:~$ kubectl exec web -- nginx -s reload
2026/02/25 11:21:37 [notice] 47#47: signal process started
laborant@k3s-01:~$ kubectl cp ~/nginx.conf web:/etc/nginx/nginx.conf
laborant@k3s-01:~$ kubectl exec web -- nginx -s reload
2026/02/25 11:23:17 [notice] 69#69: signal process started
laborant@k3s-01:~$ kubectl cp ~/nginx.conf web:/etc/nginx/nginx.c^Cf
laborant@k3s-01:~$ kubectl cp web:~/nginx-bin .
laborant@k3s-01:~$ ls
nginx.conf
laborant@k3s-01:~$ kubectl cp web:~/nginx-bin ~/
laborant@k3s-01:~$ ls
nginx.conf
laborant@k3s-01:~$ ls
nginx.conf
laborant@k3s-01:~$ ls
nginx.conf
laborant@k3s-01:~$ kubectl cp web:/usr/sbin/nginx ~/nginx-bin
tar: removing leading '/' from member names
laborant@k3s-01:~$ 


