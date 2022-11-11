import mapKeys from 'lodash/mapKeys';
import snakeCase from 'lodash/snakeCase';

export const snakeCaseKeys = <T extends Record<string, unknown>>(obj: T) =>
  mapKeys(obj, (_value, key) => snakeCase(key));
