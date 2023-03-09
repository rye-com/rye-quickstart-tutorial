import { useState } from 'react';

import TutorialNav from './tutorial-nav';
import TutorialContent from './tutorial-content';
import type { TutorialStep } from './types';
import { TUTORIAL_STEPS } from './constants';
import type { NonEmptyArray } from './constants';

export type TutorialProps = {
  compact?: boolean;
};

type UrlMapType = {
  [url: string]: TutorialStep;
};

function createUrlToTutorialMap(steps: NonEmptyArray<TutorialStep>): UrlMapType {
  const urlMap: UrlMapType = {};
  steps.forEach((step) => {
    urlMap[step.url] = step;
  });
  return urlMap;
}

export default function Index(props: TutorialProps) {
  console.log(props, window.location);
  const urlMap = createUrlToTutorialMap(TUTORIAL_STEPS);
  const step = urlMap[window.location.pathname] || urlMap['/start'] || TUTORIAL_STEPS[0];
  const [currentStep, setCurrentStep] = useState<TutorialStep>(step);
  return (
    <div className="grid grid-cols-4">
      <TutorialNav currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <TutorialContent currentStep={currentStep} />
    </div>
  );
}
