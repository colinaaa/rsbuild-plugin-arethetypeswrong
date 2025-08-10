// Type declarations that declare both default and named exports
declare const _default: () => string;
export = _default;
// This creates the cjs-only-exports-default issue because
// the JS only has default export but types suggest named exports exist