import { useState } from 'react';
import classNames from 'classnames';
import type { Dispatch, SetStateAction } from 'react';

export type TutorialProps = {
  currentStep: string;
  setCurrentStep: Dispatch<SetStateAction<string>>;
};

export default function TutorialNav(props: TutorialProps) {
  console.log(props);
  const dummySteps = [
    'Getting started',
    'Obtaining Rye API key',
    'Fetch product data',
    'Add product to Rye',
    'Add product to a user’s cart',
    'Fetch a user’s cart',
    'Display cart to user',
    'Update buyer info',
    'Show payment form',
    'Display transaction results',
  ];

  const [currentStep, setCurrentStep] = useState<string>('Getting started');

  return (
    <ol className="h-100 sticky col-span-1 flex flex-col pl-[48px] pt-[40px]">
      {dummySteps.map((step) => {
        return (
          <li>
            <button
              className={classNames(
                'w-full rounded-xl pt-[16px] pb-[16px] pl-[24px] text-left text-lg font-semibold',
                { 'bg-choice-active': currentStep === step },
                { 'hover:bg-choice-hover': currentStep !== step },
              )}
              type="button"
              onClick={() => {
                setCurrentStep(step);
              }}
            >
              {step}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
