---
title: IsolatedProcessEvents
---

# Interface: IsolatedProcessEvents

Defined in: index.ts:80

## Properties

### death

```ts
death: number;
```

Defined in: index.ts:83

***

### error

```ts
error: Error;
```

Defined in: index.ts:82

***

### exit

```ts
exit: {
  data?: unknown;
  type: "error" | "success" | "death";
};
```

Defined in: index.ts:84

#### data?

```ts
optional data: unknown;
```

#### type

```ts
type: "error" | "success" | "death";
```

***

### ready

```ts
ready: void;
```

Defined in: index.ts:81
