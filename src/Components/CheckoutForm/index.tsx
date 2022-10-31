import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { Button, Spinner } from 'flowbite-react';
import { FormEvent, useState } from 'react';

export const CheckoutForm = () => {
  const [paymentError, setPaymentError] = useState<string | undefined>();
  const [paymentSucceeded, setPaymentSucceeded] = useState<boolean>(false)
  const [paymentInProgress, setPaymentInProgress] = useState<boolean>(false)
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setPaymentInProgress(true);
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      setPaymentError(result.error.message);
    } else {
      setPaymentSucceeded(true);
    }
    setPaymentInProgress(false);
  };

  if(paymentSucceeded) {
    return <span className='text-lg'>Payment succeeded</span>
  }

  if(paymentError) {
    return (
      <div>
        <div className='text-lg'>Payment failed</div>
        <div>{paymentError}</div>
      </div>
    )
  }


  return (
    <form className='mt-3 flex flex-col' onSubmit={handleSubmit}>
      <PaymentElement/>
      <Button className="mt-3 px-3 self-center" disabled={!stripe || paymentInProgress}>
        {paymentInProgress ? <Spinner/ > : null}
        {paymentInProgress ? <span className='mx-3'>Paying...</span> : <span>Pay</span>}
      </Button>
    </form>
  )
};
