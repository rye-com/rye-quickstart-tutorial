import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { Flowbite, Label, Select, TextInput, Timeline } from 'flowbite-react';
import { loadStripe } from '@stripe/stripe-js/pure';
import { RiBarcodeLine as BarcodeIcon } from 'react-icons/ri';

import {
  amazonProductFetchQuery,
  amazonProductFetchSnippet,
  initializeClientSnippet,
  requestProductQuery,
  requestProductVariables,
  requestProductSnippet,
  shopifyProductFetchQuery,
  shopifyProductFetchSnippet,
  shopifyProductOfferQuery,
  shopifyProductOfferSnippet,
  shopifyProductOfferVariables,
  amazonProductOfferVariables,
  amazonProductOfferQuery,
  productFetchVariables,
  amazonProductOfferSnippet,
  shopifyPaymentIntentSnippet,
  amazonPaymentIntentSnippet,
  shopifyPaymentIntentVariables,
  amazonPaymentIntentVariables,
  shopifyPaymentIntentQuery,
  amazonPaymentIntentQuery,
} from './code_snippets';
import { cloneDeep, merge } from 'lodash';
import snakeCase from 'lodash/snakeCase';
import debounce from 'lodash/debounce';
import { GraphQLClient } from 'graphql-request';
import type { Variables } from 'graphql-request';
import type { RecursivePartial } from '../../types/utils/RecursivePartial';
import type { Address } from '../../types/api-data/Address';
import type { Store, FetchProductResponse, FetchPaymentIntentResponse } from './types';
import { ThemeEnum, MarketplaceEnum } from './types';
import { useDebouncedEffect } from '../../hooks/useDebouncedEffect';
import { getDefaultStore } from '../../localStorage-crud/getDefaultStore';
import type { StripeProp } from './types/StripeProp';
import { ryelytics } from '../../shared-analytics/getRyelytics';
import { ACTION, SOURCE } from '../../shared-analytics/constants';
import { enterApiKey } from './tutorial-steps/0-enterApiKey';
import { requestScrape } from './tutorial-steps/1-requestScrape';
import { requestProductData } from './tutorial-steps/2-requestProductData';
import { fetchOffers } from './tutorial-steps/3-fetchOffers';
import { stripePaymentIntentExample } from './tutorial-steps/4-stripePaymentIntentExample';
import { performCheckoutStep } from './tutorial-steps/5-performCheckoutStep';

const defaultStore = getDefaultStore();

export const linkClasses = 'text-indigo-500 dark:text-rye-lime';

const gqlClient = new GraphQLClient('https://graphql.api.rye.com/v1/query');

const trackAddressFieldChanges = debounce((fieldName: string, fieldValue: string) => {
  ryelytics.track({
    source: SOURCE.PAYMENT_INTENT_STEP,
    action: ACTION.UPDATE,
    noun: snakeCase(fieldName) + '_input',
    properties: {
      address: {
        [fieldName]: fieldValue,
      },
    },
  });
}, 1500);

const trackProductURLChange = debounce((productURL: string) => {
  ryelytics.track({
    source: SOURCE.REQUEST_SCRAPE_STEP,
    action: ACTION.UPDATE,
    noun: 'product_url_input',
    properties: {
      productURL,
    },
  });
}, 1500);

export default function Index() {
  const [data, setData] = useState<Store>(defaultStore);

  const [isRequestingProduct, setIsRequestingProduct] = useState<boolean>(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState<boolean>(false);
  const [isFetchingProductOffers, setIsFetchingProductOffers] = useState<boolean>(false);
  const [isFetchingPaymentIntent, setIsFetchingPaymentIntent] = useState<boolean>(false);

  const [requestProductResponse, setRequestProductResponse] = useState<unknown | null>(null);
  const [fetchProductResponse, setFetchProductResponse] = useState<FetchProductResponse | null>(
    null,
  );
  const [fetchProductOffersResponse, setFetchProductOffersResponse] = useState<unknown | null>(
    null,
  );
  const [fetchPaymentIntentResponse, setFetchPaymentIntentResponse] =
    useState<FetchPaymentIntentResponse | null>(null);

  const [isValidAPIKey, setIsValidAPIKey] = useState<boolean>(false);
  const [isCheckingAPIKey, setIsCheckingAPIKey] = useState<boolean>(false);
  const [selectedShopifyProductVariant, setSelectedShopifyProductVariant] = useState<string>('');

  const clientSecret =
    fetchPaymentIntentResponse?.createShopifyPaymentIntent?.clientSecret ||
    fetchPaymentIntentResponse?.createAmazonPaymentIntent?.clientSecret;
  const stripeAPIKey =
    fetchPaymentIntentResponse?.createShopifyPaymentIntent?.publishableAPIKey ||
    fetchPaymentIntentResponse?.createAmazonPaymentIntent?.publishableAPIKey;

  const stripePromise: StripeProp = useMemo(() => {
    if (stripeAPIKey) {
      return loadStripe(stripeAPIKey);
    } else {
      // stripeAPIKey is undefined until we get to the checkout step, and load the checkout form.
      return null;
    }
  }, [stripeAPIKey]);

  const marketPlaceSelector = <T, V>(shopifyVar: T, amazonVar: V): T | V => {
    if (data.requestedProduct.selectedMarketplace === MarketplaceEnum.Shopify) {
      return shopifyVar;
    } else {
      return amazonVar;
    }
  };

  const selectedProductID = marketPlaceSelector(
    data.requestedProduct.shopifyProductID,
    data.requestedProduct.amazonProductID,
  );

  const currentTheme = data.appTheme === ThemeEnum.Dark ? ThemeEnum.Dark : ThemeEnum.Light;

  const makeGQLRequest = (
    query: string,
    variables: Variables, // using generic TVars for this causes a weird type error with client.request call
  ) => {
    const headers = {
      Authorization: 'Basic ' + window.btoa(data.apiConfig.key + ':'),
    };
    return gqlClient.request(query, variables, headers);
  };

  const checkRyeAPIKey = () => {
    if (!data.apiConfig.key || data.apiConfig.key.length === 0) {
      setIsCheckingAPIKey(false);
      return;
    }
    setIsCheckingAPIKey(true);
    const variables = {
      input: {
        id: 'B073K14CVB',
        marketplace: 'AMAZON',
      },
    };
    // Ensure we don't get mixed up due to mutations on `data`:
    // (this also makes typescript happier)
    const apiKey = data.apiConfig.key;
    const identifyUser = (isApiKeyValid: boolean) => {
      ryelytics.identify({
        // Docs suggest to simply add traits for anonymous users: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
        // If we later get the users real uid, we can tie all the data together using that uid.
        apiKey,
      });
      ryelytics.track({
        source: SOURCE.API_KEY_STEP,
        action: ACTION.UPDATE,
        noun: 'api_key_input',
        properties: {
          isValid: isApiKeyValid,
        },
      });
    };
    makeGQLRequest(amazonProductFetchQuery, variables)
      .then((_result) => {
        identifyUser(true);
        setIsValidAPIKey(true);
      })
      .catch((_error) => {
        identifyUser(false);
        setIsValidAPIKey(false);
      })
      .finally(() => {
        setIsCheckingAPIKey(false);
      });
  };

  function updateData(dataUpdate: RecursivePartial<Store>) {
    const newData: Store = merge(cloneDeep(data), dataUpdate);
    let key: keyof Store;
    for (key in newData) {
      window.localStorage.setItem(key, JSON.stringify(newData[key]));
    }
    setData(newData);
  }

  const onChangeTheme = (checked: boolean) => {
    const theme = checked ? ThemeEnum.Dark : ThemeEnum.Light;
    ryelytics.track({
      source: SOURCE.TOP_NAV_BAR,
      action: ACTION.CLICK,
      noun: 'change_theme_button',
      properties: {
        theme,
      },
    });
    updateData({ appTheme: theme });
  };

  const requestProduct = () => {
    setIsRequestingProduct(true);
    const variables = requestProductVariables(
      data.requestedProduct.productURL,
      data.requestedProduct.selectedMarketplace.toUpperCase(),
    );
    const isShopify = data.requestedProduct.selectedMarketplace === MarketplaceEnum.Shopify;
    let productID = isShopify
      ? data.requestedProduct.shopifyProductID
      : data.requestedProduct.amazonProductID;
    let didSucceed = true;
    makeGQLRequest(requestProductQuery, variables)
      .then((res) => {
        setRequestProductResponse(res);
        const requestedProduct: Partial<Store['requestedProduct']> = {};
        if (isShopify) {
          requestedProduct['shopifyProductID'] = res['requestProductByURL'].productID;
        } else {
          requestedProduct['amazonProductID'] = res['requestProductByURL'].productID;
        }
        productID = res['requestProductByURL'].productID;
        updateData({ requestedProduct: requestedProduct });
      })
      .catch((error) => {
        // TODO: test this path
        setRequestProductResponse(error);
        didSucceed = false;
      })
      .finally(() => {
        setIsRequestingProduct(false);
        const newRequestedProduct = {
          ...variables.input,
          productID: productID ?? 'undefined',
        };
        ryelytics.track({
          source: SOURCE.REQUEST_SCRAPE_STEP,
          action: ACTION.CLICK,
          noun: 'request_scrape_button',
          params: newRequestedProduct,
          success: didSucceed,
        });
        // TODO: refactor `updateData` and do something like this?
        // if (didSucceed) setRequestedProduct(newRequestedProduct);
      });
  };

  const fetchProduct = () => {
    if (!selectedProductID) {
      return;
    }
    setIsFetchingProduct(true);
    const variables = productFetchVariables(
      selectedProductID,
      data.requestedProduct.selectedMarketplace.toUpperCase(),
    );
    let didSucceed = true;
    makeGQLRequest(
      marketPlaceSelector(shopifyProductFetchQuery, amazonProductFetchQuery),
      variables,
    )
      .then((res) => {
        setFetchProductResponse(res);
        if (res['product']?.variants && res['product'].variants.length > 0) {
          setSelectedShopifyProductVariant(res['product'].variants[0].id);
        }
      })
      .catch((error) => {
        setFetchProductResponse(error);
        didSucceed = false;
      })
      .finally(() => {
        setIsFetchingProduct(false);
        ryelytics.track({
          source: SOURCE.FETCH_PRODUCT_DATA_STEP,
          action: ACTION.CLICK,
          noun: 'fetch_product_data_button',
          params: variables.input,
          success: didSucceed,
        });
      });
  };

  const fetchProductOffers = () => {
    if (!selectedProductID) {
      return;
    }
    setIsFetchingProductOffers(true);
    // Add more field validation here to skip request on validation failures
    //
    const variables = marketPlaceSelector(
      shopifyProductOfferVariables(selectedShopifyProductVariant, {
        city: data.address.city,
        stateCode: data.address.stateCode,
      }),
      amazonProductOfferVariables(
        { city: data.address.city, stateCode: data.address.stateCode },
        selectedProductID,
      ),
    );
    let didSucceed = true;
    makeGQLRequest(
      marketPlaceSelector(shopifyProductOfferQuery, amazonProductOfferQuery),
      variables,
    )
      .then((res) => {
        setFetchProductOffersResponse(res);
      })
      .catch((error) => {
        setFetchProductOffersResponse(error);
        didSucceed = false;
      })
      .finally(() => {
        setIsFetchingProductOffers(false);
        ryelytics.track({
          source: SOURCE.FETCH_OFFERS_STEP,
          action: ACTION.CLICK,
          noun: 'fetch_offers_button',
          params: variables.input,
          success: didSucceed,
        });
      });
  };

  const fetchPaymentIntent = () => {
    if (!data.requestedProduct.amazonProductID && !selectedShopifyProductVariant) {
      console.log('No product ID'); // TODO: show error message
      return;
    }
    setIsFetchingPaymentIntent(true);
    // Add more field validation here to skip request on validation failures
    //

    // TODO: make this more robust.
    if (!data.requestedProduct.amazonProductID) {
      console.error(
        'data.requestedProduct.amazonProductID is falsy. data: ' + JSON.stringify(data, null, 2),
      );
      // https://rye-api.slack.com/archives/C02BGLWLJNN/p1667705168776799?thread_ts=1667705166.009999&cid=C02BGLWLJNN
      data.requestedProduct.amazonProductID = '';
    }

    const variables = marketPlaceSelector(
      shopifyPaymentIntentVariables(
        selectedShopifyProductVariant, // This accounts for product id (I think)
        {
          firstName: data.address.firstName,
          lastName: data.address.lastName,
          address1: data.address.address1,
          address2: data.address.address2,
          phone: data.address.phone,
          email: data.address.email,
          city: data.address.city,
          stateCode: data.address.stateCode,
          zipCode: data.address.zipCode,
        },
        '',
      ),
      amazonPaymentIntentVariables(data.requestedProduct.amazonProductID, {
        firstName: data.address.firstName,
        lastName: data.address.lastName,
        address1: data.address.address1,
        address2: data.address.address2,
        phone: data.address.phone,
        email: data.address.email,
        city: data.address.city,
        stateCode: data.address.stateCode,
        zipCode: data.address.zipCode,
      }),
    );
    let didSucceed = true;
    makeGQLRequest(
      marketPlaceSelector(shopifyPaymentIntentQuery, amazonPaymentIntentQuery),
      variables,
    )
      .then((res) => {
        // TODO: use this to cleanup FetchPaymentIntentResponse type def
        // console.log('fetchPaymentIntentResponse', res);
        setFetchPaymentIntentResponse(res);
      })
      .catch((error) => {
        setFetchPaymentIntentResponse(error);
        didSucceed = false;
      })
      .finally(() => {
        ryelytics.track({
          source: SOURCE.PAYMENT_INTENT_STEP,
          action: ACTION.CLICK,
          noun: 'fetch_payment_intent_button',
          // TODO: remove any, improve `undefined` handling in `RyelyticsProperties` type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          params: { ...variables.input } as Record<string, any>,
          success: didSucceed,
        });
        setIsFetchingPaymentIntent(false);
      });
  };

  const onAPIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.currentTarget.value;
    if (key !== data.apiConfig.key) {
      updateData({ apiConfig: { key } });
    }
  };

  const onAddressFieldChangeFn =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const fieldValue = e.target.value;
      const data = { address: { [field]: fieldValue } };
      trackAddressFieldChanges(field, fieldValue);
      updateData(data);
    };

  const onCityChange = onAddressFieldChangeFn('city');
  const onStateCodeChange = onAddressFieldChangeFn('stateCode');
  const onFirstNameChange = onAddressFieldChangeFn('firstName');
  const onLastNameChange = onAddressFieldChangeFn('lastName');
  const onAddressOneChange = onAddressFieldChangeFn('address1');
  const onAddressTwoChange = onAddressFieldChangeFn('address2');
  const onZipCodeChange = onAddressFieldChangeFn('zipCode');
  const onPhoneChange = onAddressFieldChangeFn('phone');
  const onEmailChange = onAddressFieldChangeFn('email');

  const onProductURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const productURL = e.target.value;
    trackProductURLChange(productURL);

    // Maybe we should debounce this whole event handler?
    updateData({ requestedProduct: { productURL } });
  };

  const onShopifyProductVariantChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const productVariant = e.target.value;
    setSelectedShopifyProductVariant(productVariant);
    ryelytics.track({
      // TODO: SOURCE.FETCH_OFFERS is not accurate, sometimes it's SOURCE.STRIPE_PAYMENT_INTENT_EXAMPLE
      // Need to refactor code to be able to track this accurately.
      source: SOURCE.FETCH_OFFERS_STEP,
      action: ACTION.UPDATE,
      noun: 'product_variant_dropdown',
      properties: {
        productVariant: productVariant,
      },
    });
  };

  const onMarketplaceChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508#issuecomment-256045682
    //   e.currentTarget.innerText is always "Amazon\nShopify"
    //   e.       target.innerText is either "Amazon" or "Shopify"
    const marketplace =
      target.innerText.toUpperCase() === MarketplaceEnum.Amazon.toUpperCase()
        ? MarketplaceEnum.Amazon
        : MarketplaceEnum.Shopify;
    const otherTabButtons = document.evaluate(
      `//button[contains(., '${target.innerText}')]`,
      document,
      null,
      XPathResult.ANY_TYPE,
      null,
    );
    let button = otherTabButtons.iterateNext();
    while (button) {
      // We should probably chuck this tab code and re-do it, which makes this type error irrelevant:
      // @ts-expect-error - TS2339: Property 'click' does not exist on type 'Node'.
      button.click();
      button = otherTabButtons.iterateNext();
    }
    updateData({ requestedProduct: { selectedMarketplace: marketplace } });
    ryelytics.track({
      // TODO: SOURCE.REQUEST_SCRAPE is not accurate, sometimes it's SOURCE.FETCH_PRODUCT_DATA
      // Need to refactor code to be able to track this accurately.
      source: SOURCE.REQUEST_SCRAPE_STEP,
      action: ACTION.CLICK,
      noun: 'marketplace_tab',
      properties: { selected_marketplace: marketplace },
    });
  };

  const onProductIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const update: Partial<Store['requestedProduct']> = marketPlaceSelector(
      { shopifyProductID: e.target.value },
      { amazonProductID: e.target.value },
    );
    updateData({ requestedProduct: update });
    ryelytics.track({
      // TODO: SOURCE.REQUEST_SCRAPE is not accurate, sometimes it's SOURCE.FETCH_PRODUCT_DATA
      // Need to refactor code to be able to track this accurately.
      source: SOURCE.FETCH_PRODUCT_DATA_STEP,
      action: ACTION.UPDATE,
      noun: 'product_id_input',
      properties: {
        productUpdate: update,
      },
    });
  };

  useDebouncedEffect(checkRyeAPIKey, [data.apiConfig.key], 500);

  const shopifyProductVariantOptions = (): Array<{ id: string; title: string }> | null => {
    if (!fetchProductResponse || !fetchProductResponse.product?.variants) return null;
    return fetchProductResponse.product.variants;
  };

  const shopifyVariants = shopifyProductVariantOptions();

  const initClientSnippet = initializeClientSnippet(data.apiConfig.key || '<RYE_API_KEY>');
  const requestedProductSnippet = requestProductSnippet(
    data.requestedProduct?.productURL,
    data.requestedProduct?.selectedMarketplace,
  );
  const requestedProductSnippetLineNumber = initClientSnippet.split('\n').length + 1;
  const productFetchSnippet = marketPlaceSelector(
    shopifyProductFetchSnippet(data.requestedProduct.shopifyProductID),
    amazonProductFetchSnippet(data.requestedProduct.amazonProductID),
  );
  const productFetchSnippetLineNumber =
    requestedProductSnippet.split('\n').length + requestedProductSnippetLineNumber;

  const productOfferSnippet = marketPlaceSelector(
    shopifyProductOfferSnippet(selectedShopifyProductVariant, {
      city: data.address.city,
      stateCode: data.address.stateCode,
    }),
    amazonProductOfferSnippet(
      {
        city: data.address.city,
        stateCode: data.address.stateCode,
      },
      data.requestedProduct.amazonProductID,
    ),
  );
  const productOfferSnippetLineNumber =
    productFetchSnippet.split('\n').length + productFetchSnippetLineNumber;
  const paymentIntentSnippet = marketPlaceSelector(
    shopifyPaymentIntentSnippet(
      selectedShopifyProductVariant,
      {
        firstName: data.address.firstName,
        lastName: data.address.lastName,
        address1: data.address.address1,
        address2: data.address.address2,
        phone: data.address.phone,
        email: data.address.email,
        city: data.address.city,
        stateCode: data.address.stateCode,
        zipCode: data.address.zipCode,
      },
      '',
    ),
    amazonPaymentIntentSnippet(
      {
        firstName: data.address.firstName,
        lastName: data.address.lastName,
        address1: data.address.address1,
        address2: data.address.address2,
        phone: data.address.phone,
        email: data.address.email,
        city: data.address.city,
        stateCode: data.address.stateCode,
        zipCode: data.address.zipCode,
      },
      data.requestedProduct.amazonProductID,
    ),
  );
  const paymentIntentSnippetLineNumber =
    productOfferSnippet.split('\n').length + productOfferSnippetLineNumber;

  const shopifyOfferFields = () => (
    <div>
      <Label htmlFor="product_id_offers" value="Select product variant" />
      <Select
        value={selectedShopifyProductVariant}
        onChange={onShopifyProductVariantChange}
        className="mt-3 w-full"
        disabled={shopifyVariants === null}
      >
        {shopifyVariants ? (
          shopifyVariants.map(({ id, title }) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))
        ) : (
          <option>Please fetch a product first</option>
        )}
      </Select>
    </div>
  );
  const amazonOfferFields = () => (
    <div>
      <Label htmlFor="offers_product_id" value="Enter product ID" className="mt-10" />
      <TextInput
        value={selectedProductID || ''}
        // @ts-expect-error - TS2322 - "color props are not compatible with exactOptionalPropertyTypes: true" - shouldn't really matter, as long as js is checking for truthiness
        icon={BarcodeIcon}
        className="mt-3 w-full"
        id="offers_product_id"
        placeholder={marketPlaceSelector('2863039381604', 'B000NQ10FK')}
        onChange={onProductIDChange}
      ></TextInput>
    </div>
  );

  return (
    <div
      className={
        'flex ' +
        (currentTheme === ThemeEnum.Dark
          ? 'dark bg-black text-white'
          : 'bg-light-pastel text-black')
      }
    >
      <Flowbite
        theme={{
          usePreferences: false,
          theme: {
            card: {
              base: 'flex rounded-lg border border-gray-200 text-slate-800 bg-white shadow-md dark:border-gray-700 dark:bg-neutral-900 flex-col',
            },
            tab: {
              tablist: {
                tabitem: {
                  styles: {
                    underline: {
                      active: {
                        on: 'text-indigo-600 rounded-t-lg border-b-2 border-indigo-600 active dark:text-rye-lime dark:border-rye-lime',
                      },
                    },
                  },
                },
              },
            },
          },
        }}
      >
        <div className="mx-10 mt-5">
          <div className="font-200 flex items-center justify-end">
            <DarkModeSwitch checked={currentTheme === ThemeEnum.Dark} onChange={onChangeTheme} />
          </div>
          <h1 className="font-200 flex items-center justify-between text-5xl">
            Rye API Quick Start
          </h1>
          <h2 className="text-1xl my-2">
            Try out Rye API to make a purchase from Shopify or Amazon
          </h2>
          <Timeline>
            {/*
              Refactoring TODO:
                - Breakup `updateData` into singular react state atoms
                - Then embed some of these utility functions into respective tutorial step components
                - Avoid passing `updateData` down into children components
                - Turn these into proper jsx components w/props
            */}
            {enterApiKey(
              currentTheme,
              data,
              onAPIKeyChange,
              isCheckingAPIKey,
              isValidAPIKey,
              initClientSnippet,
            )}
            {requestScrape(
              onMarketplaceChange,
              data,
              marketPlaceSelector,
              onProductURLChange,
              requestProduct,
              isRequestingProduct,
              requestProductResponse,
              currentTheme,
              requestedProductSnippetLineNumber,
              requestedProductSnippet,
            )}
            {requestProductData(
              onMarketplaceChange,
              data,
              selectedProductID,
              marketPlaceSelector,
              onProductIDChange,
              fetchProduct,
              isFetchingProduct,
              fetchProductResponse,
              currentTheme,
              productFetchSnippetLineNumber,
              productFetchSnippet,
            )}
            {fetchOffers(
              marketPlaceSelector,
              shopifyOfferFields,
              amazonOfferFields,
              onCityChange,
              data,
              onStateCodeChange,
              fetchProductOffers,
              isFetchingProduct,
              isFetchingProductOffers,
              fetchProductOffersResponse,
              currentTheme,
              productOfferSnippetLineNumber,
              productOfferSnippet,
            )}
            {stripePaymentIntentExample(
              marketPlaceSelector,
              shopifyOfferFields,
              amazonOfferFields,
              onFirstNameChange,
              data,
              onLastNameChange,
              onAddressOneChange,
              onAddressTwoChange,
              onZipCodeChange,
              onEmailChange,
              onPhoneChange,
              onCityChange,
              onStateCodeChange,
              fetchPaymentIntent,
              isFetchingProduct,
              isFetchingPaymentIntent,
              fetchPaymentIntentResponse,
              currentTheme,
              paymentIntentSnippetLineNumber,
              paymentIntentSnippet,
            )}
            {performCheckoutStep(stripePromise, clientSecret, currentTheme)}
          </Timeline>
        </div>
      </Flowbite>
    </div>
  );
}
