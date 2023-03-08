import type { TutorialStep } from './types';

type NonEmptyArray<T> = [T, ...T[]];

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
  { title: StepEnum.Step0, description: 'test' },
  {
    title: StepEnum.Step1,
    description: 'To make requests to the Rye GraphQL API, you will need to get an API access key',
  },
  { title: StepEnum.Step2, description: 'test' },
  { title: StepEnum.Step3, description: 'test' },
  { title: StepEnum.Step4, description: 'test' },
  { title: StepEnum.Step5, description: 'test' },
  { title: StepEnum.Step6, description: 'test' },
  { title: StepEnum.Step7, description: 'test' },
  { title: StepEnum.Step8, description: 'test' },
  { title: StepEnum.Step9, description: 'test' },
];
