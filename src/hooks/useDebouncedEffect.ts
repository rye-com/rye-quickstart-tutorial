import { useEffect } from 'react';

// Maybe we should use an external lib here?
export const useDebouncedEffect = (
  /** Returned cleanup callback is currently not called */
  effect: () => void,
  deps: Array<unknown>,
  delay: number,
) => {
  useEffect(() => {
    const handler = setTimeout(effect, delay);

    return () => clearTimeout(handler);
    // TODO: include `effect` in the deps array, and then use `useCallback` on the code being passed in, etc.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
};
