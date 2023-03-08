import classNames from 'classnames';
import type { Dispatch, SetStateAction } from 'react';
import { TUTORIAL_STEPS } from '../constants';
import type { TutorialStepName } from '../types';

export type TutorialProps = {
  currentStep: TutorialStepName;
  setCurrentStep: Dispatch<SetStateAction<TutorialStepName>>;
};

export default function TutorialNav(props: TutorialProps) {
  console.log(props);
  const { currentStep, setCurrentStep } = props;

  return (
    <ol className="h-100 sticky col-span-1 flex flex-col pl-[48px] pt-[40px]">
      {TUTORIAL_STEPS.map((step) => {
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
