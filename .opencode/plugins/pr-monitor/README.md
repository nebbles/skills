# GitHub PR Monitor

Project-local OpenCode V2 plugin that polls one GitHub pull request per session and sends changed PR activity back to that session.

## Requirements

- OpenCode 2.2.7 (the plugin SDK is pinned to the matching release)
- GitHub CLI installed and authenticated with `gh auth login`

## Install

Install the local plugin dependency after cloning this repository:

```sh
cd .opencode/plugins/pr-monitor
bun install
```

OpenCode discovers the plugin automatically from `.opencode/plugins/`.

Use the supported `@opencode/plugin` SDK, not the legacy
`@opencode-ai/plugin` beta package. OpenCode supplies its own SDK and Effect
modules at runtime; mixing them with beta schema packages can fail during
loading even when a standalone Bun import succeeds. When updating OpenCode,
update the SDK pin and verify the plugin is active in the running server.

## Use

Ask OpenCode to use `pr_monitor.watch` with either:

```text
https://github.com/owner/repository/pull/123
owner/repository#123
```

Use `pr_monitor.status` to inspect the watch and `pr_monitor.unwatch` to stop it.

The plugin captures the current PR as its baseline. Every 30 seconds it checks state, commits, comments, reviews, and CI checks. Changes enter the session as queued synthetic activity.

Set a different interval in `opencode.jsonc`:

```jsonc
{
  "plugins": [
    {
      "package": "./.opencode/plugins/pr-monitor",
      "options": { "intervalSeconds": 60 }
    }
  ]
}
```

This MVP keeps subscriptions in memory. Plugin reloads and OpenCode restarts clear them.
