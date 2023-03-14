// import { useState } from 'react';
import classNames from 'classnames';
import type { ComponentProps } from 'react';

type Props = {
  startEnhancer?: React.FC<ComponentProps<'svg'>>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string | undefined;
};

//TODO(RYE-1994): implement accessibility props
export default function Input(props: Props) {
  const { startEnhancer: StartEnhancer, onChange, placeholder, value } = props;
  return (
    <div
      className={classNames(
        'group flex w-full overflow-hidden rounded-2xl border-2 border-solid bg-white text-paragraph-medium font-normal focus-within:border-black',
        {
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
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        className="w-full max-w-full pl-[10px] pr-[10px] pt-[8px] pb-[8px] focus:outline-none"
      />
    </div>
  );
}
