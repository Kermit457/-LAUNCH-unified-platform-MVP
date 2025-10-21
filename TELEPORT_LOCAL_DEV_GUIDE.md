# Teleport Local Development Session Guide

**Use Case**: Connect to this development environment remotely using Teleport

---

## Option 1: Teleport SSH Access (Recommended)

### Prerequisites

1. **Teleport installed locally** on your machine:
   ```bash
   # macOS
   brew install teleport

   # Linux
   curl https://goteleport.com/static/install.sh | bash

   # Windows
   # Download from: https://goteleport.com/download/
   ```

2. **Teleport cluster configured** (ask your admin for cluster URL)

---

### Setup Steps

#### 1. Login to Teleport Cluster

```bash
# Login to your Teleport cluster
tsh login --proxy=teleport.yourcompany.com:443 --user=your-username

# Or if using Teleport Cloud
tsh login --proxy=yourcompany.teleport.sh --user=your-username
```

#### 2. List Available Nodes

```bash
# See all available dev environments
tsh ls

# Output example:
# Node Name              Address        Labels
# dev-box-1             127.0.0.1:3022  env=dev,user=yourname
# staging-server        10.0.1.50:3022  env=staging
```

#### 3. Connect to This Development Session

```bash
# SSH into the dev environment
tsh ssh user@dev-box-1

# Or using node UUID
tsh ssh user@<node-uuid>

# With port forwarding (access localhost:3000 from your machine)
tsh ssh -L 3000:localhost:3000 user@dev-box-1
```

#### 4. Forward Ports for Development

```bash
# Forward Next.js dev server (port 3000)
tsh ssh -L 3000:localhost:3000 user@dev-box-1

# Forward multiple ports
tsh ssh \
  -L 3000:localhost:3000 \  # Next.js
  -L 8080:localhost:8080 \  # API
  -L 5432:localhost:5432 \  # PostgreSQL
  user@dev-box-1

# Now access http://localhost:3000 on your local machine
```

---

## Option 2: Teleport Application Access

For web-based development (Next.js, etc.)

### 1. Configure Teleport Application

Create `teleport-app.yaml`:

```yaml
version: v3
kind: app
metadata:
  name: nextjs-dev
  description: "Next.js Development Server"
spec:
  uri: "http://localhost:3000"
  public_addr: "nextjs-dev.teleport.yourcompany.com"
  labels:
    env: dev
    project: launch-platform
```

### 2. Start Teleport Application Service

```bash
# Start the app service
teleport app start \
  --token=<join-token> \
  --auth-server=teleport.yourcompany.com:443 \
  --config=/path/to/teleport-app.yaml
```

### 3. Access from Browser

```bash
# Login
tsh login --proxy=teleport.yourcompany.com

# List apps
tsh app ls

# Login to the app
tsh app login nextjs-dev

# Get the URL
tsh app config

# Access in browser:
# https://nextjs-dev.teleport.yourcompany.com
```

---

## Option 3: Teleport Desktop Access (GUI)

For full desktop experience:

### 1. Install Teleport Connect (GUI)

Download from: https://goteleport.com/download/

### 2. Configure Connection

1. Open Teleport Connect
2. Add cluster: `teleport.yourcompany.com`
3. Login with your credentials
4. Find your dev node in the list
5. Click "Connect" - opens SSH session in terminal

### 3. Port Forwarding via GUI

1. Click on node → "Port Forwarding"
2. Add port: `3000` → `localhost:3000`
3. Access http://localhost:3000 locally

---

## Option 4: VS Code Remote via Teleport

### 1. Install VS Code Extension

```bash
# Install Remote-SSH extension
code --install-extension ms-vscode-remote.remote-ssh
```

### 2. Configure SSH Config

Teleport auto-generates SSH config:

```bash
# Generate SSH config
tsh config > ~/.ssh/teleport-config

# Or manually add to ~/.ssh/config:
Host dev-via-teleport
    HostName dev-box-1
    Port 3022
    ProxyCommand tsh proxy ssh --cluster=teleport.yourcompany.com %r@%h:%p
    User your-username
```

### 3. Connect from VS Code

1. Open VS Code
2. Press `Cmd/Ctrl + Shift + P`
3. Select "Remote-SSH: Connect to Host"
4. Choose `dev-via-teleport`
5. VS Code opens remotely on dev machine

### 4. Forward Ports in VS Code

1. Open terminal in VS Code (on remote)
2. Run: `npm run dev`
3. VS Code detects port 3000
4. Click "Forward Port" notification
5. Access http://localhost:3000 locally

---

## Common Workflows

### Development Workflow 1: Hot Reload Development

```bash
# On local machine:
tsh ssh -L 3000:localhost:3000 user@dev-box-1

# In the SSH session (remote):
cd /home/user/-LAUNCH-unified-platform-MVP
npm run dev

# On local machine:
# Open browser to http://localhost:3000
# See live updates as you edit files
```

### Development Workflow 2: Full Stack Development

```bash
# Forward all necessary ports
tsh ssh \
  -L 3000:localhost:3000 \    # Next.js
  -L 3001:localhost:3001 \    # Appwrite (if running locally)
  -L 8900:localhost:8900 \    # Solana validator (devnet)
  user@dev-box-1

# Start services on remote
npm run dev
```

### Development Workflow 3: Database Access

```bash
# Forward Appwrite/database ports
tsh ssh -L 5432:localhost:5432 user@dev-box-1

# Connect from local DB client
psql -h localhost -p 5432 -U postgres
```

---

## Troubleshooting

### Issue: "Connection Refused"

```bash
# Check Teleport status
tsh status

# Re-login if session expired
tsh login --proxy=teleport.yourcompany.com

# Check node is online
tsh ls
```

### Issue: "Port Already in Use"

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different local port
tsh ssh -L 3001:localhost:3000 user@dev-box-1
# Access http://localhost:3001 instead
```

### Issue: "Slow Performance"

```bash
# Use compression
tsh ssh -C -L 3000:localhost:3000 user@dev-box-1

# Check network latency
ping teleport.yourcompany.com
```

### Issue: "Can't Access Forwarded Port"

```bash
# Make sure dev server is bound to 0.0.0.0, not 127.0.0.1
# In package.json:
"dev": "next dev -H 0.0.0.0"

# Or:
npm run dev -- -H 0.0.0.0
```

---

## Security Best Practices

### 1. Use Short-Lived Certificates

```bash
# Certificates auto-expire (typically 12-24 hours)
# Re-login when expired:
tsh login --proxy=teleport.yourcompany.com
```

### 2. Enable MFA

```bash
# Setup MFA device
tsh mfa add

# Require MFA for SSH
# (configured at cluster level)
```

### 3. Audit Sessions

```bash
# View your session history
tsh history

# Administrators can review all sessions
# via Teleport audit log
```

### 4. Use Least Privilege

```bash
# Request temporary elevated access
tsh request create --roles=developer,admin

# Approve request (admin)
tsh request review <request-id> --approve
```

---

## Quick Reference

### Essential Commands

```bash
# Login
tsh login --proxy=<cluster>

# List nodes
tsh ls

# SSH with port forwarding
tsh ssh -L <local>:<remote> user@node

# List active sessions
tsh status

# Logout
tsh logout

# Version
tsh version
```

### Current Project Ports

| Service | Port | Description |
|---------|------|-------------|
| Next.js Dev | 3000 | Main development server |
| Appwrite | 80 | Backend API (if self-hosted) |
| Appwrite Console | 3001 | Admin interface |
| Solana Devnet | 8899 | Local Solana validator |

### Recommended Port Forwarding

```bash
tsh ssh -L 3000:localhost:3000 user@dev-box-1
```

Then access:
- Frontend: http://localhost:3000
- Hot reload works automatically
- API calls route through the tunnel

---

## Alternative: Teleport Database Access

If using Teleport for database connections:

```bash
# List databases
tsh db ls

# Connect to database
tsh db login --db-user=postgres my-postgres

# Get connection string
tsh db config

# Use with psql
tsh db connect my-postgres
```

---

## Integration with This Project

### Start Development with Teleport

```bash
# 1. Connect with port forwarding
tsh ssh -L 3000:localhost:3000 user@dev-box-1

# 2. In remote session, navigate to project
cd /home/user/-LAUNCH-unified-platform-MVP

# 3. Start development server
npm run dev

# 4. On local machine, open browser
open http://localhost:3000

# 5. Edit code locally (if using VS Code Remote)
# Or edit in remote terminal with vim/nano
```

### Environment Variables

If using `.env` files:

```bash
# Copy local .env to remote
tsh scp .env.local user@dev-box-1:/home/user/-LAUNCH-unified-platform-MVP/

# Or edit on remote
tsh ssh user@dev-box-1
nano /home/user/-LAUNCH-unified-platform-MVP/.env.local
```

---

## Need Help?

### Teleport Documentation
- Docs: https://goteleport.com/docs/
- SSH Guide: https://goteleport.com/docs/server-access/guides/openssh/
- Port Forwarding: https://goteleport.com/docs/server-access/guides/port-forwarding/

### Your Admin
Contact your Teleport cluster administrator for:
- Cluster URL
- Join tokens
- Role assignments
- Access requests

---

**Current Session Info**:
- Working Directory: `/home/user/-LAUNCH-unified-platform-MVP`
- Platform: Linux
- Node.js: Available
- npm: Available
- Git Repo: Yes

**To access this session**:
```bash
tsh ssh user@<this-node-name>
```
