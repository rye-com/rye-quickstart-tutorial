import type { TutorialStep } from '../types';

export type PropsT = {
  currentStep: TutorialStep;
};

export default function TutorialContent(props: PropsT) {
  const { currentStep } = props;
  const TutorialComponent = currentStep.component;
  return (
    <section className="col-span-3 h-full min-h-screen bg-ghost-white pl-[142px] pr-[142px] pt-[48px]">
      <h2 className="mb-[12px] text-heading-large font-bold">{currentStep.title}</h2>
      <p className="mb-[48px] text-paragraph-small">{currentStep.description}</p>
      <TutorialComponent />
    </section>
  );
}
