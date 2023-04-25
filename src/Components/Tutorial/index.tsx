import TutorialNav from './tutorial-nav';
import type { CreateCartOutput, TutorialStep } from './types';
import { StepEnum, TUTORIAL_STEPS, TutorialContext } from './constants';
import type { NonEmptyArray } from './constants';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useRequest } from './utils/fetch';
import { useDebouncedCallback } from 'use-debounce';
import {
  amazonProductFetchQuery,
  productFetchVariables,
  requestProductQuery
} from './CodeSnippets/code_snippets';
import { MarketplaceEnum } from './types';
import { ReactComponent as GettingStartedImage } from "../../assets/tutorial-intro.svg";
import { addItemToCartMutation } from "./CodeSnippets/addItemToCartSnippet";
import { getCartQuery } from "./CodeSnippets/getCartSnippet";
import { createCartMutation } from "./CodeSnippets/createCartSnippet";
import useLocalStorage from '../../hooks/useLocalStorage';

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
  const [currentApiKey, setCurrentApiKey] = useLocalStorage('apiKey', '');
  const { callback, data, loading } = useRequest(amazonProductFetchQuery);
  const debouncedApiKeyCheck = useDebouncedCallback(callback, 500);
  function setApiKey(key: string) {
    setCurrentApiKey(key);
    debouncedApiKeyCheck(key, productFetchVariables('B073K14CVB', MarketplaceEnum.Amazon));
  }

  // Fetch Product
  const [currentFetchedProductId, setCurrentFetchedProductId] = useLocalStorage('productId', '');
  const {
    callback: fetchProductCallback,
    data: fetchProductData,
    loading: fetchProductLoading,
    error: fetchProductError,
  } = useRequest<object>(
    amazonProductFetchQuery, //update query based on eventual dropdown value
  );

  // Request Product
  const [currentRequestedProductURL, setCurrentRequestedProductURL] = useState('');
  const {
    callback: requestProductCallback,
    data: requestProductData,
    loading: requestProductLoading,
    error: requestProductError,
  } = useRequest<object>(
      requestProductQuery,
  );

  // Create cart
  const [currentCreateCartID, setCurrentCreateCartID] = useState('');
  const {
    callback: createCartCallback,
    data: createCartData,
    loading: createCartLoading,
    error: createCartError,
  } = useRequest<CreateCartOutput>(createCartMutation);

  // Get cart
  const {
    callback: getCartCallback,
    data: getCartData,
    loading: getCartLoading,
    error: getCartError,
  } = useRequest<object>(getCartQuery);

  // Add item to cart
  const {
    callback: addItemToCartCallback,
    data: addItemToCartData,
    loading: addItemToCartLoading,
    error: addItemToCartError,
  } = useRequest<object>(addItemToCartMutation);

  return (
    <div className="grid grid-cols-[300px_1fr_1fr_1fr] gap-x-[48px] font-poppins">
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
          requestProduct: {
            requestProductCallback,
            requestProductData,
            requestProductLoading,
            currentRequestedProductURL,
            setCurrentRequestedProductURL,
            requestProductError: !!requestProductError,
          },
          createCart: {
            createCartCallback,
            createCartData: createCartData ?? null,
            createCartLoading,
            setCurrentCreateCartID,
            currentCreateCartID,
            createCartError: !!createCartError,
          },
          getCart: {
            getCartCallback,
            getCartData: getCartData ?? null,
            getCartLoading,
            getCartError: !!getCartError,
          },
          addItemToCart: {
            addItemToCartCallback,
            addItemToCartData: addItemToCartData ?? null,
            addItemToCartLoading,
            addItemToCartError: !!addItemToCartError,
          }
        }}
      >
        <TutorialNav currentStep={step} />
        <section className="col-span-3 col-start-2 h-full min-h-screen bg-ghost-white pl-[142px] pr-[142px] pt-5">
          { step.title === StepEnum.Step0 && <GettingStartedImage className="mt-36 mb-6" /> }
          <h2 className="mb-[12px] text-heading-large font-bold font-author text-5xl">{step.title}</h2>
          <p className="mb-[48px] paragraph-medium">{step.description}</p>
          <Outlet />
        </section>
      </TutorialContext.Provider>
    </div>
  );
}
