# 🚀 Deployment Guide

## Quick Start (30 seconds)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure
Edit `config.json` and add your **active key**:
```json
{
  "active_key": "YOUR_51_CHARACTER_KEY_HERE"
}
```

### 3. Start Bot
```bash
npm start
```

**Done!** The bot is now running and will vote every 300 seconds.

---

## Verify It's Working

Look for these lines in the output:
```
✅ Fetched X RECENT root posts from @steemburnup
Already voted on post-name (blockchain check), skipping...
Voted on N new posts
⏰ Scheduled to check every 300 seconds
Bot is now running. Press Ctrl+C to stop.
```

---

## Test Before Running (Optional)

Edit `config.json`:
```json
{
  "dry_run": true
}
```

Run `npm start`. Bot will simulate voting without sending to blockchain.

Then set `"dry_run": false` to enable live voting.

---

## Stop the Bot

Press `Ctrl+C` in the terminal.

---

## Get Your Active Key

1. Go to [steemit.com](https://steemit.com)
2. Login with your account
3. Click "Wallet" → "Permissions"
4. Click "Show Private Key" next to "Active"
5. Enter your password
6. Copy the key (51 characters, starts with `5`)
7. Paste into `config.json`

---

## That's It! 🎉

Your bot is now:
- ✅ Monitoring @steemburnup for new posts
- ✅ Voting automatically with 100% weight
- ✅ Checking every 5 minutes
- ✅ Using official Steem API
- ✅ Protecting against duplicate votes

Enjoy! 🗳️
