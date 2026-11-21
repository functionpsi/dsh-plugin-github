# dsh-plugin-github

> GitHub Repository Operations Plugin for DeepSeek Harness (DSH)

This plugin exposes GitHub repository operations as model-facing tools in DeepSeek Harness, allowing AI agents to interact with Git repositories directly.

## Features

- **github_clone** — Clone a GitHub repository
- **github_pull** — Pull updates from a GitHub repository
- **github_fetch** — Fetch updates from a GitHub repository without merging
- **github_push** — Push changes to a GitHub repository
- **github_status** — Show the working tree status of a GitHub repository
- **github_log** — Show commit logs of a GitHub repository
- **github_branch** — List or create branches in a GitHub repository

## Installation

### Via DSH Plugin Manager (Recommended)

```bash
# In DeepSeek Harness, use the plugin manager to install:
plugin_manager install_bundle @local/dsh-plugin-github
```

Or install from npm (once published):

```bash
plugin_manager install_bundle dsh-plugin-github
```

### Manual Installation

1. Copy the plugin files to your DSH profile's plugin directory
2. Enable it in your profile configuration

## Usage

Once installed and enabled, the tools are available to agents in DeepSeek Harness:

```javascript
// Clone a repository
await github_clone({
  description: "Clone the dsh repository",
  repoUrl: "https://github.com/deepseek-ai/dsh.git",
  workdir: "D:/Projects",
  branch: "main"
});

// Pull latest changes
await github_pull({
  description: "Pull latest changes",
  repoUrl: "https://github.com/deepseek-ai/dsh.git",
  workdir: "D:/Projects/dsh"
});

// Push changes
await github_push({
  description: "Push committed changes",
  repoUrl: "https://github.com/deepseek-ai/dsh.git",
  workdir: "D:/Projects/dsh"
});

// Check status
await github_status({
  description: "Check repository status",
  repoUrl: "https://github.com/deepseek-ai/dsh.git",
  workdir: "D:/Projects/dsh"
});

// View commit log
await github_log({
  description: "View recent commits",
  repoUrl: "https://github.com/deepseek-ai/dsh.git",
  workdir: "D:/Projects/dsh"
});

// List branches
await github_branch({
  description: "List all branches",
  repoUrl: "https://github.com/deepseek-ai/dsh.git",
  workdir: "D:/Projects/dsh"
});
```

## Tool Parameters

All tools share these common parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `description` | string | Yes | Description of the specific git operation |
| `repoUrl` | string | Yes | GitHub repository URL (e.g., `https://github.com/owner/repo.git`) |
| `workdir` | string | No | Working directory for the operation |
| `branch` | string | No | Branch name (for clone/pull operations) |
| `additionalArgs` | string | No | Additional git arguments to pass |

## Requirements

- **Git** must be installed and available in PATH
- **Authentication** for private repositories must be configured via:
  - Git credential helpers
  - SSH keys
  - Personal access tokens (via HTTPS URLs)
- **DSH Sandbox Policy** — All operations run in the host's sandbox according to DSH sandbox policy

## How It Works

The plugin uses DSH's `ctx.shell.execute` to run git commands in a controlled sandbox environment. Each tool:

1. Constructs the appropriate git command
2. Resolves it via `ctx.shell.resolve()`
3. Executes it via `ctx.shell.execute()`
4. Returns structured output with stdout, stderr, exit code, and metadata

## Development

### Project Structure

```
dsh-plugin-github/
├── index.js              # Main plugin entry point
├── package.json          # Package manifest
├── cordis.patch.yml      # Cordis plugin registration
├── icon.svg              # Plugin icon
├── locale/
│   └── en.json           # English localization
├── docs/
│   └── DETAIL.md         # Detailed documentation
├── LICENSE               # MIT License
└── README.md             # This file
```

### Building

No build step required — the plugin is pure JavaScript (ESM).

### Testing

Install in a local DSH profile:

```bash
plugin_manager install_bundle file:./dsh-plugin-github
```

## Configuration

The plugin requires no configuration. It automatically registers tools when loaded.

## Limitations

- Requires git to be installed and available in PATH
- Authentication for private repositories must be configured externally
- All operations respect DSH sandbox policy and timeout settings
- Operations run in the host environment, not in a container

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests locally
5. Submit a pull request

## License

MIT License — see [LICENSE](LICENSE) for details.

## Related

- [DeepSeek Harness](https://github.com/deepseek-ai/dsh)
- [DSH Plugin Development Guide](https://github.com/deepseek-ai/dsh/blob/main/docs/developing-plugins.md)
- [Cordis Plugin System](https://github.com/deepseek-ai/cordis)