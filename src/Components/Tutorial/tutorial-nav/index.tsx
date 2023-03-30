import classNames from 'classnames';
import { TUTORIAL_STEPS } from '../constants';
import type { TutorialStep } from '../types';
import { Link } from 'react-router-dom';

export type TutorialProps = {
  currentStep: TutorialStep;
  // setCurrentStep: Dispatch<SetStateAction<TutorialStep>>;
};

export default function TutorialNav(props: TutorialProps) {
  const { currentStep } = props;

  return (
    <ol className="h-100 fixed col-span-1 flex flex-col pr-[24px] pl-[24px] pt-[40px] text-paragraph-medium font-semibold">
      {TUTORIAL_STEPS.map((step) => {
        return (
          <li
            className={classNames(
              'mb-[8px] w-full rounded-xl text-left text-lg font-semibold',
              { 'bg-choice-active': currentStep === step },
              { 'hover:bg-choice-hover': currentStep !== step },
            )}
            key={step.title}
          >
            <Link className="block pt-[16px] pb-[16px] pl-[12px] pr-[24px]" to={step.url}>
              {step.title}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
