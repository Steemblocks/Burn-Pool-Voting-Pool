# 🗳️ Steem Voting Bot# 🗳️ Steem Voting Bot



Automatically vote on posts created by `@steemburnup` using the `@steemburnpool` account.Automatically vote on posts created by `@steemburnup` using the `@steemburnpool` account.



## Features## Features



- ✅ Continuously monitors @steemburnup for new posts- ✅ Continuously monitors @steemburnup for new posts

- ✅ Automatically votes with 100% weight- ✅ Automatically votes with 100% weight

- ✅ Duplicate vote prevention (blockchain verification)- ✅ Duplicate vote prevention (blockchain verification)

- ✅ Official Steem API integration- ✅ Official Steem API integration

- ✅ Automatic node failover- ✅ Automatic node failover

- ✅ Retry logic (3 attempts)- ✅ Retry logic (3 attempts)

- ✅ Comprehensive logging with timestamps- ✅ Comprehensive logging with timestamps



## Requirements## Requirements



- Node.js 14.0 or higher- Node.js 14.0 or higher

- npm (Node Package Manager)- npm (Node Package Manager)

- Steem account with active key- Steem account with active key

- Internet connection- Internet connection



## Installation## Installation



```bash```bash

npm installnpm install

``````



## Configuration## Configuration



Edit `config.json`:Edit `config.json`:



```json```json

{{

  "target_account": "steemburnup",  "target_account": "steemburnup",

  "voting_account": "steemburnpool",  "voting_account": "steemburnpool",

  "active_key": "YOUR_ACTIVE_KEY_HERE",  "active_key": "YOUR_ACTIVE_KEY_HERE",

  "posts_limit": 20,  "posts_limit": 20,

  "check_interval_seconds": 300,  "check_interval_seconds": 300,

  "vote_weight": 10000,  "vote_weight": 10000,

  "dry_run": false  "dry_run": false

}}

``````



### Getting Your Active Key### Getting Your Active Key



1. Log in to [Steemit.com](https://steemit.com)1. Log in to [Steemit.com](https://steemit.com)

2. Go to Wallet → Permissions2. Go to Wallet → Permissions

3. Click "Show Private Key" next to Active3. Click "Show Private Key" next to Active

4. Copy your active key (51 chars, starts with `5`)4. Copy your active key (51 chars, starts with `5`)

5. Paste into `config.json`5. Paste into `config.json`



## Usage## Usage



### Start the Bot### Start the Bot



```bash```bash

npm startnpm start

``````



### Test Mode (Dry Run)### Test Mode (Dry Run)



Set `"dry_run": true` in `config.json` to test without voting:Set `"dry_run": true` in `config.json` to test without voting:



```bash```bash

npm startnpm start

``````



## How It Works



Every 300 seconds (5 minutes):## How It Works  "active_key": "YOUR_ACTIVE_KEY_HERE",# 2. Run the container

1. Fetch 20 recent posts from @steemburnup

2. Check if already voted (memory cache + blockchain check)

3. Vote on posts not yet voted

4. Wait for next cycle```  "check_interval_seconds": 300,docker run -d --name steem-burn-bot --restart unless-stopped \



## LoggingEvery 300 seconds (5 minutes):



The bot logs all actions with timestamps:├─ Fetch 20 recent posts from @steemburnup  "vote_weight": 10000,  -v "$(pwd)/config.json:/app/config.json:ro" \



```├─ For each post:

2025-11-12 21:50:12 - INFO - ✅ Fetched 15 RECENT root posts from @steemburnup

2025-11-12 21:50:17 - INFO - Already voted on steemburnup/burn-pool-xxx (blockchain check), skipping...│  ├─ Check if already voted (cache)  "dry_run": false  -v "$(pwd)/logs:/app" \

2025-11-12 21:50:17 - INFO - Voted on 0 new posts

```│  ├─ Check blockchain for existing votes



## Troubleshooting│  └─ Vote if not yet voted}  steem-burn-bot



| Issue | Solution |└─ Wait for next cycle

|-------|----------|

| Invalid active key | Key must be 51 chars, starts with `5` |``````

| Connection error | Check internet, verify config.json |

| Already voted error | Post already voted - expected behavior |

| Node failure | Bot auto-switches to fallback node |

## Logging# 3. View logs

## License



MIT

The bot logs all actions with timestamps:### Getting Your Active Keydocker logs -f steem-burn-bot



``````

2025-11-12 21:50:12 - INFO - ✅ Fetched 15 RECENT root posts from @steemburnup

2025-11-12 21:50:17 - INFO - Already voted on steemburnup/burn-pool-xxx (blockchain check), skipping...1. Log in to [Steemit.com](https://steemit.com)

2025-11-12 21:50:17 - INFO - Voted on 0 new posts

```2. Go to Wallet → Permissions**Windows PowerShell:**



## Troubleshooting3. Click "Show Private Key" next to Active```powershell



| Issue | Solution |4. Copy your active key (51 chars, starts with `5`)docker run -d --name steem-burn-bot --restart unless-stopped `

|-------|----------|

| Invalid active key | Key must be 51 chars, starts with `5` |  -v "${PWD}/config.json:/app/config.json:ro" `

| Connection error | Check internet, verify config.json |

| Already voted error | Post already voted - expected behavior |### Configuration Options  -v "${PWD}/logs:/app" `

| Node failure | Bot auto-switches to fallback node |

  steem-burn-bot

## License

| Option | Type | Default | Description |```

MIT

|--------|------|---------|-------------|

| `target_account` | string | "steemburnup" | Account to vote on |See [DOCKER.md](DOCKER.md) for complete Docker deployment guide.

| `voting_account` | string | "steemburnpool" | Voting account |

| `active_key` | string | required | Active private key |### Option 2: Direct Node.js Installation

| `check_interval_seconds` | number | 300 | Check every N seconds |

| `vote_weight` | number | 10000 | Vote weight (10000 = 100%) |### 1. Clone or Download

| `dry_run` | boolean | false | Test without voting |

| `posts_limit` | number | 100 | Max posts per check |Download this bot to your local machine.

| `vote_delay_ms` | number | 1000 | Delay between votes |

| `check_immediately` | boolean | true | Check on startup |### 2. Install Node.js

| `nodes` | array | - | Steem RPC nodes |

If you don't have Node.js installed:

## Usage- Download from [nodejs.org](https://nodejs.org/)

- Install version 14.0 or higher

```bash

# Start the bot### 3. Install Dependencies

npm start

```bash

# Or directlynpm install

node steem_voting_bot.js```

```

This will install:

### Test Mode (Dry Run)- `dsteem` - JavaScript library for Steem blockchain interaction

- `node-schedule` - Job scheduling library

Before enabling live voting, test the bot:

### 4. Configure the Bot

```json

"dry_run": trueEdit the `config.json` file with your details:

```

```json

Run and watch logs for "DRY RUN" messages.{

  "username": "your_steem_username",

## Logs  "posting_key": "your_posting_key_here",

  "interval_hours": 2,

Timestamped output shows all activity:  "post_immediately": true,

  "self_vote": false,

```  "tags": ["burnpost", "steem", "burn", "null", "steemit"],

2025-11-11 20:38:14 - INFO - Bot started!  "nodes": [

2025-11-11 20:38:14 - INFO - Checking for new posts from @steemburnup...    "https://api.steemit.com",

2025-11-11 20:38:14 - INFO - ✅ Successfully fetched 10 posts    "https://api.steem.fans",

2025-11-11 20:38:17 - INFO - ✅ Successfully voted on @steemburnup/burn-pool-xxx    "https://api.steemitdev.com"

```  ]

}

## Architecture```



- **Steemworld API** for fetching posts#### Configuration Options:

- **dsteem** for blockchain voting

- **Multi-node failover** for resilience| Option | Description | Default |

- **Memory + blockchain checks** for duplicate prevention|--------|-------------|---------|

| `username` | Your Steem account username | **Required** |

## Security| `posting_key` | Your posting private key (starts with 5...) | **Required** |

| `interval_hours` | Hours between posts | `2` |

- Never commit `config.json` with real keys| `post_immediately` | Create first post on startup | `true` |

- Keep active key secure| `self_vote` | Upvote your own posts | `false` |

- Use environment variables for sensitive data| `tags` | Array of tags for posts | `["burnpost", "steem", "burn", "null", "steemit"]` |

- Always test with dry_run first| `nodes` | List of Steem API nodes | Default nodes provided |



## Troubleshooting### 5. Get Your Posting Key



| Issue | Solution |**IMPORTANT**: Never share your private keys with anyone!

|-------|----------|

| Connection error | Check internet, try different nodes |To get your posting key:

| Invalid active key | Verify key is 51+ chars, starts with `5` |1. Log into your Steem account on Steemit.com

| No posts found | Check target account exists and has posts |2. Go to Wallet → Permissions

| Already voted error | Posts already have votes from this account |3. Click "Show Private Key" next to Posting

4. Enter your password

## Support5. Copy the private posting key (starts with `5...`)



Check logs for detailed error messages. Verify:## Running the Bot

- Active key is valid

- Target/voting accounts exist### Start the Bot

- Account has voting power

- Network is stable```bash

node steem_burn_bot.js

## License```



MITOr using npm:


```bash
npm start
```

### What Happens:

1. Bot connects to Steem blockchain
2. Creates initial post (if `post_immediately` is true)
3. Schedules posts every 2 hours (or your configured interval)
4. Runs continuously until stopped

### Stop the Bot

Press `Ctrl+C` to stop the bot gracefully.

## Logging

All activity is logged to:
- **Console** - Real-time output
- **steem_burn_bot.log** - Persistent log file

Example log output:
```
2025-11-05 10:00:00 - INFO - Connected to Steem blockchain as username
2025-11-05 10:00:05 - INFO - ✅ Successfully created burn post: https://steemit.com/@username/burn-pool-1234567890
2025-11-05 10:00:05 - INFO - ⏰ Scheduled to post every 2 hours
```

## How Burning Works

When you set the beneficiary to `@null`:
- The @null account is a special account on Steem
- Any rewards sent to @null are **permanently removed** from circulation
- This reduces the overall STEEM supply
- Benefits all STEEM holders by reducing inflation

The bot sets 100% of post rewards as beneficiary to @null (weight: 10000 = 100%).

## Customizing Post Content

To customize what your bot posts, edit the `generatePostContent()` method in `steem_burn_bot.js`:

```javascript
generatePostContent() {
    const title = "Your Custom Title";
    const body = `
    Your custom post content here...
    `;
    const tags = ["tag1", "tag2", "tag3"];
    return { title, body, tags };
}
```

## Troubleshooting

### "Failed to connect to Steem"
- Check your internet connection
- Try different nodes in the config
- Verify your posting key is correct

### "Invalid posting key"
- Make sure you're using the **posting** key, not master/active key
- Key should start with `5`
- No spaces before/after the key

### "Account not found"
- Verify your username is correct
- Username is case-sensitive

### Posts not appearing
- Wait a few minutes for blockchain confirmation
- Check your account on steemit.com
- Review logs for error messages

## Advanced Usage

### Running as a Background Service (Windows)

Create a batch file `start_bot.bat`:
```batch
@echo off
node steem_burn_bot.js
pause
```

### Running on Linux/Mac with PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start bot with PM2
pm2 start steem_burn_bot.js --name steem-burn-bot

# View logs
pm2 logs steem-burn-bot

# Stop bot
pm2 stop steem-burn-bot
```

### Using nohup (Linux/Mac)

```bash
nohup node steem_burn_bot.js &
```

## File Structure

```
Burn Pool Posting Bot/
├── steem_burn_bot.js          # Main bot script (Node.js)
├── package.json               # Node.js project configuration
├── package-lock.json          # Dependency lock file
├── node_modules/              # Installed dependencies
├── config.json                # Your configuration (keep private!)
├── config.example.json        # Example configuration
├── README.md                  # This file
└── steem_burn_bot.log         # Log file (created when bot runs)
```

## Security Notes

- **Never commit `config.json` with real credentials to version control**
- Keep your posting key private
- Use only the posting key, never your master or active key
- The posting key can only create posts/comments, not transfer funds

## Contributing to the Burn Pool

By running this bot, you're contributing to:
- Reducing STEEM inflation
- Decreasing circulating supply
- Supporting the STEEM ecosystem
- Setting an example for deflationary initiatives

## License

This project is open source and available for anyone to use or modify.

## Support

If you encounter issues:
1. Check the log file for detailed error messages
2. Verify your configuration
3. Ensure you have the latest version of dependencies
4. Test your posting key manually on steemit.com

## Credits

Built with:
- [dsteem](https://github.com/steemit/dsteem) - JavaScript Steem library
- [node-schedule](https://github.com/node-schedule/node-schedule) - Node.js job scheduling

---

**Happy Burning! 🔥**

*Remember: Every burn makes STEEM more scarce!*
# Steem-Burn-Bot
# Burn-Pool-Voting-Pool
