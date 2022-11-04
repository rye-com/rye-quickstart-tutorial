import type { ThemeEnum } from '../types';
import { CustomCodeBlock } from './CustomCodeBlock';

export const PrettifiedJSONResponse = ({
  response,
  currentTheme,
}: {
  response: object;
  currentTheme: ThemeEnum;
}): JSX.Element => {
  const prettyJSON = JSON.stringify(response, null, 2);
  return (
    <CustomCodeBlock
      showLineNumbers={false}
      currentTheme={currentTheme}
      codeString={prettyJSON}
      language="json"
    ></CustomCodeBlock>
  );
};
