import TutorialNav from './tutorial-nav';
import type { TutorialStep } from './types';
import { TUTORIAL_STEPS, TutorialContext } from './constants';
import type { NonEmptyArray } from './constants';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

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

const urlMap = createUrlToTutorialMap(TUTORIAL_STEPS);

export default function Index() {
  const location = useLocation();
  const step = urlMap[location.pathname] || urlMap['/start'] || TUTORIAL_STEPS[0];
  function setApiKey(key: any) {
    console.log('key: ', key);
  }

  return (
    <div className="grid grid-cols-4">
      <TutorialContext.Provider value={{ setApiKey }}>
        <TutorialNav currentStep={step} />
        <section className="col-span-3 h-full min-h-screen bg-ghost-white pl-[142px] pr-[142px] pt-[48px]">
          <h2 className="mb-[12px] text-heading-large font-bold">{step.title}</h2>
          <p className="mb-[48px] text-paragraph-small">{step.description}</p>
          <Outlet />
        </section>
      </TutorialContext.Provider>
    </div>
  );
}
