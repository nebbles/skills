# GitHub PR Monitor

Project-local OpenCode V2 plugin that polls one GitHub pull request per session and sends changed PR activity back to that session.

## Requirements

- OpenCode V2
- GitHub CLI installed and authenticated with `gh auth login`

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
