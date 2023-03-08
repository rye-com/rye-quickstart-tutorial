import { useState } from 'react';

import TutorialNav from './tutorial-nav';
import type { TutorialStepName } from './types';
import { TUTORIAL_STEPS } from './constants';

export type TutorialProps = {
  compact?: boolean;
};

export default function Index(props: TutorialProps) {
  console.log(props);

  const [currentStep, setCurrentStep] = useState<TutorialStepName>(TUTORIAL_STEPS[0]);

  return (
    <div className="grid grid-cols-4">
      <TutorialNav currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <div className="col-span-3"></div>
    </div>
  );
}
