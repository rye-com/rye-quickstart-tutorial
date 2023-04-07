import type { TutorialStep } from './types';
import { createContext } from 'react';
import type { Variables } from 'graphql-request';

export type NonEmptyArray<T> = [T, ...T[]];

export const enum StepEnum {
  Step0 = 'Getting started',
  Step1 = 'Obtaining Rye API key',
  Step2 = 'Fetch product data',
  Step3 = 'Add product to Rye',
  Step4 = 'Add product to a user’s cart',
  Step5 = 'Fetch a user’s cart',
  Step6 = 'Display cart to user',
  Step7 = 'Update buyer info',
  Step8 = 'Show payment form',
  Step9 = 'Display transaction results',
}

export const TUTORIAL_STEPS: NonEmptyArray<TutorialStep> = [
  { title: StepEnum.Step0,
    description: 'Greetings! In this tutorial, we will guide you through how to create a simple product checkout flow using rye. You will receive an outline of the necessary steps to establish a store that features products from Amazon and Shopify.\n',
    url: '/start' },
  {
    title: StepEnum.Step1,
    description: 'To make requests to the Rye GraphQL API, you will need to get an API access key',
    url: '/get-key',
  },
  {
    title: StepEnum.Step2,
    description:
      'Fetch product data in realtime with Rye’s API. This allows you to showcase products and display accurate, up-to-date information, and users to make informed purchasing decisions.',
    url: '/product-data',
  },
  { title: StepEnum.Step3, description: 'test', url: '/add-product' },
  { title: StepEnum.Step4, description: 'test', url: '/add-to-cart' },
  { title: StepEnum.Step5, description: 'test', url: '/fetch-cart' },
  { title: StepEnum.Step6, description: 'test', url: '/display-cart' },
  { title: StepEnum.Step7, description: 'test', url: '/update-info' },
  { title: StepEnum.Step8, description: 'test', url: '/payment-form' },
  {
    title: StepEnum.Step9,
    description: 'test',
    url: '/display-transaction',
  },
];

export const enum LinkType {
  Pill = 'pill',
}

type TutorialContextType = {
  apiKey: {
    setApiKey?: (key: string) => void;
    currentApiKey?: string;
    apiKeyCheckIsLoading?: boolean;
    isApiKeyValid?: boolean;
  };
  fetchProduct: {
    fetchProductCallback?: (key: string, variables: Variables) => void;
    fetchProductData?: object | null;
    fetchProductLoading?: boolean;
    setCurrentFetchedProductId?: (key: string) => void;
    currentFetchedProductId?: string;
    fetchProductError?: boolean;
  };
};

export const TutorialContext = createContext<TutorialContextType>({ apiKey: {}, fetchProduct: {} });
