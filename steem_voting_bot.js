/**
 * Steem Blockchain Voting Bot
 * Continuously monitors and votes on every post created by steemburnup account
 * Voting account: steemburnpool
 * Uses dsteem library for blockchain operations
 */

const dsteem = require('dsteem');
const fs = require('fs');
const axios = require('axios');

// Configure logging
class Logger {
    constructor() {}

    log(level, message) {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const logMessage = `${timestamp} - ${level} - ${message}`;
        console.log(logMessage);
    }

    info(message) { this.log('INFO', message); }
    error(message) { this.log('ERROR', message); }
    warning(message) { this.log('WARNING', message); }
}

class SteemVotingBot {
    constructor(configFile = 'config.json') {
        this.logger = new Logger();
        this.config = this.loadConfig(configFile);
        this.client = null;
        this.privateKey = null;
        this.dryRun = this.config.dry_run || false;
        this.scheduledJob = null;
        this.currentNodeIndex = 0;
        this.votedPosts = new Set();
        
        if (this.dryRun) {
            this.logger.info('🧪 DRY RUN MODE - No votes will be cast');
            this.setupDryRun();
        } else {
            this.connectToSteem();
        }
    }

    loadConfig(configFile) {
        try {
            const configData = fs.readFileSync(configFile, 'utf8');
            const config = JSON.parse(configData);
            this.logger.info('Configuration loaded successfully');
            
            if (config.active_key === 'your_active_key_here' || config.voting_account === 'your_voting_account') {
                this.logger.warning('⚠️  Configuration still has template values!');
                this.logger.warning('You need to edit config.json with your actual Steem credentials');
                this.logger.warning('OR set "dry_run": true to test without credentials');
                if (!config.dry_run) {
                    throw new Error('Please update config.json with your Steem active key, or enable dry_run mode for testing');
                }
            }
            
            return config;
        } catch (error) {
            this.logger.error(`Failed to load configuration: ${error.message}`);
            throw error;
        }
    }

    setupDryRun() {
        this.logger.info('Setting up dry run mode - bot will simulate voting without blockchain interaction');
        this.logger.info(`Voting Account: ${this.config.voting_account || 'TEST_VOTER'}`);
        this.logger.info(`Target Account: ${this.config.target_account || 'TEST_TARGET'}`);
    }

    connectToSteem() {
        try {
            const nodes = this.config.nodes || ['https://api.steemit.com'];
            this.nodes = nodes;
            
            this.client = new dsteem.Client(nodes[this.currentNodeIndex], {
                timeout: 10000,
                failoverThreshold: 10,
                addressPrefix: 'STM',
                chainId: '0000000000000000000000000000000000000000000000000000000000000000'
            });

            const activeKey = this.config.active_key ? this.config.active_key.trim() : '';
            
            if (!activeKey || activeKey.length < 50) {
                throw new Error(`Invalid active key: Key is too short (${activeKey.length} chars) or missing. Expected 51+ characters.`);
            }

            if (!activeKey.startsWith('5')) {
                throw new Error('Invalid active key: Active keys should start with "5"');
            }

            this.logger.info(`Active key length: ${activeKey.length} characters`);

            const invalidChars = activeKey.match(/[0OIl]/g);
            if (invalidChars && invalidChars.length > 0) {
                this.logger.warning(`Active key contains invalid base58 characters: ${invalidChars.join(', ')}`);
                throw new Error(`Invalid active key: Contains non-base58 characters [${invalidChars.join(', ')}]. Please verify your key.`);
            }

            try {
                this.privateKey = dsteem.PrivateKey.fromString(activeKey);
            } catch (keyError) {
                throw new Error(`Invalid active key format: ${keyError.message}. Please verify your active key from Steemit.com`);
            }

            this.logger.info(`Connected to Steem blockchain as @${this.config.voting_account}`);
            this.logger.info(`Using node: ${nodes[this.currentNodeIndex]}`);
            
            this.verifyAccount();
        } catch (error) {
            this.logger.error(`Failed to connect to Steem: ${error.message}`);
            
            if (this.currentNodeIndex < this.nodes.length - 1) {
                this.currentNodeIndex++;
                this.logger.info(`Trying next node: ${this.nodes[this.currentNodeIndex]}`);
                return this.connectToSteem();
            }
            
            throw error;
        }
    }
    
    async switchNode() {
        if (!this.nodes || this.nodes.length <= 1) return false;
        
        this.currentNodeIndex = (this.currentNodeIndex + 1) % this.nodes.length;
        const newNode = this.nodes[this.currentNodeIndex];
        
        this.logger.info(`Switching to node: ${newNode}`);
        this.client = new dsteem.Client(newNode, {
            timeout: 10000,
            failoverThreshold: 10,
            addressPrefix: 'STM',
            chainId: '0000000000000000000000000000000000000000000000000000000000000000'
        });
        
        return true;
    }

    async verifyAccount() {
        try {
            const accounts = await this.client.database.getAccounts([this.config.voting_account]);
            if (accounts && accounts.length > 0) {
                const account = accounts[0];
                this.logger.info(`Account verified - Reputation: ${account.reputation}`);
            } else {
                throw new Error(`Account @${this.config.voting_account} not found`);
            }
        } catch (error) {
            this.logger.error(`Account verification failed: ${error.message}`);
        }
    }

    async getPosts(author, limit = 20) {
        try {
            // Use official Steem database API to fetch posts with full data including active_votes
            // This is the official API (more reliable than external Steemworld API)
            // Returns posts sorted newest first
            
            this.logger.info(`Fetching RECENT posts from @${author} using official API...`);
            
            // Use dsteem's database.getDiscussions method
            const posts = await this.client.database.getDiscussions('blog', {
                tag: author,
                limit: limit
            });

            if (!posts || posts.length === 0) {
                this.logger.warning(`No posts found for @${author}`);
                return [];
            }

            // Filter to only root posts (not comments)
            const rootPosts = posts.filter(post => post.parent_author === '');
            
            // Get only the most recent posts
            const recentPostsOnly = rootPosts.slice(0, limit);

            if (recentPostsOnly.length > 0) {
                this.logger.info(`✅ Fetched ${recentPostsOnly.length} RECENT root posts from @${author}`);
            } else {
                this.logger.warning(`⚠️  No root posts found from @${author}`);
            }
            
            return recentPostsOnly;
        } catch (error) {
            this.logger.error(`Failed to fetch posts from @${author}: ${error.message}`);
            
            // Fallback to Steemworld API if official API fails
            try {
                this.logger.info('Falling back to Steemworld API...');
                const steemworldUrl = `https://sds0.steemworld.org/posts_api/getRootPostsByAuthor/${author}`;
                const response = await axios.get(steemworldUrl, { timeout: 10000 });
                
                if (response.data && response.data.code === 0 && response.data.result) {
                    const { cols, rows } = response.data.result;
                    if (rows && rows.length > 0) {
                        const recentPostsOnly = rows.slice(0, limit);
                        const posts = [];
                        const authorIndex = cols.author;
                        const permlinkIndex = cols.permlink;
                        const titleIndex = cols.title;
                        
                        for (let i = 0; i < recentPostsOnly.length; i++) {
                            const row = recentPostsOnly[i];
                            if (Array.isArray(row)) {
                                posts.push({
                                    author: row[authorIndex],
                                    permlink: row[permlinkIndex],
                                    title: row[titleIndex]
                                });
                            }
                        }
                        this.logger.info(`✅ Fallback: Fetched ${posts.length} posts from Steemworld API`);
                        return posts;
                    }
                }
            } catch (fallbackError) {
                this.logger.error(`Fallback also failed: ${fallbackError.message}`);
            }
            
            return [];
        }
    }

    async castVote(author, permlink) {
        try {
            const voter = this.config.voting_account;
            const weight = this.config.vote_weight || 10000;

            const postId = `${author}/${permlink}`;

            if (this.votedPosts.has(postId)) {
                this.logger.info(`⏭️  Already voted on ${postId}, skipping...`);
                return false;
            }

            if (this.dryRun) {
                this.logger.info(`📝 DRY RUN - Would vote on: @${author}/${permlink}`);
                this.logger.info(`   Voter: @${voter}`);
                this.logger.info(`   Weight: ${weight / 100}%`);
                this.votedPosts.add(postId);
                return true;
            }

            const voteOp = {
                voter: voter,
                author: author,
                permlink: permlink,
                weight: weight
            };

            let retries = 0;
            const maxRetries = 3;
            
            while (retries < maxRetries) {
                try {
                    const result = await this.client.broadcast.sendOperations(
                        [['vote', voteOp]],
                        this.privateKey
                    );

                    this.logger.info(`✅ Successfully voted on @${author}/${permlink}`);
                    this.logger.info(`   Transaction ID: ${result.id}`);
                    this.votedPosts.add(postId);

                    return true;
                } catch (broadcastError) {
                    retries++;
                    this.logger.warning(`Vote attempt ${retries}/${maxRetries} failed: ${broadcastError.message}`);
                    
                    if (retries < maxRetries) {
                        const switched = await this.switchNode();
                        if (switched) {
                            this.logger.info(`Retrying with different node...`);
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        } else {
                            throw broadcastError;
                        }
                    } else {
                        throw broadcastError;
                    }
                }
            }

            return false;

        } catch (error) {
            this.logger.error(`❌ Failed to vote on @${author}/${permlink}: ${error.message}`);
            return false;
        }
    }

    async checkAndVoteOnNewPosts() {
        try {
            this.logger.info('='.repeat(60));
            this.logger.info('Checking for new posts from @' + this.config.target_account + '...');
            
            const targetAccount = this.config.target_account;
            const posts = await this.getPosts(targetAccount, this.config.posts_limit || 100);

            if (!posts || posts.length === 0) {
                this.logger.info('No posts found');
                this.logger.info('='.repeat(60));
                return 0;
            }

            this.logger.info(`Found ${posts.length} posts from @${targetAccount}`);

            let votedCount = 0;
            
            for (const post of posts) {
                const postId = `${post.author}/${post.permlink}`;
                
                // Check memory cache first (FAST - no API calls)
                if (this.votedPosts.has(postId)) {
                    this.logger.info(`⏭️  Already voted on ${postId} (from cache), skipping...`);
                    continue;
                }

                // Check if we already voted on this post using blockchain data
                // active_votes comes directly from the official API, no external calls needed
                if (post.active_votes && post.active_votes.length > 0) {
                    const alreadyVoted = post.active_votes.some(vote => vote.voter === this.config.voting_account);
                    if (alreadyVoted) {
                        this.logger.info(`⏭️  Already voted on ${postId} (blockchain check), skipping...`);
                        this.votedPosts.add(postId);
                        continue;
                    }
                }

                // If not voted yet, attempt to vote
                const success = await this.castVote(post.author, post.permlink);
                if (success) {
                    votedCount++;
                    
                    const delayMs = this.config.vote_delay_ms || 1000;
                    if (votedCount < posts.length) {
                        await new Promise(resolve => setTimeout(resolve, delayMs));
                    }
                }
            }

            this.logger.info(`Voted on ${votedCount} new posts`);
            this.logger.info('='.repeat(60));
            return votedCount;

        } catch (error) {
            this.logger.error(`Error checking and voting on posts: ${error.message}`);
            if (error.stack) {
                this.logger.error(`Stack trace: ${error.stack}`);
            }
            this.logger.info('='.repeat(60));
            return 0;
        }
    }

    async job() {
        await this.checkAndVoteOnNewPosts();
    }

    async run() {
        this.logger.info('🚀 Steem Voting Bot started!');
        
        if (!this.config.target_account) {
            throw new Error('target_account is required in config.json');
        }

        if (!this.config.voting_account) {
            throw new Error('voting_account is required in config.json');
        }
        
        const checkIntervalSeconds = this.config.check_interval_seconds || 300;
        if (checkIntervalSeconds <= 0 || checkIntervalSeconds > 86400) {
            throw new Error(`Invalid check_interval_seconds: ${checkIntervalSeconds}. Must be between 1 and 86400.`);
        }
        
        this.logger.info(`Target Account: @${this.config.target_account}`);
        this.logger.info(`Voting Account: @${this.config.voting_account}`);
        this.logger.info(`Vote Weight: ${(this.config.vote_weight || 10000) / 100}%`);
        this.logger.info(`Check Interval: Every ${checkIntervalSeconds} seconds`);

        if (this.config.check_immediately !== false) {
            this.logger.info('Checking for posts immediately...');
            await this.job();
        }

        const intervalMs = checkIntervalSeconds * 1000;
        
        this.scheduledJob = setInterval(async () => {
            await this.job();
        }, intervalMs);

        this.logger.info(`⏰ Scheduled to check every ${checkIntervalSeconds} seconds`);
        this.logger.info('Bot is now running. Press Ctrl+C to stop.');
        
        const shutdown = async () => {
            this.logger.info('\n🛑 Shutting down gracefully...');
            
            if (this.scheduledJob) {
                clearInterval(this.scheduledJob);
                this.logger.info('Stopped scheduled jobs');
            }
            
            this.logger.info('Bot stopped');
            
            setTimeout(() => {
                process.exit(0);
            }, 500);
        };
        
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }
}

async function main() {
    try {
        const bot = new SteemVotingBot('config.json');
        await bot.run();
    } catch (error) {
        console.error(`Failed to start bot: ${error.message}`);
        process.exit(1);
    }
}

main();
