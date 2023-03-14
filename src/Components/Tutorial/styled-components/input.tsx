import { useState } from 'react';
import classNames from 'classnames';
import type { ComponentProps } from 'react';

type Props = {
  startEnhancer?: React.FC<ComponentProps<'svg'>>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

//TODO(RYE-1994): implement accessibility props
export default function Input(props: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const { startEnhancer: StartEnhancer, onChange, placeholder } = props;
  return (
    <div
      className={classNames(
        'flex w-full overflow-hidden rounded-2xl border-2 border-solid bg-white text-paragraph-medium font-normal',
        {
          'border-action-light-grey': !isFocused,
          'border-black': isFocused,
          'pl-[12px]': !!StartEnhancer,
        },
      )}
    >
      {StartEnhancer ? (
        <div className="flex items-center justify-center">
          <StartEnhancer className="h-[18px] w-[18px]" />
        </div>
      ) : null}

      <input
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full max-w-full pl-[10px] pr-[10px] pt-[8px] pb-[8px] focus:outline-none"
      />
    </div>
  );
}
