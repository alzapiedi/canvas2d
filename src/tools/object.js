export function setAttributes(context, options, keys) {
  keys.forEach(key => {
    if (options[key] !== undefined) context[key] = options[key];
  });
}
