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

  const StripeForm = (
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

  const params = new URLSearchParams(window.location.search);

  if (params.get('enableCheckout') === '1') {
    return StripeForm;
  } else {
    return (
      <div
        style={{
          pointerEvents: 'none',
          cursor: 'not-allowed',
          opacity: 0.5,
          backgroundColor: 'black',
        }}
      >
        <h2 className="text-1xl my-2">Email support@rye.com to test checkout</h2>
        {StripeForm}
      </div>
    );
  }
};
