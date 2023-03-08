import { useState } from 'react';

import TutorialNav from './tutorial-nav';

export type TutorialProps = {
  compact?: boolean;
};

export default function Index(props: TutorialProps) {
  console.log(props);

  const [currentStep, setCurrentStep] = useState<string>('Getting started');

  return (
    <div className="grid grid-cols-4">
      <TutorialNav currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <div className="col-span-3"></div>
    </div>
  );
}
