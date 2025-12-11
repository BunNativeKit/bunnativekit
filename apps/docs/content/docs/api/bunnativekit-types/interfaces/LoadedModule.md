---
title: LoadedModule
---

# Interface: LoadedModule\<T\>

Defined in: index.ts:210

A loaded native module

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

## Properties

### binding

```ts
readonly binding: BindingMethod;
```

Defined in: index.ts:213

***

### isolated

```ts
readonly isolated: boolean;
```

Defined in: index.ts:214

***

### name

```ts
readonly name: string;
```

Defined in: index.ts:211

***

### path

```ts
readonly path: string;
```

Defined in: index.ts:212

## Methods

### call()

```ts
call<K>(fn, ...args): Promise<ReturnType<T[K] extends (...args) => any ? any[any] : never>>;
```

Defined in: index.ts:216

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

***

### close()

```ts
close(): Promise<void>;
```

Defined in: index.ts:217

#### Returns

`Promise`\<`void`\>

***

### on()

#### Call Signature

```ts
on(event, handler): void;
```

Defined in: index.ts:221

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"error"` |
| `handler` | (`error`) => `void` |

##### Returns

`void`

#### Call Signature

```ts
on(event, handler): void;
```

Defined in: index.ts:222

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"death"` |
| `handler` | (`exitCode`) => `void` |

##### Returns

`void`

#### Call Signature

```ts
on(event, handler): void;
```

Defined in: index.ts:223

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"exit"` |
| `handler` | (`event`) => `void` |

##### Returns

`void`

***

### restart()

```ts
restart(): Promise<void>;
```

Defined in: index.ts:219

Only works if isolated

#### Returns

`Promise`\<`void`\>
