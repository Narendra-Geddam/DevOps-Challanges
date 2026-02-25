<div align="center">

# iptables Challenge Guide

### Intro, usage, and essential commands

![Tool](https://img.shields.io/badge/Firewall-iptables-ff6b00?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Linux-1f6feb?style=for-the-badge)

</div>

---

## Introduction

`iptables` is a Linux firewall utility used to control packet filtering and traffic flow.

It evaluates rules top to bottom and applies the first matching rule.

---

## Core Concepts

### Common chains in `filter` table
- `INPUT`: traffic coming into this host
- `OUTPUT`: traffic leaving this host
- `FORWARD`: traffic routed through this host

### Rule actions
- `ACCEPT`: allow traffic
- `DROP`: silently block traffic
- `REJECT`: block and return an error response

---

## Basic Usage

```bash
# List all active rules (numeric, verbose)
sudo iptables -L -n -v

# List a specific chain with rule numbers
sudo iptables -L INPUT --line-numbers -n -v

# Append a new rule to end of chain
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Insert a rule at top of chain (higher priority)
sudo iptables -I INPUT 1 -p tcp --dport 22 -j ACCEPT

# Delete rule by number
sudo iptables -D INPUT <RULE_NUMBER>
```

---

## Practical Examples

```bash
# Allow localhost loopback traffic
sudo iptables -I INPUT 1 -i lo -j ACCEPT

# Allow SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Block a specific source IP
sudo iptables -A INPUT -s 203.0.113.10 -j DROP

# Block external access to a web port
sudo iptables -A INPUT -p tcp --dport 8080 -j DROP
```

---

## Troubleshooting Notes

- If a rule "doesn't work," check order first.
- Always verify with `-L -n -v` after updates.
- Prefer inserting allow rules before broad drop rules.

---

## Related Challenge

Challenge-specific implementation is documented in:

- `ProtectVMfirewall/README.md`
