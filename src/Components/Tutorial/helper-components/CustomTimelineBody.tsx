import type { ReactNode } from 'react';

export function CustomTimelineBody(props: { children: ReactNode }) {
  return <div className="text-slate-600 dark:text-slate-200">{props.children}</div>;
}
