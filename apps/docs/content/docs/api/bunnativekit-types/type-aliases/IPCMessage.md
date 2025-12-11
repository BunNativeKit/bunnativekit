---
title: IPCMessage
---

# Type Alias: IPCMessage

```ts
type IPCMessage = 
  | {
  type: "ready";
}
  | {
  args: any[];
  fn: string;
  id: string;
  type: "call";
}
  | {
  id: string;
  type: "result";
  value: any;
}
  | {
  error: string;
  id: string;
  type: "error";
}
  | {
  type: "shutdown";
};
```

Defined in: index.ts:86

IPC message types for subprocess isolation
