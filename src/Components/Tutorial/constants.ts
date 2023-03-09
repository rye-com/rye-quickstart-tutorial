import GettingStarted from './tutorial-content/getting-started';
import type { TutorialStep } from './types';

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
  { title: StepEnum.Step0, description: 'test', url: '/start', component: GettingStarted },
  {
    title: StepEnum.Step1,
    description: 'To make requests to the Rye GraphQL API, you will need to get an API access key',
    url: '/get-key',
    component: GettingStarted,
  },
  { title: StepEnum.Step2, description: 'test', url: '/product-data', component: GettingStarted },
  { title: StepEnum.Step3, description: 'test', url: '/add-product', component: GettingStarted },
  { title: StepEnum.Step4, description: 'test', url: '/add-to-cart', component: GettingStarted },
  { title: StepEnum.Step5, description: 'test', url: '/fetch-cart', component: GettingStarted },
  { title: StepEnum.Step6, description: 'test', url: '/display-cart', component: GettingStarted },
  { title: StepEnum.Step7, description: 'test', url: '/update-info', component: GettingStarted },
  { title: StepEnum.Step8, description: 'test', url: '/payment-form', component: GettingStarted },
  {
    title: StepEnum.Step9,
    description: 'test',
    url: '/display-transaction',
    component: GettingStarted,
  },
];
