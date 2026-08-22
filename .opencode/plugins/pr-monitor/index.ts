import { Plugin } from "@opencode-ai/plugin"

import { createMonitor, fetchPullRequestSnapshot } from "./monitor.ts"

const pullRequestInput = {
  type: "object",
  properties: {
    pullRequest: {
      type: "string",
      description: "GitHub PR URL or owner/repository#number",
    },
  },
  required: ["pullRequest"],
  additionalProperties: false,
} as const

const emptyInput = {
  type: "object",
  properties: {},
  additionalProperties: false,
} as const

export default Plugin.define({
  id: "nebbles.github-pr-monitor",
  setup: async (ctx) => {
    const monitor = createMonitor({
      fetchSnapshot: fetchPullRequestSnapshot,
      deliver: async ({ sessionID, eventID, ref, text }) => {
        try {
          await ctx.session.synthetic({
            sessionID,
            id: `msg_github_${eventID}`,
            text,
            description: `GitHub PR activity: ${ref.repository}#${ref.number}`,
            metadata: {
              source: "github",
              eventID,
              repository: ref.repository,
              pullRequestNumber: ref.number,
              url: ref.url,
            },
            delivery: "queue",
            resume: true,
          })
        } catch (error) {
          if (!isConflictError(error)) throw error
        }
      },
    })

    await ctx.tool.transform((tools) => {
      tools.add({
        name: "watch",
        description: "Monitor one GitHub pull request for the current OpenCode session",
        input: pullRequestInput,
        options: { namespace: "pr_monitor", codemode: false },
        execute: async (input, toolContext) => {
          const pullRequest = readPullRequest(input)
          const watched = await monitor.watch(toolContext.sessionID, pullRequest)
          return {
            content: `Watching ${watched.ref.url}. Baseline captured at ${watched.snapshot.updatedAt || "current GitHub state"}.`,
          }
        },
      })

      tools.add({
        name: "status",
        description: "Show the GitHub pull request watched by the current OpenCode session",
        input: emptyInput,
        options: { namespace: "pr_monitor", codemode: false },
        execute: async (_input, toolContext) => {
          const watch = monitor.status(toolContext.sessionID)
          if (!watch) return { content: "This session is not watching a pull request." }
          const error = watch.lastError ? ` Last poll error: ${watch.lastError}` : ""
          return {
            content: `Watching ${watch.ref.url}. Last checked ${watch.lastCheckedAt}.${error}`,
          }
        },
      })

      tools.add({
        name: "unwatch",
        description: "Stop GitHub pull request monitoring for the current OpenCode session",
        input: emptyInput,
        options: { namespace: "pr_monitor", codemode: false },
        execute: async (_input, toolContext) => ({
          content: monitor.unwatch(toolContext.sessionID)
            ? "Stopped watching the pull request."
            : "This session was not watching a pull request.",
        }),
      })
    })

    const configuredInterval = Number(ctx.options.intervalSeconds)
    const intervalSeconds = Number.isFinite(configuredInterval)
      ? Math.min(3600, Math.max(10, configuredInterval))
      : 30
    const timer = setInterval(() => void monitor.pollAll(), intervalSeconds * 1000)
    return () => clearInterval(timer)
  },
})

function readPullRequest(input: unknown): string {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("pullRequest is required")
  }
  const pullRequest = (input as Record<string, unknown>).pullRequest
  if (typeof pullRequest !== "string" || pullRequest.trim() === "") {
    throw new Error("pullRequest is required")
  }
  return pullRequest
}

function isConflictError(error: unknown): boolean {
  if (typeof error === "object" && error !== null) {
    const value = error as Record<string, unknown>
    if (value._tag === "ConflictError" || value.name === "ConflictError" || value.status === 409) return true
    if (value.cause !== error && isConflictError(value.cause)) return true
  }
  return error instanceof Error && error.message.includes("ConflictError")
}
