import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export type TerminalTabProps = {
  code: string;
  label: string;
  language?: string;
  selected?: boolean;
}

const lineNumberStyle = {
  color: '#7E7F98'
}

const customStyle = {
  backgroundColor: '#222222'
};

const codeTagPropsStyle = {
  fontSize: '0.8rem',
  color: '#7E7F98',
};

export default function TerminalTab({
  code,
  label,
  language = 'javascript',
}: TerminalTabProps) {
  return (
    <SyntaxHighlighter
      data-for={label}
      showLineNumbers={true}
      language={language}
      lineNumberStyle={lineNumberStyle}
      startingLineNumber={1}
      codeTagProps={{
        style: codeTagPropsStyle
      }}
      customStyle={customStyle}
      style={{
        ...atomOneDark,
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
