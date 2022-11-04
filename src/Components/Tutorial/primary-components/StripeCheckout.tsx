import { Elements as StripeElements } from '@stripe/react-stripe-js';
import { CheckoutForm } from '../../CheckoutForm';
import { ThemeEnum } from '../types';
import type { StripeProp } from '../types/StripeProp';

export const StripeCheckout = ({
  stripePromise,
  clientSecret,
  currentTheme,
}: {
  stripePromise: StripeProp;
  clientSecret: string | undefined;
  currentTheme: ThemeEnum;
}): JSX.Element | null => {
  if (!stripePromise || !clientSecret) {
    return null;
  }

  return (
    <StripeElements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: currentTheme === ThemeEnum.Dark ? 'night' : 'flat',
        },
      }}
    >
      <CheckoutForm />
    </StripeElements>
  );
};
