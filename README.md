# GitCLI

A modern command-line tool for searching GitHub repositories with advanced filtering and detailed repository information.

## Features

- 🔍 Advanced repository search with multiple filters
- 📊 Detailed repository statistics
- 🎨 Beautiful colored output
- 🔐 GitHub token support for higher rate limits
- 📈 Repository metrics and analytics
- 👥 Contributor information
- 📝 Language breakdown
- 🏷️ Topic-based search
- 📅 Date-based filtering
- 📦 JSON output support

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/gitcli.git
cd gitcli

# Install dependencies
npm install

# Make the CLI executable
chmod +x gitcli.js

# (Optional) Create a symlink to use it globally
npm link
```

## Configuration

For higher rate limits and better API access, you can set up a GitHub token:

1. Create a GitHub personal access token at https://github.com/settings/tokens
2. Create a `.env` file in the project root:
```bash
GITHUB_TOKEN=your_github_token_here
```

## Usage

### Basic Search

```bash
# Search for repositories containing "react"
gitcli react

# Search with multiple keywords
gitcli "react native" typescript
```

### Advanced Filters

```bash
# Filter by owner
gitcli react -o facebook

# Filter by language
gitcli react -l typescript

# Filter by topic
gitcli react -t web

# Filter by stars
gitcli react -s ">1000"

# Filter by forks
gitcli react -f ">100"

# Filter by creation date
gitcli react -c ">2023-01-01"

# Filter by last update date
gitcli react -u ">2023-01-01"
```

### Interactive Mode

Get detailed repository information including language breakdown and top contributors:

```bash
gitcli react -i
```

### JSON Output

Get raw JSON output for programmatic use:

```bash
gitcli react -j
```

### Combining Filters

You can combine multiple filters for precise search:

```bash
# Search for TypeScript React repositories with more than 1000 stars
gitcli react -l typescript -s ">1000"

# Search for recently updated web frameworks
gitcli "web framework" -u ">2024-01-01" -s ">5000"
```

## Output Information

The CLI provides detailed information about each repository:

- Repository name and owner
- Description
- Clone URL
- Stars, forks, and watchers count
- Repository size
- Primary language
- License information
- Creation and last update dates
- Repository topics
- Language breakdown (in interactive mode)
- Top contributors (in interactive mode)

## Rate Limits

The CLI shows your remaining GitHub API rate limit with each request. To increase the rate limit:

1. Set up a GitHub token as described in the Configuration section
2. The CLI will automatically use the token for higher rate limits

## Requirements

- Node.js >= 14.0.0
- npm or yarn

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
