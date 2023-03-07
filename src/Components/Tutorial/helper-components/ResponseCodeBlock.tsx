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
    <div className="mt-5 overflow-auto rounded-lg border border-gray-300 p-4 dark:border-gray-800">
      <PrettifiedJSONResponse response={response} currentTheme={currentTheme} />
    </div>
  );
}
