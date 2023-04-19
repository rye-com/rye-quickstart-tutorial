import type { CreateCartOutput, TutorialStep } from './types';
import { createContext } from 'react';
import type { Variables } from 'graphql-request';
import { MarketplaceEnum } from  "./types";

export type NonEmptyArray<T> = [T, ...T[]];

export const enum StepEnum {
  Step0 = 'Getting started',
  Step1 = 'Obtaining Rye API key',
  Step2 = 'Fetch product data',
  Step3 = 'Add product to Rye',
  Step4 = 'Manage a cart',
  Step5 = 'Perform checkout',
  Step6 = 'Display transaction results',
}

export const TUTORIAL_STEPS: NonEmptyArray<TutorialStep> = [
  { title: StepEnum.Step0,
    description: 'Greetings! In this tutorial, we will guide you through how to create a simple product checkout flow using rye. You will receive an outline of the necessary steps to establish a store that features products from Amazon and Shopify.',
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
  {
    title: StepEnum.Step3,
    description: 'Some products on Amazon and Shopify may not be logged in the Rye inventory. You can use this function to add an external product. This step is optional but can be useful if you want to track inventory and orders within Rye.',
    url: '/add-product'
  },
  {
    title: StepEnum.Step4,
    description: 'Using Rye API, our customers can create and manage their carts with ease. They can add multiple products from multiple different stores, all in one cart. This step demonstrates how we can create a cart, add or remove products to it, and finally get the cart details.',
    url: '/manage-a-cart'
  },
  {
    title: StepEnum.Step5,
    description: 'Checkout your cart! This step walks you through the process of how a user can submit their cart for checkout by including the buyer identity details, payment information, and shipping details.',
    url: '/perform-checkout' },
  {
    title: StepEnum.Step6,
    description: 'Displaying transaction results to users after a purchase is important because it confirms the purchase, provides transparency, prevents confusion, and reduces disputes, which leads to a better user experience and fewer problems for both the user and the business.',
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
  requestProduct: {
    requestProductCallback?: (key: string, variables: Variables) => void;
    requestProductData?: object | null;
    requestProductLoading?: boolean;
    setCurrentRequestedProductURL?: (key: string) => void;
    currentRequestedProductURL?: string;
    requestProductError?: boolean;
  };
  createCart: {
    createCartCallback?: (key: string, variables: Variables) => void;
    createCartData?: CreateCartOutput | null;
    createCartLoading?: boolean;
    setCurrentCreateCartID?: (key: string) => void;
    currentCreateCartID?: string;
    createCartError?: boolean;
  };
  getCart: {
    getCartCallback?: (key: string, variables: Variables) => void;
    getCartData?: object | null;
    getCartLoading?: boolean;
    getCartError?: boolean;
  };
  addItemToCart: {
    addItemToCartCallback?: (key: string, variables: Variables) => void;
    addItemToCartData?: object | null;
    addItemToCartLoading?: boolean;
    addItemToCartError?: boolean;
  }
};

const sampleProductId = "44346795295022";

export const addItemToCartTestData = {
  productId: sampleProductId,
  marketplace: MarketplaceEnum.Shopify,
}

export const TutorialContext = createContext<TutorialContextType>({
  apiKey: {},
  fetchProduct: {},
  requestProduct: {},
  createCart: {},
  getCart: {},
  addItemToCart: {}
});

export const CheckoutFormConstants = {
  productId: sampleProductId,
  emailId: "johndoe@example.com",
  firstName: "John",
  lastName: "Doe",
  streetAddress: "123 Main St",
  city: "New York",
  zipCode: "12345",
  state: "NY",
  phone: "(123) 123-1234",
}

export const SubmitCartSampleRequestId = '724041230-gh12-5587-2182';
