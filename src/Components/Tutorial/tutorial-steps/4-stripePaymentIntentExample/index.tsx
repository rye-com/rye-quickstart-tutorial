import { SelectStateOptions } from '../../helper-components/SelectStateOptions';
import { Button, Card, Label, Select, Spinner, TextInput, Timeline } from 'flowbite-react';
import type { Store, FetchPaymentIntentResponse } from '../../types';
import type { ThemeEnum } from '../../types';
import { CustomTimelineBody } from '../../helper-components/CustomTimelineBody';
import { CustomCodeBlock } from '../../helper-components/CustomCodeBlock';
import { RequestResponseCodeBlock } from '../../helper-components/ResponseCodeBlock';
import classNames from 'classnames';

export function stripePaymentIntentExample(
  marketPlaceSelector: <T, V>(shopifyVar: T, amazonVar: V) => T | V,
  shopifyOfferFields: () => JSX.Element,
  amazonOfferFields: () => JSX.Element,
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  data: Store,
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onAddressOneChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onAddressTwoChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onStateCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  fetchPaymentIntent: () => void,
  isFetchingProduct: boolean,
  isFetchingPaymentIntent: boolean,
  fetchPaymentIntentResponse: FetchPaymentIntentResponse | null,
  currentTheme: ThemeEnum,
  paymentIntentSnippetLineNumber: number,
  paymentIntentSnippet: string,
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
            <Timeline.Title>Fetch payment intent to perform Stripe checkout</Timeline.Title>
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
                    <Label htmlFor="first_name" value="First Name" />
                    <TextInput
                      className="mt-3"
                      id="first_name"
                      onChange={onFirstNameChange}
                      value={data.address.firstName}
                      placeholder="Will"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <Label htmlFor="last_name" value="Last Name" />
                    <TextInput
                      className="mt-3"
                      id="last_name"
                      onChange={onLastNameChange}
                      value={data.address.lastName}
                      placeholder="Smith"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <Label htmlFor="address_one" value="Address Line 1" />
                  <TextInput
                    className="mt-3 w-full"
                    id="address_one"
                    onChange={onAddressOneChange}
                    value={data.address.address1}
                    placeholder="Bel Air Mansion"
                  />
                </div>
                <div className="flex">
                  <div className="mt-3 flex-1">
                    <Label htmlFor="address_two" value="Address Line 2" />
                    <TextInput
                      className="mt-3"
                      id="address_two"
                      onChange={onAddressTwoChange}
                      value={data.address.address2}
                      placeholder="Apt 212"
                    />
                  </div>
                  <div className="ml-3 mt-3 flex-1">
                    <Label htmlFor="zip_code" value="Zip Code" />
                    <TextInput
                      type="text"
                      className="mt-3"
                      id="zip_code"
                      onChange={onZipCodeChange}
                      value={data.address.zipCode}
                      placeholder="94103"
                    />
                  </div>
                </div>
                <div className="mt-3 flex">
                  <div className="flex-1">
                    <Label htmlFor="email" value="Email" />
                    <TextInput
                      type="email"
                      className="mt-3"
                      id="email"
                      onChange={onEmailChange}
                      value={data.address.email}
                      placeholder="jane-smith@email.com"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <Label htmlFor="phone" value="Phone" />
                    <TextInput
                      type="tel"
                      className="mt-3"
                      id="phone"
                      onChange={onPhoneChange}
                      value={data.address.phone}
                      placeholder="123-456-7890"
                    />
                  </div>
                </div>
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
                        onClick={fetchPaymentIntent}
                        className="mx-3 self-end"
                        disabled={isFetchingProduct}
                      >
                        {!isFetchingPaymentIntent ? 'Fetch' : <Spinner style={{ maxHeight: 30 }} />}
                      </Button>
                    </div>
                  </div>
                </div>
                <RequestResponseCodeBlock
                  response={fetchPaymentIntentResponse}
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
              startingLineNumber={paymentIntentSnippetLineNumber}
              codeString={paymentIntentSnippet}
            ></CustomCodeBlock>
          </div>
        </div>
      </Timeline.Content>
    </Timeline.Item>
  );
}
