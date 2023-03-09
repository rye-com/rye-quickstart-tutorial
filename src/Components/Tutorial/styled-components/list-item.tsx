import type { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  content?: string;
  styleOverrides?: {
    list?: string;
    paragraph?: string;
  };
};

export default function ListItem({ children, content, styleOverrides }: Props) {
  const { list, paragraph } = styleOverrides || {};
  const listStyles = list ?? 'mb-[28px]';
  const paragraphStyles = paragraph ?? 'mb-[12px] inline';

  return (
    <li className={listStyles}>
      <p className={paragraphStyles}>{content}</p>
      {children}
    </li>
  );
}
