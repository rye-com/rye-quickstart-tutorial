import { Card, Timeline } from 'flowbite-react';
import { checkoutFormCode } from '../../code_snippets';
import { StripeCheckout } from '../../primary-components/StripeCheckout';
import type { ThemeEnum } from '../../types';
import { CustomTimelineBody } from '../../helper-components/CustomTimelineBody';
import { CustomCodeBlock } from '../../helper-components/CustomCodeBlock';
import type { StripeProp } from '../../types/StripeProp';

export function performCheckoutStep(
  stripePromise: StripeProp,
  clientSecret: string | undefined,
  currentTheme: ThemeEnum,
) {
  return (
    <Timeline.Item>
      <Timeline.Content>
        <div className="flex">
          <Card className="max-w-xl self-baseline flex-1">
            <Timeline.Title>Perform checkout</Timeline.Title>
            <CustomTimelineBody>
              <div className="py-1">
                Given a payment intent from the previous step, a stripe payment form will load here.
              </div>
              <div className="py-1">
                This uses Rye's Stripe account to accept payment for the item.
              </div>
              <Timeline.Point />
              <StripeCheckout
                stripePromise={stripePromise}
                clientSecret={clientSecret}
                currentTheme={currentTheme}
              />
            </CustomTimelineBody>
          </Card>
          <div className="mx-3 max-w-2xl overflow-scroll flex-1">
            <CustomCodeBlock
              showLineNumbers={true}
              currentTheme={currentTheme}
              startingLineNumber={1}
              codeString={checkoutFormCode}
            ></CustomCodeBlock>
          </div>
        </div>
      </Timeline.Content>
    </Timeline.Item>
  );
}
