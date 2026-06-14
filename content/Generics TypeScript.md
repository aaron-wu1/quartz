---
date: '2025-09-16'
tags:
- programing-language
title: Generics TypeScript
---

Make abstractions to make code a lot more DRY and less excess type annotations

Pattern 1 (generic types with type helpers):
```ts
// you can pass types to other types!
type MyGenericType<TData> = {
  data: TData;
};

type Example1 = MyGenericType<{
  firstName: string;
}>;

// Example 1 is of type:
// type Example1 = {
//   data: {
//       firstName: string;
//   };
// }

type Example2 = MyGenericType<string>

// Example 2 is of type:
// type Example2 = {  
//   data: string;  
// }


```

Pattern 2 (typed functions)
```ts
// you can create functions with a type helper mapped over the top,
// and pass the type to them manually...

const makeFetch = <TData> (url: string): Promise<TData> => {
  return fetch(url).then((res) => res.json());
};

// function type argument: { firstName: string ... }
makeFetch<{ firstName: string; lastName: string }>(
  "/api/endpoint" // runtime argument
).then(
  (res) => {
    console.log(res);
    // res type:
    // (parameter) res: {
    //   firstName: string;
    //   lastName: string;
    // }
  }
)

```

Pattern 3 (Passed in generic type)
```ts
// passing types to set

const set = new Set<number>();
// type errors
set.add("abc")
// no type erros
set.add(1)

// what set looks like under the hood
// interface Set<T> {
//   add(value: T): this;
// }
```

Pattern 4 (inferred types):
```ts
// infer types
const addIdToObject = <TObj>(obj: TObj) => {
  return {
    ...obj,
    id: "123",
  }
};

// this passed in type argument is infered in result
const result = addIdToObject({
  firstName: "Matt",
  lastName: "Pocock",
})

console.log(result)
//const result: {
//   firstName: string;
//   lastName: string;
// } & {
//   id: string;
// }
```

Pattern 5 (constraints):
```ts
// constraints, extends function type or return type
// T must be a subtype (extends) of T2
type GetPromiseReturnType<T extends (...args: any) => any> = Awaited<ReturnType<T>>;

type Result2 = ReturnType<() => number>;

// under the hood return type has constraint: <T extends (...args: any)>
// type ReturnType<T extends (...args: any) => any>

type Result = GetPromiseReturnType<
  () => Promise<{
    fistName: string;
    lastName: string;
    id: string;
  }>
>;
```

Pattern 6 (multiple generics, constrain + infer)
```ts
// multiple generics
// adds second argument that constains TKey but still infer it
const getValue = <TObj, TKey extends keyof TObj>(obj: TObj, key: TKey) => {
  if (key === "bad") {
    throw Error(`Don't access the bad key`)
  }
  return obj[key];
}

const res = getValue(
  {
    a: 1,
    b: "some-string",
    c: true,
  },
  "a"
);

// Infers returning a number becuase key a is a number
// const getValue: <{
//   a: number;
//   b: string;
//   c: boolean;
// }, "a">(obj: {
//   a: number;
//   b: string;
//   c: boolean;
// }, key: "a") => number

const res2 = getValue(
  {
    a: 1,
    b: "some-string",
    c: true,
  },
  "b"
);

// Infers returning a string becuase key b is a string
// const getValue: <{
//   a: number;
//   b: string;
//   c: boolean;
// }, "a">(obj: {
//   a: number;
//   b: string;
//   c: boolean;
// }, key: "b") => string
```

Pattern 7 (default types) 
```ts
// Default type parameters
export const createSet = <T = string>() =>{
  return new Set<T>();
};

const numberSet = createSet<number>();
const stringSet = createSet<string>();

const otherStringSet = createSet();
// const createSet: <string>() => Set<string>
```