import { Elements as StripeElements } from '@stripe/react-stripe-js';
import { CheckoutForm } from '../../CheckoutForm';
import { ThemeEnum } from '../types';
import type { StripeProp } from '../types/StripeProp';
import { emailTo, emailToTestCheckoutHref } from './email-subject-and-body';

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
      <div>
        <div
          style={{
            // width is set to cause line breaks like so:
            //   Email dev@rye.com
            //   to test checkout
            width: '345px',
            textAlign: 'center',
            margin: 'auto',
          }}
        >
          <h1
            className="relative top-24 z-10 text-center text-3xl font-bold text-black"
            style={{
              textShadow: [
                [10, 10].map((i) => `0px 0px ${i}px rgba(255, 255, 255, 0.3)`).join(', '),
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                  .map((i) => `0px 0px ${i * 2}px rgba(245, 245, 245, 0.3)`)
                  .join(', '),
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                  .map((i) => `0px 0px ${i * 3}px rgba(235, 235, 235, 0.3)`)
                  .join(', '),
              ].join(', '),
              height: '0px',
            }}
          >
            Email
            {/* prettier-ignore */}
            <a href={emailToTestCheckoutHref} target="_blank" rel="noopener noreferrer">
              {/* Extra space slightly expands clickable area: */}
              {' '}
              {/* underline looks weird with text-shadows on h1 */}
              <span className="text-blue-500">{emailTo}</span>
              {' '}
            </a>
            to test checkout
          </h1>
        </div>
        <div className="cursor-not-allowed opacity-50">
          <div className="pointer-events-none">{StripeForm}</div>
        </div>
      </div>
    );
  }
};
