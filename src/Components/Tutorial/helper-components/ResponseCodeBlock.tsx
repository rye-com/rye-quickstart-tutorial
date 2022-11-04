import type { ThemeEnum } from '../types';
import { PrettifiedJSONResponse } from './PrettifiedJSONResponse';

export function RequestResponseCodeBlock({
  response,
  currentTheme,
}: {
  /** Any json serializable object */
  response: unknown;
  currentTheme: ThemeEnum;
}): JSX.Element | null {
  if (!response) return null;
  return (
    <div className="mt-5 overflow-scroll rounded-lg p-4 border border-gray-300 dark:border-gray-800">
      <PrettifiedJSONResponse response={response} currentTheme={currentTheme} />
    </div>
  );
}
