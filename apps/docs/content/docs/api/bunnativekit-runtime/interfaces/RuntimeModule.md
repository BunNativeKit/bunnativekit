---
title: RuntimeModule
---

# Interface: RuntimeModule\<T\>

Defined in: runtime/src/index.ts:36

A loaded native module

## Extends

- [`LoadedModule`](LoadedModule)\<`T`\>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

## Properties

### binding

```ts
readonly binding: BindingMethod;
```

Defined in: types/src/index.ts:213

#### Inherited from

[`LoadedModule`](LoadedModule).[`binding`](LoadedModule#binding)

***

### isolated

```ts
readonly isolated: boolean;
```

Defined in: types/src/index.ts:214

#### Inherited from

[`LoadedModule`](LoadedModule).[`isolated`](LoadedModule#isolated)

***

### manifest

```ts
readonly manifest: ModuleManifest | null;
```

Defined in: runtime/src/index.ts:38

***

### name

```ts
readonly name: string;
```

Defined in: types/src/index.ts:211

#### Inherited from

[`LoadedModule`](LoadedModule).[`name`](LoadedModule#name)

***

### path

```ts
readonly path: string;
```

Defined in: types/src/index.ts:212

#### Inherited from

[`LoadedModule`](LoadedModule).[`path`](LoadedModule#path)

## Methods

### call()

```ts
call<K>(fn, ...args): Promise<ReturnType<T[K] extends (...args) => any ? any[any] : never>>;
```

Defined in: types/src/index.ts:216

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

[`LoadedModule`](LoadedModule).[`call`](LoadedModule#call)

***

### close()

```ts
close(): Promise<void>;
```

Defined in: types/src/index.ts:217

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`LoadedModule`](LoadedModule).[`close`](LoadedModule#close)

***

### on()

#### Call Signature

```ts
on(event, handler): void;
```

Defined in: types/src/index.ts:221

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"error"` |
| `handler` | (`error`) => `void` |

##### Returns

`void`

##### Inherited from

[`LoadedModule`](LoadedModule).[`on`](LoadedModule#on)

#### Call Signature

```ts
on(event, handler): void;
```

Defined in: types/src/index.ts:222

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"death"` |
| `handler` | (`exitCode`) => `void` |

##### Returns

`void`

##### Inherited from

[`LoadedModule`](LoadedModule).[`on`](LoadedModule#on)

#### Call Signature

```ts
on(event, handler): void;
```

Defined in: types/src/index.ts:223

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"exit"` |
| `handler` | (`event`) => `void` |

##### Returns

`void`

##### Inherited from

[`LoadedModule`](LoadedModule).[`on`](LoadedModule#on)

***

### restart()

```ts
restart(): Promise<void>;
```

Defined in: types/src/index.ts:219

Only works if isolated

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`LoadedModule`](LoadedModule).[`restart`](LoadedModule#restart)
