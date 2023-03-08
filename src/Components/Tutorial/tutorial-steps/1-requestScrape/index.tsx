import { Button, Card, Label, Spinner, Tabs, TextInput, Timeline } from 'flowbite-react';
import { LinkIcon } from '@heroicons/react/24/solid';
import type { Store } from '../../types';
import { MarketplaceEnum } from '../../types';
import type { ThemeEnum } from '../../types';
import { CustomTimelineBody } from '../../helper-components/CustomTimelineBody';
import { CustomCodeBlock } from '../../helper-components/CustomCodeBlock';
import { RequestResponseCodeBlock } from '../../helper-components/ResponseCodeBlock';
import { linkClasses } from '../../../../utils/linkClasses';
import classNames from 'classnames';

export function requestScrape(
  onMarketplaceChange: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  data: Store,
  marketPlaceSelector: <T, V>(shopifyVar: T, amazonVar: V) => T | V,
  onProductURLChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  requestProduct: () => void,
  isRequestingProduct: boolean,
  requestProductResponse: unknown,
  currentTheme: ThemeEnum,
  requestedProductSnippetLineNumber: number,
  requestedProductSnippet: string,
) {
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
            <Timeline.Title>
              <Timeline.Point />
              Add external product to Rye inventory
            </Timeline.Title>
            <CustomTimelineBody>
              <div className="py-1">
                Adding product data to inventory may take a few seconds, but the product id will be
                returned immediately.
              </div>
              <div className="py-1">
                You can then use this product id to fetch product data in the next step.
              </div>
              <div className="py-1">
                You can also do this via the
                <a href="https://console.rye.com/requests" className={linkClasses}>
                  {' '}
                  Rye Console
                </a>
              </div>
            </CustomTimelineBody>
            <CustomTimelineBody>
              <Timeline.Point />
              <Tabs.Group
                aria-label="Full width tabs"
                // eslint-disable-next-line react/style-prop-object
                style="underline"
                onClick={onMarketplaceChange}
              >
                <Tabs.Item
                  title="Amazon"
                  active={data.requestedProduct.selectedMarketplace === MarketplaceEnum.Amazon}
                >
                  <span className="py-3">
                    Navigate to{' '}
                    <a
                      target="_blank"
                      href="https://www.amazon.com"
                      className={linkClasses}
                      rel="noreferrer"
                    >
                      Amazon
                    </a>{' '}
                    and find an item you want to request, and copy the URL
                  </span>
                </Tabs.Item>
                <Tabs.Item
                  title="Shopify"
                  active={data.requestedProduct.selectedMarketplace === MarketplaceEnum.Shopify}
                >
                  <span className="py-3">
                    Navigate to any
                    <a
                      target="_blank"
                      href="https://rye-test-store.myshopify.com/"
                      className={linkClasses}
                      rel="noreferrer"
                    >
                      {' '}
                      Shopify store
                    </a>{' '}
                    and find an item you want to request, and copy the URL.
                  </span>
                </Tabs.Item>
              </Tabs.Group>
            </CustomTimelineBody>
            <CustomTimelineBody>
              <Timeline.Point />
              <div className="py-1">
                <Label htmlFor="item_url" value="Enter product URL" />
                <div className="mt-3 flex">
                  <TextInput
                    type="url"
                    value={data.requestedProduct.productURL}
                    icon={LinkIcon}
                    className="w-full"
                    id="item_url"
                    placeholder={marketPlaceSelector(
                      'https://www.some-store.shopify.com/products/cool-product',
                      'https://www.amazon.com/Neosporin-Maximum-Strength-Antibiotic-Protection-Bacitracin/dp/B000NQ10FK',
                    )}
                    onChange={onProductURLChange}
                  ></TextInput>
                  <Button
                    style={{ width: 150, height: 40, maxHeight: 40 }}
                    onClick={requestProduct}
                    className="mx-3"
                    disabled={isRequestingProduct}
                  >
                    {!isRequestingProduct ? 'Request' : <Spinner style={{ maxHeight: 30 }} />}
                  </Button>
                </div>
                <RequestResponseCodeBlock
                  response={requestProductResponse}
                  currentTheme={currentTheme}
                />
              </div>
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
              startingLineNumber={requestedProductSnippetLineNumber}
              codeString={requestedProductSnippet}
            ></CustomCodeBlock>
          </div>
        </div>
      </Timeline.Content>
    </Timeline.Item>
  );
}
