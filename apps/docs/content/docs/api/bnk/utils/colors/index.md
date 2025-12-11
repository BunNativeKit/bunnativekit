---
title: Overview
---

# utils/colors

Terminal color utilities using Bun.color for styled CLI output.

## Variables

### colors

```ts
const colors: {
  blue: (text) => string;
  bold: (text) => string;
  boldBlue: (text) => string;
  boldGreen: (text) => string;
  boldRed: (text) => string;
  boldYellow: (text) => string;
  cyan: (text) => string;
  dim: (text) => string;
  error: (text) => string;
  gray: (text) => string;
  green: (text) => string;
  info: (text) => string;
  magenta: (text) => string;
  red: (text) => string;
  success: (text) => string;
  warn: (text) => string;
  white: (text) => string;
  yellow: (text) => string;
};
```

Defined in: apps/bnk/src/utils/colors.ts:16

Color functions for terminal output

#### Type Declaration

##### blue()

```ts
blue: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### bold()

```ts
bold: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### boldBlue()

```ts
boldBlue: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### boldGreen()

```ts
boldGreen: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### boldRed()

```ts
boldRed: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### boldYellow()

```ts
boldYellow: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### cyan()

```ts
cyan: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### dim()

```ts
dim: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### error()

```ts
error: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### gray()

```ts
gray: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### green()

```ts
green: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### info()

```ts
info: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### magenta()

```ts
magenta: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### red()

```ts
red: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### success()

```ts
success: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### warn()

```ts
warn: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### white()

```ts
white: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

##### yellow()

```ts
yellow: (text) => string;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

###### Returns

`string`

## Functions

| Function | Description |
| ------ | ------ |
| [error](functions/error) | Print an error message |
| [header](functions/header) | Print a formatted header |
| [info](functions/info) | Print an info message |
| [keyValue](functions/keyValue) | Print a key-value pair |
| [listItem](functions/listItem) | Print a list item |
| [status](functions/status) | Print a status line with check/cross indicator |
| [success](functions/success) | Print a success message |
| [warn](functions/warn) | Print a warning message |
