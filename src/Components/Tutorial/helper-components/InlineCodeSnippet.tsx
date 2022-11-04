import type { ReactNode } from 'react';

export function InlineCodeSnippet(props: { children: ReactNode }): JSX.Element {
  const codeSnippetClasses =
    'text-slate-500 dark:bg-neutral-700 border dark:border-neutral-500 dark:text-amber-200 px-1';
  return <span className={codeSnippetClasses}>{props.children}</span>;
}
