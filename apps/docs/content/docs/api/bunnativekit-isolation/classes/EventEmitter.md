---
title: EventEmitter
---

# Class: EventEmitter\<Events\>

Defined in: index.ts:38

## Extended by

- [`IsolatedProcess`](IsolatedProcess)

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

Defined in: index.ts:52

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

Defined in: index.ts:48

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `handler` | [`EventHandler`](../type-aliases/EventHandler)\<`Events`\[`K`\]\> |

#### Returns

`void`

***

### on()

```ts
on<K>(event, handler): void;
```

Defined in: index.ts:41

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `handler` | [`EventHandler`](../type-aliases/EventHandler)\<`Events`\[`K`\]\> |

#### Returns

`void`

***

### removeAllListeners()

```ts
removeAllListeners(): void;
```

Defined in: index.ts:62

#### Returns

`void`
