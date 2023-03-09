import { LinkType } from '../constants';

type Props = {
  href: string;
  text: string;
  type: LinkType;
};

export default function ExternalLink(props: Props) {
  const { href, text, type } = props;
  const linkClass = {
    [LinkType.Pill]: 'rounded-2xl bg-brand-green pr-[12px] pl-[12px] pt-[8px] pb-[8px]',
  };
  return (
    <a className={linkClass[type]} href={href}>
      {text}
    </a>
  );
}
