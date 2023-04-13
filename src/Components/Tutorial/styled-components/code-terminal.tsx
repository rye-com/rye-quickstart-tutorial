import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const lineNumberStyle = {
  color: '#7E7F98',
}

const customStyle = {
  backgroundColor: '#222222'
};

const codeTagPropsStyle = {
  fontSize: '0.8rem',
  color: '#7E7F98',
};

export default function Terminal({
  code,
  label,
  language = 'javascript',
}: {
  code: string;
  label: string;
  language?: string;
}) {
  return (
    <div className="mt-2 rounded-3xl bg-terminal-black px-6 py-5">
      <div className="flex gap-2 text-white">
        <button className="w-fit rounded-xl bg-white py-[4px] px-[10px] text-terminal-file-name text-black hover:text-neutral-content-grey">
          {label}
        </button>
      </div>
      <SyntaxHighlighter
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
    </div>
  );
}
