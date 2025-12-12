---
title: IsolatedProcess
---

# Class: IsolatedProcess

Defined in: [index.ts:90](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L90)

Runs native code in an isolated subprocess with IPC

## Extends

- [`EventEmitter`](./EventEmitter.md)\<[`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents.md)\>

## Constructors

### Constructor

```ts
new IsolatedProcess(config): IsolatedProcess;
```

Defined in: [index.ts:104](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L104)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`IsolatedProcessConfig`](../interfaces/IsolatedProcessConfig.md) |

#### Returns

`IsolatedProcess`

#### Overrides

[`EventEmitter`](./EventEmitter.md).[`constructor`](./EventEmitter.md#constructor)

## Methods

### call()

```ts
call<T>(fn, ...args): Promise<T>;
```

Defined in: [index.ts:154](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L154)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | `string` |
| ...`args` | `unknown`[] |

#### Returns

`Promise`\<`T`\>

***

### emit()

```ts
emit<K>(event, data): void;
```

Defined in: [index.ts:52](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L52)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `data` | [`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents.md)\[`K`\] |

#### Returns

`void`

#### Inherited from

[`EventEmitter`](./EventEmitter.md).[`emit`](./EventEmitter.md#emit)

***

### isAlive()

```ts
isAlive(): boolean;
```

Defined in: [index.ts:226](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L226)

#### Returns

`boolean`

***

### off()

```ts
off<K>(event, handler): void;
```

Defined in: [index.ts:48](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L48)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `handler` | [`EventHandler`](../type-aliases/EventHandler.md)\<[`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents.md)\[`K`\]\> |

#### Returns

`void`

#### Inherited from

[`EventEmitter`](./EventEmitter.md).[`off`](./EventEmitter.md#off)

***

### on()

```ts
on<K>(event, handler): void;
```

Defined in: [index.ts:41](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L41)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `handler` | [`EventHandler`](../type-aliases/EventHandler.md)\<[`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents.md)\[`K`\]\> |

#### Returns

`void`

#### Inherited from

[`EventEmitter`](./EventEmitter.md).[`on`](./EventEmitter.md#on)

***

### removeAllListeners()

```ts
removeAllListeners(): void;
```

Defined in: [index.ts:62](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L62)

#### Returns

`void`

#### Inherited from

[`EventEmitter`](./EventEmitter.md).[`removeAllListeners`](./EventEmitter.md#removealllisteners)

***

### restart()

```ts
restart(): Promise<void>;
```

Defined in: [index.ts:217](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L217)

#### Returns

`Promise`\<`void`\>

***

### shutdown()

```ts
shutdown(): Promise<void>;
```

Defined in: [index.ts:199](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L199)

#### Returns

`Promise`\<`void`\>

***

### start()

```ts
start(): Promise<void>;
```

Defined in: [index.ts:119](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/internal/isolation/src/index.ts#L119)

#### Returns

`Promise`\<`void`\>
