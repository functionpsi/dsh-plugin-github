import { defineTool } from "@deepseek-ai/dsh-tools";

/**
 * GitHub Plugin for DeepSeek Harness.
 * Exposes GitHub repository operations as model-facing tools.
 */

export const inject = ["shell", "shellEnv"];

function renderGitResult(value) {
	const lines = [];
	if (value.stdout?.text) lines.push(value.stdout.text.trim());
	if (value.stderr?.text) lines.push(value.stderr.text.trim());
	if (value.exitCode !== 0 && value.exitCode !== null) {
		lines.push(`[exit code: ${value.exitCode}]`);
	}
	if (value.signal) {
		lines.push(`[signal: ${value.signal}]`);
	}
	if (value.timedOut) {
		lines.push("[timed out]");
	}
	if (value.aborted) {
		lines.push("[aborted]");
	}
	return lines.join("\n") || "(no output)";
}

export function apply(ctx) {
	const tools = [];
	const toolConfigs = [
		{ name: "github_clone", description: "Clones a GitHub repository.", baseCommand: "git clone" },
		{ name: "github_pull", description: "Pulls updates from a GitHub repository.", baseCommand: "git pull" },
		{ name: "github_fetch", description: "Fetches updates from a GitHub repository.", baseCommand: "git fetch" },
		{ name: "github_push", description: "Pushes changes to a GitHub repository.", baseCommand: "git push" },
		{ name: "github_status", description: "Shows the working tree status of a GitHub repository.", baseCommand: "git status" },
		{ name: "github_log", description: "Shows commit logs of a GitHub repository.", baseCommand: "git log --oneline -20" },
		{ name: "github_branch", description: "Lists or creates branches in a GitHub repository.", baseCommand: "git branch" }
	];

	toolConfigs.forEach(({ name, description, baseCommand }) => {
		const tool = defineTool({
			name,
			description,
			parameters: {
				description: {
					type: "string",
					required: true,
					description: "Description of the specific git operation (e.g., 'Clone the repository')."
				},
				repoUrl: {
					type: "string",
					required: true,
					description: "GitHub repository URL (e.g., https://github.com/owner/repo.git)."
				},
				workdir: {
					type: "string",
					description: "Working directory for the operation."
				},
				branch: {
					type: "string",
					description: "Branch name (for clone/pull operations)."
				},
				additionalArgs: {
					type: "string",
					description: "Additional git arguments to pass."
				}
			},
			output: {
				schema: { oneOf: [
					{
						type: "object",
						additionalProperties: false,
						properties: {
							kind: { type: "string", const: "promoted", required: true },
							cwd: { type: "string", required: true },
							jobId: { type: "string", required: true },
							timeoutMs: { type: "number", required: true },
							output: { type: "string", required: true }
						}
					},
					{
						type: "object",
						additionalProperties: false,
						properties: {
							kind: { type: "string", const: "foreground", required: true },
							cwd: { type: "string", required: true },
							exitCode: { oneOf: [{ type: "integer" }, { type: "null" }], required: true },
							signal: { oneOf: [{ type: "string" }, { type: "null" }], required: true },
							timedOut: { type: "boolean", required: true },
							aborted: { type: "boolean", required: true },
							stopped: { type: "string" },
							timeoutMs: { type: "number", required: true },
							stdout: {
								type: "object",
								additionalProperties: false,
								required: true,
								properties: {
									text: { type: "string", required: true },
									truncated: { type: "boolean", required: true },
									spillPath: { type: "string" }
								}
							},
							stderr: {
								type: "object",
								additionalProperties: false,
								required: true,
								properties: {
									text: { type: "string", required: true },
									truncated: { type: "boolean", required: true },
									spillPath: { type: "string" }
								}
							}
						}
					}
				] },
				render: (_args, value) => [{
					type: "text",
					text: renderGitResult(value)
				}],
				presentationMeta: (_args, value) => ({ cwd: value.cwd })
			},
			async execute(args, exec) {
				const { repoUrl, workdir, branch, additionalArgs } = args;
				let cmd = `${baseCommand} ${repoUrl}`;
				
				if (branch && (baseCommand === "git clone" || baseCommand === "git pull")) {
					cmd += ` -b ${branch}`;
				}
				
				if (additionalArgs) {
					cmd += ` ${additionalArgs}`;
				}

				const spec = ctx.shell.resolve({
					command: cmd,
					workdir: workdir,
					dshEnv: ctx.shellEnv.collect(exec)
				});

				const execution = await ctx.shell.execute(spec);
				const result = await execution.result();
				return {
					kind: "foreground",
					exitCode: result.exitCode,
					signal: result.signal,
					timedOut: result.timedOut,
					aborted: result.aborted,
					stdout: result.stdout,
					stderr: result.stderr,
					cwd: spec.workdir
				};
			}
		});
		
		// Register the tool with the tools capability
		ctx.tools.register(tool);
	});
}