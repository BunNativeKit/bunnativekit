---
title: EventEmitter
---

# Class: EventEmitter\<Events\>

Defined in: [index.ts:38](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L38)

## Extended by

- [`IsolatedProcess`](./IsolatedProcess.md)

## Type Parameters

| Type Parameter |
| ------ |
| `Events` *extends* `object` |

## Constructors

### Constructor

```ts
new EventEmitter<Events>(): EventEmitter<Events>;
```

#### Returns

`EventEmitter`\<`Events`\>

## Methods

### emit()

```ts
emit<K>(event, data): void;
```

Defined in: [index.ts:52](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L52)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `data` | `Events`\[`K`\] |

#### Returns

`void`

***

### off()

```ts
off<K>(event, handler): void;
```

Defined in: [index.ts:48](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L48)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `handler` | [`EventHandler`](../type-aliases/EventHandler.md)\<`Events`\[`K`\]\> |

#### Returns

`void`

***

### on()

```ts
on<K>(event, handler): void;
```

Defined in: [index.ts:41](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L41)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `handler` | [`EventHandler`](../type-aliases/EventHandler.md)\<`Events`\[`K`\]\> |

#### Returns

`void`

***

### removeAllListeners()

```ts
removeAllListeners(): void;
```

Defined in: [index.ts:62](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L62)

#### Returns

`void`
