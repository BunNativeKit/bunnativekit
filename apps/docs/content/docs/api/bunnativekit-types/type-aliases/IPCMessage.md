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

Defined in: [index.ts:86](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L86)

IPC message types for subprocess isolation
