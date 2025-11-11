# 🐳 Docker Deployment Guide

Deploy the Steem Voting Bot using Docker for production environments.

## Quick Start

### 1. Build the Docker Image

```bash
docker build -t steem-voting-bot .
```

### 2. Run the Container

```bash
docker run -d \
  --name steem-voting-bot \
  --restart unless-stopped \
  -v "$(pwd)/config.json:/app/config.json:ro" \
  steem-voting-bot
```

**Windows (PowerShell):**
```powershell
docker run -d `
  --name steem-voting-bot `
  --restart unless-stopped `
  -v "${PWD}/config.json:/app/config.json:ro" `
  steem-voting-bot
```

### 3. View Logs

```bash
docker logs -f steem-voting-bot
```

## Configuration

Before running, create `config.json` with your settings:

```json
{
  "target_account": "steemburnup",
  "voting_account": "steemburnpool",
  "active_key": "YOUR_ACTIVE_KEY_HERE",
  "posts_limit": 20,
  "check_interval_seconds": 300,
  "vote_weight": 10000,
  "dry_run": false
}
```

**Get your active key:**
1. Log in to Steemit.com
2. Wallet → Permissions
3. Show Private Key (next to Active)
4. Copy and paste into config.json

## Container Management

### Stop the Bot
```bash
docker stop steem-voting-bot
```

### Start the Bot
```bash
docker start steem-voting-bot
```

### Remove the Container
```bash
docker rm steem-voting-bot
```

### View Recent Logs
```bash
docker logs --tail 50 steem-voting-bot
```

### Live Logs (Follow)
```bash
docker logs -f steem-voting-bot
```

## Test Mode (Dry Run)

Set `"dry_run": true` in `config.json` to test without voting:

```bash
docker run -it \
  --name steem-voting-bot-test \
  -v "$(pwd)/config.json:/app/config.json:ro" \
  steem-voting-bot
```

Press `Ctrl+C` to stop.

## Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  steem-voting-bot:
    build: .
    container_name: steem-voting-bot
    restart: unless-stopped
    volumes:
      - ./config.json:/app/config.json:ro
    environment:
      - NODE_ENV=production
```

Then run:
```bash
docker-compose up -d
docker-compose logs -f
```

## Monitoring

### Check Container Status
```bash
docker ps | grep steem-voting-bot
```

### Check Resource Usage
```bash
docker stats steem-voting-bot
```

### Inspect Container
```bash
docker inspect steem-voting-bot
```

## Troubleshooting

### Container Won't Start
```bash
docker logs steem-voting-bot
```

### Permission Issues
Make sure `config.json` is readable:
```bash
chmod 644 config.json
```

### Port Conflicts
The bot doesn't use any ports, so no conflicts expected.

### Update Bot Code
1. Stop container: `docker stop steem-voting-bot`
2. Remove image: `docker rmi steem-voting-bot`
3. Rebuild: `docker build -t steem-voting-bot .`
4. Restart: `docker run -d ...` (use the command from Quick Start)

## Production Best Practices

1. **Keep config.json secure** - Use Docker secrets in production
2. **Monitor logs regularly** - Check for errors
3. **Set restart policy** - `--restart unless-stopped` is recommended
4. **Use volumes** - Mount config.json as read-only
5. **Backup config.json** - Never lose your private key

## License

MIT
