import TutorialNav from './tutorial-nav';
import type { TutorialStep } from './types';
import { TUTORIAL_STEPS, TutorialContext } from './constants';
import type { NonEmptyArray } from './constants';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useRequest } from './utils/fetch';
import { useDebouncedCallback } from 'use-debounce';
import { amazonProductFetchQuery, productFetchVariables } from './code_snippets';
import { MarketplaceEnum } from './types';

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

  //API key related logic
  const [currentApiKey, setCurrentApiKey] = useState(''); //will set default from localStorage
  const { callback, data, loading } = useRequest(amazonProductFetchQuery);
  const debouncedApiKeyCheck = useDebouncedCallback(callback, 500);
  function setApiKey(key: string) {
    setCurrentApiKey(key);
    debouncedApiKeyCheck(key, productFetchVariables('B073K14CVB', MarketplaceEnum.Amazon));
  }

  //Fetch Product
  const [currentFetchedProductId, setCurrentFetchedProductId] = useState(''); //will set default from localStorage

  const {
    callback: fetchProductCallback,
    data: fetchProductData,
    loading: fetchProductLoading,
    error: fetchProductError,
  } = useRequest<object>(
    amazonProductFetchQuery, //update query based on eventual dropdown value
  );
  return (
    <div className="grid grid-cols-4 gap-x-[24px]">
      <TutorialContext.Provider
        value={{
          apiKey: {
            setApiKey,
            currentApiKey,
            apiKeyCheckIsLoading: loading,
            isApiKeyValid: !!data,
          },
          fetchProduct: {
            fetchProductCallback,
            fetchProductData,
            fetchProductLoading,
            currentFetchedProductId,
            setCurrentFetchedProductId,
            fetchProductError: !!fetchProductError,
          },
        }}
      >
        <TutorialNav currentStep={step} />
        <section className="col-span-3 col-start-2 h-full min-h-screen bg-ghost-white pl-[142px] pr-[142px] pt-[48px]">
          <h2 className="mb-[12px] text-heading-large font-bold">{step.title}</h2>
          <p className="mb-[48px] text-paragraph-small">{step.description}</p>
          <Outlet />
        </section>
      </TutorialContext.Provider>
    </div>
  );
}
