// import { useState } from 'react';
import classNames from 'classnames';
import type { ComponentProps } from 'react';

type Props = {
  startEnhancer?: React.FC<ComponentProps<'svg'>>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string | undefined;
  internalLabel?: string | undefined;
};

//TODO(RYE-1994): implement accessibility props
export default function Input(props: Props) {
  const { startEnhancer: StartEnhancer, onChange, placeholder, value, internalLabel } = props;
  return (
    <div
      className={classNames(
        'group flex w-full flex-col overflow-hidden rounded-2xl border-2 border-solid bg-white text-paragraph-medium font-normal focus-within:border-black',
        {
          'pl-[12px]': !!StartEnhancer,
        },
      )}
    >
      {internalLabel && (
        <p className="pl-[10px] pt-[4px] text-paragraph-xsmall text-neutral-content-grey">
          {internalLabel}
        </p>
      )}
      <div className="flex w-full">
        {StartEnhancer ? (
          <div className="flex items-center justify-center">
            <StartEnhancer className="h-[18px] w-[18px]" />
          </div>
        ) : null}

        <input
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          className={classNames(
            'w-full max-w-full pl-[10px] pr-[10px] pb-[8px] focus:outline-none',
            { 'pt-[8px]': !internalLabel },
          )}
        />
      </div>
    </div>
  );
}
