---
title: IsolatedProcessEvents
---

# Interface: IsolatedProcessEvents

Defined in: [index.ts:80](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L80)

## Properties

### death

```ts
death: number;
```

Defined in: [index.ts:83](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L83)

***

### error

```ts
error: Error;
```

Defined in: [index.ts:82](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L82)

***

### exit

```ts
exit: {
  data?: unknown;
  type: "error" | "success" | "death";
};
```

Defined in: [index.ts:84](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L84)

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

Defined in: [index.ts:81](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L81)
