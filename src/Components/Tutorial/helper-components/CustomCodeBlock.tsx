import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ThemeEnum } from '../types';

export function CustomCodeBlock({
  codeString,
  dataTheme,
  language = 'javascript',
  showLineNumbers = false,
  startingLineNumber = 1,
  style = {},
}: {
  language?: string;
  codeString: string;
  dataTheme: ThemeEnum;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  style?: React.CSSProperties;
}) {
  const theme = dataTheme === ThemeEnum.Dark.valueOf() ? atomOneDark : atomOneLight;
  const themeOverrides: { [key: string]: React.CSSProperties } = {
    hljs: { background: 'transparent' },
  };
  return (
    <SyntaxHighlighter
      showLineNumbers={showLineNumbers}
      lineNumberStyle={{ color: 'rgb(176 171 171)' }}
      startingLineNumber={startingLineNumber}
      codeTagProps={{
        style: {
          fontSize: '0.8rem',
          ...style,
        },
      }}
      language={language}
      style={{
        ...theme,
        ...themeOverrides,
      }}
    >
      {codeString}
    </SyntaxHighlighter>
  );
}
