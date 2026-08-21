# Agent Plugins

A personal collection of useful agent skills.

## Install

### Claude Code via Marketplace

The marketplace keeps up-to-date with the plugin, and works for Claude Code on the web.

#### Desktop

1. Go to the "Customize" page from the sidebar.
2. Click the `+` next to "Personal plugins", select `Create plugin > Add marketplace`
3. Choose `Add from repository`.
4. Enter the marketplace name `nebbles/skills` and click `Sync`.

You can then choose which plugins to install from this repo.

#### CLI

Add the marketplace

```
/plugin marketplace add nebbles/skills
```

Then install a plugin from it, for example:

```
/plugin install core@nebbles-skills
```

### Skills

```
pnpx skills@latest add nebbles/skills
```

## Adding skills to this collection

Files are symlinked into the core plugin.

```
pnpx skills@latest add <repository>
```

## OpenCode plugins

- [GitHub PR monitor](.opencode/plugins/pr-monitor/README.md): poll a PR and send changed activity to the watching OpenCode V2 session.

## Credits

- https://github.com/mattpocock/skills
- https://github.com/vercel-labs/agent-browser
- https://github.com/stolinski/s-stack
- https://github.com/cursor/plugins/blob/main/cursor-team-kit/skills/thermo-nuclear-code-quality-review/SKILL.md
- https://github.com/emilkowalski/skills
- https://github.com/shadcn/improve
- humanlayer/skills --skill show-me

## Sourcing from others

```
pnpx skills add <repo> --skill <skill_name>
```
