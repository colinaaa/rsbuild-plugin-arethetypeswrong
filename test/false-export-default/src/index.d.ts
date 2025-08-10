// Type declarations that incorrectly use export default instead of export =
declare const _default: {
  hello: string;
  greet: (name: string) => string;
};

// This should be "export = _default" for CommonJS compatibility
// but uses export default instead, causing missing-export-equals
export default _default;
