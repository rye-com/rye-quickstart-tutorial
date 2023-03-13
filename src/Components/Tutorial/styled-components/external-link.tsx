import { LinkType } from '../constants';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';

type Props = {
  href: string;
  text: string;
  type: LinkType;
  startEnhancer?: React.FC<ComponentProps<'svg'>>;
};

export default function ExternalLink(props: Props) {
  const { href, text, type, startEnhancer: StartEnhancer } = props;
  const linkClass = useMemo(
    () => ({
      [LinkType.Pill]: 'rounded-2xl bg-brand-green pr-[12px] pl-[12px] pt-[8px] pb-[8px]',
    }),
    [],
  );
  return (
    <a target="_blank" className={linkClass[type]} href={href} rel="noreferrer">
      {StartEnhancer ? <StartEnhancer className="mb-[4px] mr-[4px] inline h-4 w-4" /> : null}
      {text}
    </a>
  );
}
