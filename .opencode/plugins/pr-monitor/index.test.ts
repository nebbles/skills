import { expect, test } from "bun:test"

import plugin from "./index.ts"

test("plugin entrypoint loads and registers its tools", async () => {
  const tools: { name: string }[] = []
  const context = {
    options: {},
    tool: {
      transform: async (register: (editor: { add: (tool: { name: string }) => void }) => void) => {
        register({ add: (tool) => tools.push(tool) })
      },
    },
  } as unknown as Parameters<typeof plugin.setup>[0]

  const cleanup = await plugin.setup(context)
  try {
    expect(plugin.id).toBe("nebbles.github-pr-monitor")
    expect(tools.map((tool) => tool.name)).toEqual(["watch", "status", "unwatch"])
  } finally {
    if (typeof cleanup === "function") await cleanup()
  }
})
