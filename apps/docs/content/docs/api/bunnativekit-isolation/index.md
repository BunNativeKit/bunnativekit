---
title: Overview
---

# @bunnativekit/isolation

Subprocess isolation for safe native module execution.
Runs native code in separate processes with IPC communication.

## Classes

| Class | Description |
| ------ | ------ |
| [EventEmitter](classes/EventEmitter) | - |
| [IsolatedProcess](classes/IsolatedProcess) | Runs native code in an isolated subprocess with IPC |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [IPCLifecycle](interfaces/IPCLifecycle) | - |
| [IPCRequest](interfaces/IPCRequest) | - |
| [IPCResponse](interfaces/IPCResponse) | - |
| [IsolatedProcessConfig](interfaces/IsolatedProcessConfig) | - |
| [IsolatedProcessEvents](interfaces/IsolatedProcessEvents) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [EventHandler](type-aliases/EventHandler) | - |
| [IPCMessage](type-aliases/IPCMessage) | - |

## Variables

### WORKER\_SCRIPT\_CONTENT

```ts
const WORKER_SCRIPT_CONTENT: "\nimport { loadModule } from \"@bunnativekit/loader\";\n\nasync function main() {\n  const modulePath = process.env.BNK_MODULE_PATH!;\n  const binding = process.env.BNK_BINDING as \"ffi\" | \"napi\" | \"cc\";\n  const symbols = JSON.parse(process.env.BNK_SYMBOLS || \"{}\");\n  const debug = process.env.BNK_DEBUG === \"1\";\n\n  // Load the module\n  const mod = loadModule({\n    path: modulePath,\n    binding,\n    ffiSymbols: binding === \"ffi\" ? symbols : undefined,\n    debug,\n  });\n\n  process.send?.({ type: \"ready\", pid: process.pid });\n\n  process.on(\"message\", async (msg: any) => {\n    if (msg.type === \"call\") {\n      try {\n        const result = mod.call(msg.fn, ...msg.args);\n        process.send?.({ id: msg.id, type: \"result\", value: result });\n      } catch (error) {\n        process.send?.({\n          id: msg.id,\n          type: \"error\",\n          error: error instanceof Error ? error.message : String(error),\n        });\n      }\n    } else if (msg.type === \"shutdown\") {\n      mod.close();\n      process.exit(0);\n    }\n  });\n\n  process.on(\"SIGTERM\", () => {\n    mod.close();\n    process.exit(0);\n  });\n}\n\nif (process.send) {\n  main().catch((error) => {\n    console.error(\"Worker error:\", error);\n    process.exit(1);\n  });\n}\n";
```

Defined in: index.ts:275

Inline worker script for spawned subprocesses

## Functions

| Function | Description |
| ------ | ------ |
| [createIsolatedProcess](functions/createIsolatedProcess) | - |
