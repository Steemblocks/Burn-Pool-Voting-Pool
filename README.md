# Burn Pool Voting Bot

A lightweight bot to manage voting in a "burn pool" or token-burning community. Provides vote collection, simple tallying, and optional on-chain hooks or notifications.

## Features
- Create and manage voting sessions
- Support for multiple choices and weighted votes
- Persistent storage (file, SQLite, or configurable DB)
- Optional integration with messaging platforms (Discord, Telegram)
- Export results as JSON or CSV
- Simple CLI and programmable API

## Requirements
- Node.js 16+ or Python 3.9+ (choose implementation)
- Git
- Optional: PostgreSQL / SQLite / Redis for persistence
- Optional: API keys for messaging integrations

## Quick Start (Node.js example)
1. Clone the repo
  git clone https://example.com/your-repo.git
2. Install dependencies
  cd your-repo
  npm install
3. Create .env file (see Configuration)
4. Start the bot
  npm start

## Configuration
Create a `.env` or `config.yml` with the following minimum fields:
- BOT_ENV=development
- PORT=3000
- STORAGE=sqlite|file|postgres
- DATABASE_URL=postgres://user:pass@host/db
- DISCORD_TOKEN (if using Discord integration)
- TELEGRAM_TOKEN (if using Telegram integration)
- ADMIN_IDS=comma,separated,user,ids

Adjust according to chosen integrations and storage.

## Usage
- Create a vote:
  POST /api/votes { "title": "Burn Proposal", "options": ["A","B","C"], "durationMinutes": 1440 }
- Cast a vote:
  POST /api/votes/:id/vote { "voterId": "0xabc...", "choice": "A", "weight": 1 }
- Get results:
  GET /api/votes/:id/results

CLI commands (if included):
- npm run vote:create -- --title "Proposal" --options "A,B,C" --duration 1440
- npm run vote:results -- --id <vote-id>

## Persistence
- Default: SQLite file `data/db.sqlite`
- For production: set STORAGE=postgres and configure DATABASE_URL

## Security
- Validate and sanitize all incoming data
- Authenticate admin endpoints (API keys or OAuth)
- Rate-limit public endpoints to prevent abuse

## Testing
- Run unit tests:
  npm test
- Coverage:
  npm run coverage

## Deployment
- Containerize with Docker (include Dockerfile)
- Use environment variables for secrets
- Use a managed DB for production
- Use process manager (PM2, systemd) for Node deployments

## Contributing
- Fork -> branch -> PR
- Run tests and linters before submitting
- Follow established code style and add documentation for new features

## Troubleshooting
- Check logs in `logs/` or stdout
- Ensure DB migrations ran successfully
- Verify API keys and tokens are valid

## License
Specify a license (e.g., MIT). Add LICENSE file to repository.

## Contact
Open an issue or PR in the repository for questions or support.
