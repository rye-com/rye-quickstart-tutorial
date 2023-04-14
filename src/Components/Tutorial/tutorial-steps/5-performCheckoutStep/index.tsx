import { Card, Timeline } from 'flowbite-react';
import { checkoutFormCode } from '../../CodeSnippets/code_snippets';
import { StripeCheckout } from '../../primary-components/StripeCheckout';
import type {
  Store,
  ThemeEnum,
  FetchProductResponse,
  FetchProductOffersResponse,
} from '../../types';
import { CustomTimelineBody } from '../../helper-components/CustomTimelineBody';
import { CustomCodeBlock } from '../../helper-components/CustomCodeBlock';
import type { StripeProp } from '../../types/StripeProp';
import classNames from 'classnames';

export function performCheckoutStep(
  stripePromise: StripeProp,
  data: Store,
  clientSecret: string | undefined,
  currentTheme: ThemeEnum,
  fetchProductOffersResponse: FetchProductOffersResponse | null,
  fetchProductResponse: FetchProductResponse | null,
) {
  const product = fetchProductResponse?.product;
  const { url } = product?.images?.[0] || {};
  const { title, price } = product || {};

  //TODO: will need to refactor once Cart API is supported and multiple offers will need to be displayed
  const amazonOffer = fetchProductOffersResponse?.amazonOffer;
  const shopifyOffer = fetchProductOffersResponse?.shopifyOffer;
  const itemTotal = amazonOffer?.total.displayValue || shopifyOffer?.total.displayValue || '';

  return (
    <Timeline.Item>
      <Timeline.Content>
        <div className="flex">
          <Card
            className={classNames(
              'self-baseline',
              { 'max-w-xl flex-1': !data.compactView },
              { 'max-w-[50%]': data.compactView },
            )}
          >
            <Timeline.Title>Perform checkout</Timeline.Title>
            <CustomTimelineBody>
              <div className="py-1">
                Given a payment intent from the previous step, a stripe payment form will load here.
              </div>
              <div className="mb-2 py-1">
                This uses Rye's Stripe account to accept payment for the item.
              </div>
              <Timeline.Point />
              {url && price?.displayValue && itemTotal && (
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <img
                      src={url}
                      alt="product"
                      className=" rounded border border-slate-200 dark:border-rye-lime"
                    />
                  </div>
                  <section>
                    <h3 className="mb-3 font-semibold">{title}</h3>
                    <p>Subtotal: {price?.displayValue || ''}</p>
                    <p>Total (includes shipping, taxes, and fees): {itemTotal || ''}</p>
                  </section>
                </div>
              )}
              <StripeCheckout
                stripePromise={stripePromise}
                clientSecret={clientSecret}
                currentTheme={currentTheme}
              />
            </CustomTimelineBody>
          </Card>
          <div
            className={classNames(
              'mx-3 overflow-auto',
              { 'max-w-xl flex-1': !data.compactView },
              { 'max-w-[50%]': data.compactView },
            )}
          >
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
