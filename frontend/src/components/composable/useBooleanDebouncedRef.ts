import { customRef } from "vue";

export function useBooleanDebouncedRef(value: Boolean, delay = 2) {
  let timeout: NodeJS.Timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}
