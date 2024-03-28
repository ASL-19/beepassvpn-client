/* eslint-disable @typescript-eslint/no-explicit-any */

// Via https://stackoverflow.com/a/60437613
export type Replacement<M extends [any, any], T> = M extends any
  ? [T] extends [M[0]]
    ? M[1]
    : never
  : never;

// Via https://stackoverflow.com/a/60437613
export type DeepReplace<T, M extends [any, any]> = {
  [P in keyof T]: T[P] extends M[0]
    ? Replacement<M, T[P]>
    : T[P] extends object
    ? DeepReplace<T[P], M>
    : T[P];
};
