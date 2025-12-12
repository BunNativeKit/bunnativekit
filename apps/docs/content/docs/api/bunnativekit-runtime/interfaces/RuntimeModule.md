---
title: RuntimeModule
---

# Interface: RuntimeModule\<T\>

Defined in: [runtime/src/index.ts:36](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/runtime/src/index.ts#L36)

A loaded native module

## Extends

- [`LoadedModule`](./LoadedModule.md)\<`T`\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

## Properties

### binding

```ts
readonly binding: BindingMethod;
```

Defined in: [types/src/index.ts:213](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L213)

#### Inherited from

[`LoadedModule`](./LoadedModule.md).[`binding`](./LoadedModule.md#binding)

***

### isolated

```ts
readonly isolated: boolean;
```

Defined in: [types/src/index.ts:214](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L214)

#### Inherited from

[`LoadedModule`](./LoadedModule.md).[`isolated`](./LoadedModule.md#isolated)

***

### manifest

```ts
readonly manifest: ModuleManifest | null;
```

Defined in: [runtime/src/index.ts:38](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/runtime/src/index.ts#L38)

***

### name

```ts
readonly name: string;
```

Defined in: [types/src/index.ts:211](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L211)

#### Inherited from

[`LoadedModule`](./LoadedModule.md).[`name`](./LoadedModule.md#name)

***

### path

```ts
readonly path: string;
```

Defined in: [types/src/index.ts:212](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L212)

#### Inherited from

[`LoadedModule`](./LoadedModule.md).[`path`](./LoadedModule.md#path)

## Methods

### call()

```ts
call<K>(fn, ...args): Promise<ReturnType<T[K] extends (...args) => any ? any[any] : never>>;
```

Defined in: [types/src/index.ts:216](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L216)

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* `string` \| `number` \| `symbol` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | `K` |
| ...`args` | `Parameters`\<`T`\[`K`\] *extends* (...`args`) => `any` ? `any`\[`any`\] : `never`\> |

#### Returns

`Promise`\<`ReturnType`\<`T`\[`K`\] *extends* (...`args`) => `any` ? `any`\[`any`\] : `never`\>\>

#### Inherited from

[`LoadedModule`](./LoadedModule.md).[`call`](./LoadedModule.md#call)

***

### close()

```ts
close(): Promise<void>;
```

Defined in: [types/src/index.ts:217](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L217)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`LoadedModule`](./LoadedModule.md).[`close`](./LoadedModule.md#close)

***

### on()

#### Call Signature

```ts
on(event, handler): void;
```

Defined in: [types/src/index.ts:221](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L221)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"error"` |
| `handler` | (`error`) => `void` |

##### Returns

`void`

##### Inherited from

[`LoadedModule`](./LoadedModule.md).[`on`](./LoadedModule.md#on)

#### Call Signature

```ts
on(event, handler): void;
```

Defined in: [types/src/index.ts:222](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L222)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"death"` |
| `handler` | (`exitCode`) => `void` |

##### Returns

`void`

##### Inherited from

[`LoadedModule`](./LoadedModule.md).[`on`](./LoadedModule.md#on)

#### Call Signature

```ts
on(event, handler): void;
```

Defined in: [types/src/index.ts:223](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L223)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"exit"` |
| `handler` | (`event`) => `void` |

##### Returns

`void`

##### Inherited from

[`LoadedModule`](./LoadedModule.md).[`on`](./LoadedModule.md#on)

***

### restart()

```ts
restart(): Promise<void>;
```

Defined in: [types/src/index.ts:219](https://github.com/BunNativeKit/bunnativekit/blob/52f64e2494d2c1ae85c3ecd54a344650c047937e/packages/types/src/index.ts#L219)

Only works if isolated

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`LoadedModule`](./LoadedModule.md).[`restart`](./LoadedModule.md#restart)
