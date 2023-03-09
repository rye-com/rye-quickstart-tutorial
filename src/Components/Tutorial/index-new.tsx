import { useState } from 'react';

import TutorialNav from './tutorial-nav';
import TutorialContent from './tutorial-content';
import type { TutorialStep } from './types';
import { TUTORIAL_STEPS } from './constants';
<<<<<<< HEAD
import type { NonEmptyArray } from './constants';
=======
>>>>>>> 0700896 (Add start enhancher feature for external links)

export type TutorialProps = {
  compact?: boolean;
};

<<<<<<< HEAD
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
=======
export default function Index(props: TutorialProps) {
  console.log(props);
  const [currentStep, setCurrentStep] = useState<TutorialStep>(TUTORIAL_STEPS[0]);

>>>>>>> 0700896 (Add start enhancher feature for external links)
  return (
    <div className="grid grid-cols-4">
      <TutorialNav currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <TutorialContent currentStep={currentStep} />
    </div>
  );
}
