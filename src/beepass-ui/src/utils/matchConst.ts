import { match } from "ts-pattern";

/**
 * Light wrapper around `ts-pattern` `match` using TypeScript 5 const type
 * parameter, removing the need to manually write redundant type parameters in
 * some cases.
 *
 * `ts-pattern` will probably be updated to do this internally soon.
 *
 * @example
 *
 * ```ts
 * match<typeof import.meta.env.VITE_BUILD_TYPE>(
 *   import.meta.env.VITE_BUILD_TYPE,
 * )
 * ```
 *
 * Can be written as:
 *
 * ```ts
 * matchConst(import.meta.env.VITE_BUILD_TYPE)
 * ```
 *
 * Otherwise `import.meta.env.VITE_BUILD_TYPE` (`"cordova-mock" |
 * "cordova-native" | "electron-mock" | "electron-native"`) is treated as a
 * string within the `match` chain (not sure exactly why).
 *
 * @see
 * - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters
 * - https://xebia.com/blog/typescript-5-0-and-the-new-const-modifier-on-type-parameters/
 */
const matchConst = <const ValueType>(value: ValueType) => match(value);

export default matchConst;
