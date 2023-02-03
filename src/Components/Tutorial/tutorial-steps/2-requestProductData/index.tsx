import { Button, Card, Label, Spinner, Tabs, TextInput, Timeline } from 'flowbite-react';
import { RiBarcodeLine as BarcodeIcon } from 'react-icons/ri';
import type { Store, FetchProductResponse } from '../../types';
import type { ThemeEnum } from '../../types';
import { MarketplaceEnum } from '../../types';
import { CustomTimelineBody } from '../../helper-components/CustomTimelineBody';
import { InlineCodeSnippet } from '../../helper-components/InlineCodeSnippet';
import { CustomCodeBlock } from '../../helper-components/CustomCodeBlock';
import { RequestResponseCodeBlock } from '../../helper-components/ResponseCodeBlock';

export function requestProductData(
  onMarketplaceChange: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
  data: Store,
  selectedProductID: string | undefined,
  marketPlaceSelector: <T, V>(shopifyVar: T, amazonVar: V) => T | V,
  onProductIDChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  fetchProduct: () => void,
  isFetchingProduct: boolean,
  fetchProductResponse: FetchProductResponse | null,
  currentTheme: ThemeEnum,
  productFetchSnippetLineNumber: number,
  productFetchSnippet: string,
) {
  return (
    <Timeline.Item>
      <Timeline.Content>
        <div className="flex">
          <Card className="max-w-xl self-baseline flex-1">
            <Timeline.Title>Fetch product data from Rye inventory</Timeline.Title>
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
                  <div className="mt-3">
                    The Amazon Standard identification Number (ASIN) can be used to fetch an item
                    from Amazon. You can find the item ID for an amazon item by using the ID after{' '}
                    <InlineCodeSnippet>dp/</InlineCodeSnippet> in the URL. Example:
                  </div>
                  <span className="text-amber-700">
                    https://amazon.com/neo-sporin/dp/
                    <span className="rounded-lg bg-red-500 px-2 text-amber-300">B000NQ10FK</span>
                  </span>
                  <div className="mt-3">
                    It is also returned in the response by the{' '}
                    <InlineCodeSnippet>requestProduct</InlineCodeSnippet> mutation.
                  </div>
                </Tabs.Item>
                <Tabs.Item
                  title="Shopify"
                  active={data.requestedProduct.selectedMarketplace === MarketplaceEnum.Shopify}
                >
                  <div className="py-3">
                    The Shopify product ID can be found in the response of the{' '}
                    <InlineCodeSnippet>requestProduct</InlineCodeSnippet> mutation.
                  </div>
                </Tabs.Item>
              </Tabs.Group>
            </CustomTimelineBody>
            <CustomTimelineBody>
              <div>
                <Label htmlFor="marketplace_request" value="Marketplace" />
                <TextInput
                  disabled
                  className="my-3 w-full"
                  id="marketplace_request"
                  value={data.requestedProduct.selectedMarketplace}
                ></TextInput>
                <Timeline.Point />
                <Label htmlFor="fetch_product_id" value="Enter product ID" className="mt-10" />
                <div className="my-3 flex">
                  <TextInput
                    value={selectedProductID || ''}
                    // @ts-expect-error - TS2322 - "color props are not compatible with exactOptionalPropertyTypes: true" - shouldn't really matter, as long as js is checking for truthiness
                    icon={BarcodeIcon}
                    className="w-full"
                    id="fetch_product_id"
                    placeholder={marketPlaceSelector('2863039381604', 'B000NQ10FK')}
                    onChange={onProductIDChange}
                  ></TextInput>
                  <Button
                    style={{ width: 150, height: 40, maxHeight: 40 }}
                    onClick={fetchProduct}
                    className="mx-3"
                    disabled={isFetchingProduct}
                  >
                    {!isFetchingProduct ? 'Fetch' : <Spinner style={{ maxHeight: 30 }} />}
                  </Button>
                </div>
                <RequestResponseCodeBlock
                  response={fetchProductResponse}
                  currentTheme={currentTheme}
                />
              </div>
            </CustomTimelineBody>
          </Card>
          <div className="mx-3 max-w-xl overflow-scroll flex-1">
            <CustomCodeBlock
              showLineNumbers={true}
              startingLineNumber={productFetchSnippetLineNumber}
              currentTheme={currentTheme}
              codeString={productFetchSnippet}
            ></CustomCodeBlock>
          </div>
        </div>
      </Timeline.Content>
    </Timeline.Item>
  );
}
