#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import pJson from './package.json' assert { type: "json" };
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
	.version(pJson.version)
	.usage('[options] <keywords>')
	.option('-o, --owner [name]', 'Filter by the repositories owner')
	.option('-l, --language [language]', 'Filter by the repositories language')
	.option('-t, --topic [topic]', 'Filter by repository topics')
	.option('-s, --stars [range]', 'Filter by stars range (e.g., ">1000")')
	.option('-f, --forks [range]', 'Filter by forks range (e.g., ">100")')
	.option('-c, --created [date]', 'Filter by creation date (e.g., ">2023-01-01")')
	.option('-u, --updated [date]', 'Filter by last update date (e.g., ">2023-01-01")')
	.option('-i, --interactive', 'Interactive mode with detailed information')
	.option('-j, --json', 'Full output in JSON format')
	.parse(process.argv);

const options = program.opts();

if (!program.args.length) {
	program.help();
}

async function searchRepositories() {
	try {
		const keywords = program.args;
		let query = keywords.join(' ');

		// Build query string
		if (options.owner) query += ` user:${options.owner}`;
		if (options.language) query += ` language:${options.language}`;
		if (options.topic) query += ` topic:${options.topic}`;
		if (options.stars) query += ` stars:${options.stars}`;
		if (options.forks) query += ` forks:${options.forks}`;
		if (options.created) query += ` created:${options.created}`;
		if (options.updated) query += ` updated:${options.updated}`;

		const headers = {
			'Accept': 'application/vnd.github.v3+json',
			'User-Agent': 'gitcli'
		};

		// Add GitHub token if available
		if (process.env.GITHUB_TOKEN) {
			headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
		}

		const response = await axios.get(
			`https://api.github.com/search/repositories?sort=stars&order=desc&q=${encodeURIComponent(query)}`,
			{ headers }
		);

		// Show rate limit information
		const rateLimit = response.headers['x-ratelimit-remaining'];
		console.log(chalk.grey(`Rate limit remaining: ${rateLimit} requests\n`));

		if (options.json) {
			console.log(JSON.stringify(response.data, null, 2));
			return;
		}

		for (const repo of response.data.items) {
			console.log(chalk.cyan.bold(`\nName: ${repo.name}`));
			console.log(chalk.magenta.bold(`Owner: ${repo.owner.login}`));
			console.log(chalk.grey(`Description: ${repo.description || 'No description'}`));
			console.log(chalk.grey(`Clone URL: ${repo.clone_url}`));
			console.log(chalk.grey(`Stars: ${repo.stargazers_count} | Forks: ${repo.forks_count} | Watchers: ${repo.watchers_count}`));
			console.log(chalk.grey(`Size: ${(repo.size / 1024).toFixed(2)} MB`));
			console.log(chalk.grey(`Language: ${repo.language || 'Not specified'}`));
			console.log(chalk.grey(`License: ${repo.license?.name || 'Not specified'}`));
			console.log(chalk.grey(`Created: ${new Date(repo.created_at).toLocaleDateString()}`));
			console.log(chalk.grey(`Last Updated: ${new Date(repo.updated_at).toLocaleDateString()}`));
			
			if (repo.topics && repo.topics.length > 0) {
				console.log(chalk.grey(`Topics: ${repo.topics.join(', ')}`));
			}

			if (options.interactive) {
				try {
					// Get additional repository information
					const [languages, contributors] = await Promise.all([
						axios.get(repo.languages_url, { headers }),
						axios.get(repo.contributors_url, { headers })
					]);

					console.log(chalk.grey('\nLanguages:'));
					const totalBytes = Object.values(languages.data).reduce((a, b) => a + b, 0);
					Object.entries(languages.data).forEach(([lang, bytes]) => {
						const percentage = ((bytes / totalBytes) * 100).toFixed(1);
						console.log(chalk.grey(`  ${lang}: ${percentage}%`));
					});

					console.log(chalk.grey('\nTop Contributors:'));
					contributors.data.slice(0, 5).forEach(contrib => {
						console.log(chalk.grey(`  ${contrib.login}: ${contrib.contributions} contributions`));
					});
				} catch (error) {
					console.log(chalk.yellow('Could not fetch additional repository information'));
				}
			}

			console.log(chalk.grey('\n' + '-'.repeat(80)));
		}

	} catch (error) {
		if (error.response) {
			console.error(chalk.red(`Error: ${error.response.data.message}`));
			if (error.response.status === 403) {
				console.error(chalk.yellow('\nTip: Set GITHUB_TOKEN environment variable for higher rate limits'));
			}
		} else {
			console.error(chalk.red(`Error: ${error.message}`));
		}
		process.exit(1);
	}
}

searchRepositories();
