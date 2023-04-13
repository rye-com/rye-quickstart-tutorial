import type { ReactNode } from 'react';

const codeSnippetClasses: { [version: string]: string } = {
  v2: 'px-[8px] text-black border border-action-light-grey rounded font-bold',
  v2redText: 'px-[2px] text-alerts-danger border border-action-light-grey rounded font-bold',
  v1: 'text-slate-500 dark:bg-neutral-700 border dark:border-neutral-500 dark:text-amber-200 px-1',
};

export function InlineCodeSnippet(props: { children: ReactNode; version?: string }): JSX.Element {
  const { version } = props;
  return (
    <span className={version ? codeSnippetClasses[version] : codeSnippetClasses['v1']}>
      {props.children}
    </span>
  );
}
