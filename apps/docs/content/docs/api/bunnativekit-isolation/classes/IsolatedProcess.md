---
title: IsolatedProcess
---

# Class: IsolatedProcess

Defined in: index.ts:90

Runs native code in an isolated subprocess with IPC

## Extends

- [`EventEmitter`](EventEmitter)\<[`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents)\>

## Constructors

### Constructor

```ts
new IsolatedProcess(config): IsolatedProcess;
```

Defined in: index.ts:104

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`IsolatedProcessConfig`](../interfaces/IsolatedProcessConfig) |

#### Returns

`IsolatedProcess`

#### Overrides

[`EventEmitter`](EventEmitter).[`constructor`](EventEmitter#constructor)

## Methods

### call()

```ts
call<T>(fn, ...args): Promise<T>;
```

Defined in: index.ts:154

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

Defined in: index.ts:52

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `data` | [`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents)\[`K`\] |

#### Returns

`void`

#### Inherited from

[`EventEmitter`](EventEmitter).[`emit`](EventEmitter#emit)

***

### isAlive()

```ts
isAlive(): boolean;
```

Defined in: index.ts:226

#### Returns

`boolean`

***

### off()

```ts
off<K>(event, handler): void;
```

Defined in: index.ts:48

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `handler` | [`EventHandler`](../type-aliases/EventHandler)\<[`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents)\[`K`\]\> |

#### Returns

`void`

#### Inherited from

[`EventEmitter`](EventEmitter).[`off`](EventEmitter#off)

***

### on()

```ts
on<K>(event, handler): void;
```

Defined in: index.ts:41

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* keyof [`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `K` |
| `handler` | [`EventHandler`](../type-aliases/EventHandler)\<[`IsolatedProcessEvents`](../interfaces/IsolatedProcessEvents)\[`K`\]\> |

#### Returns

`void`

#### Inherited from

[`EventEmitter`](EventEmitter).[`on`](EventEmitter#on)

***

### removeAllListeners()

```ts
removeAllListeners(): void;
```

Defined in: index.ts:62

#### Returns

`void`

#### Inherited from

[`EventEmitter`](EventEmitter).[`removeAllListeners`](EventEmitter#removealllisteners)

***

### restart()

```ts
restart(): Promise<void>;
```

Defined in: index.ts:217

#### Returns

`Promise`\<`void`\>

***

### shutdown()

```ts
shutdown(): Promise<void>;
```

Defined in: index.ts:199

#### Returns

`Promise`\<`void`\>

***

### start()

```ts
start(): Promise<void>;
```

Defined in: index.ts:119

#### Returns

`Promise`\<`void`\>
