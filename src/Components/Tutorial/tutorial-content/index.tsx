import type { TutorialStep } from '../types';
import { StepEnum } from '../constants';
import GettingStarted from './getting-started';

export type PropsT = {
  currentStep: TutorialStep;
};

export default function TutorialContent(props: PropsT) {
  const { currentStep } = props;
  return (
    <section className="col-span-3 h-full min-h-screen bg-ghost-white pl-[142px] pr-[142px] pt-[48px]">
      <h2 className="mb-[12px] text-heading-large font-bold">{currentStep.title}</h2>
      <p className="mb-[48px] text-paragraph-small">{currentStep.description}</p>
      {
        {
          [StepEnum.Step0]: null,
          [StepEnum.Step1]: <GettingStarted />,
          [StepEnum.Step2]: null,
          [StepEnum.Step3]: null,
          [StepEnum.Step4]: null,
          [StepEnum.Step5]: null,
          [StepEnum.Step6]: null,
          [StepEnum.Step7]: null,
          [StepEnum.Step8]: null,
          [StepEnum.Step9]: null,
        }[currentStep.title]
      }
    </section>
  );
}
