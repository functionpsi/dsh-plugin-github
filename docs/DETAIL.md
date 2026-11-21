# GitHub Repository Operations

This plugin exposes GitHub repository operations as model-facing tools in DeepSeek Harness.

## Available Tools

### github_clone
Clones a GitHub repository.
- **repoUrl** (required): GitHub repository URL (e.g., `https://github.com/owner/repo.git`)
- **workdir**: Working directory for the clone operation
- **branch**: Branch name to clone (optional)
- **additionalArgs**: Additional git arguments (optional)

### github_pull
Pulls updates from a GitHub repository.
- **repoUrl** (required): GitHub repository URL
- **workdir**: Working directory (must be inside a git repository)
- **branch**: Branch name to pull (optional)
- **additionalArgs**: Additional git arguments (optional)

### github_fetch
Fetches updates from a GitHub repository without merging.
- **repoUrl** (required): GitHub repository URL
- **workdir**: Working directory (must be inside a git repository)
- **additionalArgs**: Additional git arguments (optional)

### github_push
Pushes changes to a GitHub repository.
- **repoUrl** (required): GitHub repository URL
- **workdir**: Working directory (must be inside a git repository)
- **additionalArgs**: Additional git arguments (optional)

### github_status
Shows the working tree status of a GitHub repository.
- **repoUrl** (required): GitHub repository URL
- **workdir**: Working directory (must be inside a git repository)
- **additionalArgs**: Additional git arguments (optional)

### github_log
Shows commit logs of a GitHub repository.
- **repoUrl** (required): GitHub repository URL
- **workdir**: Working directory (must be inside a git repository)
- **additionalArgs**: Additional git arguments (optional)

### github_branch
Lists or creates branches in a GitHub repository.
- **repoUrl** (required): GitHub repository URL
- **workdir**: Working directory (must be inside a git repository)
- **additionalArgs**: Additional git arguments (optional)

## Usage Example

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
```

## Limitations

- Requires git to be installed and available in PATH
- Authentication for private repositories must be configured via git credential helpers or SSH keys
- All operations run in the host's sandbox according to DSH sandbox policy
- The plugin uses `ctx.shell.execute` internally and respects the shell service's timeout and sandbox settings