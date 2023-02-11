import { SelectStateOptions } from '../../helper-components/SelectStateOptions';
import { Button, Card, Label, Select, Spinner, TextInput, Timeline } from 'flowbite-react';
import type { Store } from '../../types';
import type { ThemeEnum } from '../../types';
import { CustomTimelineBody } from '../../helper-components/CustomTimelineBody';
import { CustomCodeBlock } from '../../helper-components/CustomCodeBlock';
import { RequestResponseCodeBlock } from '../../helper-components/ResponseCodeBlock';
import classNames from 'classnames';

export function fetchOffers(
  marketPlaceSelector: <T, V>(shopifyVar: T, amazonVar: V) => T | V,
  shopifyOfferFields: () => JSX.Element,
  amazonOfferFields: () => JSX.Element,
  onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  data: Store,
  onStateCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  fetchProductOffers: () => void,
  isFetchingProduct: boolean,
  isFetchingProductOffers: boolean,
  fetchProductOffersResponse: unknown,
  currentTheme: ThemeEnum,
  productOfferSnippetLineNumber: number,
  productOfferSnippet: string,
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
            <Timeline.Title>Fetch offers on the item from the Rye API</Timeline.Title>
            <CustomTimelineBody>
              <Timeline.Point />
              <div className="py-1">
                You can use the offers query to display a sample checkout for the item. This is
                useful for showing estimated taxes, and any shipping costs
              </div>
            </CustomTimelineBody>
            <CustomTimelineBody>
              <Timeline.Point />
              <div>
                {marketPlaceSelector(shopifyOfferFields(), amazonOfferFields())}
                <div className="mt-3 flex">
                  <div className="flex-1">
                    <Label htmlFor="city" value="City" />
                    <TextInput
                      className="mt-3"
                      id="city"
                      onChange={onCityChange}
                      value={data.address.city}
                      placeholder="San Francisco"
                    ></TextInput>
                  </div>
                  <div className="flex flex-1">
                    <div className="ml-3 flex-1">
                      <Label className="mt-3" htmlFor="product_id_offers" value="State" />
                      <Select
                        onChange={onStateCodeChange}
                        value={data.address.stateCode}
                        className="mt-3"
                      >
                        {SelectStateOptions}
                      </Select>
                    </div>
                    <div className="flex flex-1">
                      <Button
                        style={{
                          width: 150,
                          height: 40,
                          maxHeight: 40,
                          marginRight: 0,
                          marginLeft: 10,
                        }}
                        onClick={fetchProductOffers}
                        className="mx-3 self-end"
                        disabled={isFetchingProduct}
                      >
                        {!isFetchingProductOffers ? 'Fetch' : <Spinner style={{ maxHeight: 30 }} />}
                      </Button>
                    </div>
                  </div>
                </div>
                <RequestResponseCodeBlock
                  response={fetchProductOffersResponse}
                  currentTheme={currentTheme}
                />
              </div>
            </CustomTimelineBody>
          </Card>
          <div
            className={classNames(
              'mx-3 overflow-scroll',
              { 'max-w-xl flex-1': !data.compactView },
              { 'max-w-[50%]': data.compactView },
            )}
          >
            <CustomCodeBlock
              showLineNumbers={true}
              currentTheme={currentTheme}
              startingLineNumber={productOfferSnippetLineNumber}
              codeString={productOfferSnippet}
            ></CustomCodeBlock>
          </div>
        </div>
      </Timeline.Content>
    </Timeline.Item>
  );
}
