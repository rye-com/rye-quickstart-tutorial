import type { ChangeEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import ApiKeyDarkImage from './rye-api-key-dark.png';
import ApiKeyLightImage from './rye-api-key-light.png';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import {
  Badge,
  Button,
  Card,
  Flowbite,
  Label,
  Select,
  Spinner,
  Tabs,
  TextInput,
  Timeline,
} from 'flowbite-react';
import { KeyIcon, CheckIcon, XMarkIcon, LinkIcon } from '@heroicons/react/24/solid';
import { Elements as StripeElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { RiBarcodeLine as BarcodeIcon } from 'react-icons/ri';

import SyntaxHighlighter from 'react-syntax-highlighter';
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
  checkoutFormCode,
} from './code_snippets';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { cloneDeep, merge } from 'lodash';
import { GraphQLClient } from 'graphql-request';
import { CheckoutForm } from '../CheckoutForm';
import type { RecursivePartial } from '../../types/utils/RecursivePartial';
import type { Address } from '../../types/api-data/Address';

type APIConfiguration = {
  key: string;
  endpoint: string;
};

enum Theme {
  Dark = 'dark',
  Light = 'light',
}

enum Marketplace {
  Shopify = 'SHOPIFY',
  Amazon = 'AMAZON',
}

type Store = {
  appTheme: string;
  apiConfig: APIConfiguration;
  requestedProduct: {
    productURL: string;
    shopifyProductID?: string;
    amazonProductID?: string;
    selectedMarketplace: Marketplace;
  };
  address: Address;
};

function detectThemePreference(): string {
  const currentTheme = window.localStorage?.getItem('appTheme');
  if (currentTheme) {
    return JSON.parse(currentTheme);
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? Theme.Dark.valueOf() : Theme.Light.valueOf();
}

const defaultStore: Store = {
  apiConfig: JSON.parse(window.localStorage?.getItem('apiConfig') || '{}'),
  appTheme: detectThemePreference(),
  requestedProduct: JSON.parse(
    window.localStorage?.getItem('requestedProduct') ||
      JSON.stringify({
        shopifyProductID: '',
        amazonProductID: '',
        selectedMarketplace: Marketplace.Amazon,
        productURL: '',
      }),
  ),
  address: JSON.parse(
    window.localStorage?.getItem('address') ||
      JSON.stringify({
        firstName: 'Will',
        lastName: 'Smith',
        address1: 'Bel Air Mansion',
        address2: '',
        city: 'Beverly Hills',
        stateCode: 'CA',
        zipCode: '90210',
        phone: '1234567890',
        email: 'tutorial@rye.com',
      }),
  ),
};

const linkClasses = 'text-indigo-500 dark:text-rye-lime';

function CustomTimelineBody(props: { children: ReactNode }) {
  return <div className="text-slate-600 dark:text-slate-200">{props.children}</div>;
}

function CustomCodeBlock({
  codeString,
  dataTheme,
  language = 'javascript',
  showLineNumbers = false,
  startingLineNumber = 1,
  style = {},
}: {
  language?: string;
  codeString: string;
  dataTheme: Theme;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  style?: React.CSSProperties;
}) {
  const theme = dataTheme === Theme.Dark.valueOf() ? atomOneDark : atomOneLight;
  const themeOverrides: { [key: string]: React.CSSProperties } = {
    hljs: { background: 'transparent' },
  };
  return (
    <SyntaxHighlighter
      showLineNumbers={showLineNumbers}
      lineNumberStyle={{ color: 'rgb(176 171 171)' }}
      startingLineNumber={startingLineNumber}
      codeTagProps={{
        style: {
          fontSize: '0.8rem',
          ...style,
        },
      }}
      language={language}
      style={{
        ...theme,
        ...themeOverrides,
      }}
    >
      {codeString}
    </SyntaxHighlighter>
  );
}

function InlineCodeSnippet(props: { children: ReactNode }): JSX.Element {
  const codeSnippetClasses =
    'text-slate-500 dark:bg-neutral-700 border dark:border-neutral-500 dark:text-amber-200 px-1';
  return <span className={codeSnippetClasses}>{props.children}</span>;
}

// Maybe we should use an external lib here?
export const useDebouncedEffect = (
  /** Returned cleanup callback is currently not called */
  effect: () => void,
  // `any` is preferable here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: Array<any>,
  delay: number,
) => {
  useEffect(() => {
    const handler = setTimeout(effect, delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
};

export default function Index() {
  const [data, setData] = useState<Store>(defaultStore);

  const [isRequestingProduct, setIsRequestingProduct] = useState<boolean>(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState<boolean>(false);
  const [isFetchingProductOffers, setIsFetchingProductOffers] = useState<boolean>(false);
  const [isFetchingPaymentIntent, setIsFetchingPaymentIntent] = useState<boolean>(false);

  const [requestProductResponse, setRequestProductResponse] = useState<unknown | null>(null);
  const [fetchProductResponse, setFetchProductResponse] = useState<unknown | null>(null);
  const [fetchProductOffersResponse, setFetchProductOffersResponse] = useState<unknown | null>(
    null,
  );
  const [fetchPaymentIntentResponse, setFetchPaymentIntentResponse] = useState<unknown | null>(
    null,
  );

  const [isValidAPIKey, setIsValidAPIKey] = useState<boolean>(false);
  const [isCheckingAPIKey, setIsCheckingAPIKey] = useState<boolean>(false);
  const [selectedShopifyProductVariant, setSelectedShopifyProductVariant] = useState<string>('');
  const [shopifyStoreCanonicalURL, setShopifyStoreCanonicalURL] = useState<string>('');

  const clientSecret =
    fetchPaymentIntentResponse?.createShopifyPaymentIntent?.clientSecret ||
    fetchPaymentIntentResponse?.createAmazonPaymentIntent?.clientSecret;
  const stripeAPIKey =
    fetchPaymentIntentResponse?.createShopifyPaymentIntent?.publishableAPIKey ||
    fetchPaymentIntentResponse?.createAmazonPaymentIntent?.publishableAPIKey;

  type StripeProp = Parameters<typeof StripeElements>[0]['stripe'];

  const stripePromise: StripeProp = useMemo(() => {
    if (stripeAPIKey) {
      console.log('loading stripe');
      return loadStripe(stripeAPIKey);
    } else {
      console.warn('stripeAPIKey is falsy:', stripeAPIKey);
      return null;
    }
  }, [stripeAPIKey]);

  const marketPlaceSelector = <T, V>(shopifyVar: T, amazonVar: V): T | V => {
    if (data.requestedProduct.selectedMarketplace === Marketplace.Shopify) {
      return shopifyVar;
    } else {
      return amazonVar;
    }
  };

  const selectedProductID = marketPlaceSelector(
    data.requestedProduct.shopifyProductID,
    data.requestedProduct.amazonProductID,
  );

  const currentTheme = data.appTheme === Theme.Dark.valueOf() ? Theme.Dark : Theme.Light;

    query: string,
    variables: Variables, // using generic TVars for this causes a weird type error with client.request call
  ) => {
    const client = new GraphQLClient('https://graphql.api.rye.com/v1/query');
    const headers = {
      Authorization: 'Basic ' + btoa(data.apiConfig.key + ':'),
    };
    return client.request(query, variables, headers);
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
    makeGQLRequest(amazonProductFetchQuery, variables)
      .then((_result) => {
        setIsValidAPIKey(true);
      })
      .catch((_error) => {
        setIsValidAPIKey(false);
      })
      .finally(() => {
        setIsCheckingAPIKey(false);
      });
  };

  function RequestResponseCodeBlock({ response }: { response: object | null }): JSX.Element | null {
    if (!response) return null;
    return (
      <div className="mt-5 overflow-scroll rounded-lg p-4 border border-gray-300 dark:border-gray-800">
        {prettifiedJSONResponse(response)}
      </div>
    );
  }

  function updateData(dataUpdate: RecursivePartial<Store>) {
    const newData: Store = merge(cloneDeep(data), dataUpdate);
    let key: keyof Store;
    for (key in newData) {
      window.localStorage?.setItem(key, JSON.stringify(newData[key]));
    }
    setData(newData);
  }

  const onChangeTheme = (checked: boolean) => {
    const theme = checked ? Theme.Dark : Theme.Light;
    updateData({ appTheme: theme });
  };

  const requestProduct = () => {
    setIsRequestingProduct(true);
    const variables = requestProductVariables(
      data.requestedProduct.productURL,
      data.requestedProduct.selectedMarketplace.valueOf().toUpperCase(),
    );
    makeGQLRequest(requestProductQuery, variables)
      .then((res) => {
        setRequestProductResponse(res);
        const requestedProduct: Partial<Store['requestedProduct']> = {};
        if (data.requestedProduct.selectedMarketplace === Marketplace.Shopify) {
          requestedProduct['shopifyProductID'] = res['requestProductByURL'].productID;
        } else {
          requestedProduct['amazonProductID'] = res['requestProductByURL'].productID;
        }
        updateData({ requestedProduct: requestedProduct });
      })
      .catch((error) => {
        // TODO: test this path
        setRequestProductResponse(error);
      })
      .finally(() => {
        setIsRequestingProduct(false);
      });
  };

  const fetchProduct = () => {
    if (!selectedProductID) {
      return;
    }
    setIsFetchingProduct(true);
    const variables = productFetchVariables(
      selectedProductID,
      data.requestedProduct.selectedMarketplace.valueOf().toUpperCase(),
    );
    makeGQLRequest(
      marketPlaceSelector(shopifyProductFetchQuery, amazonProductFetchQuery),
      variables,
    )
      .then((res) => {
        setFetchProductResponse(res);
        if (res['product']?.variants && res['product'].variants.length > 0) {
          setSelectedShopifyProductVariant(res['product'].variants[0].id);
        }
        if (res['product']?.storeCanonicalURL) {
          setShopifyStoreCanonicalURL(res['product'].storeCanonicalURL);
        }
      })
      .catch((error) => {
        setFetchProductResponse(error);
      })
      .finally(() => {
        setIsFetchingProduct(false);
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
      shopifyProductOfferVariables(shopifyStoreCanonicalURL, selectedShopifyProductVariant, {
        city: data.address.city,
        stateCode: data.address.stateCode,
      }),
      amazonProductOfferVariables(
        { city: data.address.city, stateCode: data.address.stateCode },
        selectedProductID,
      ),
    );
    makeGQLRequest(
      marketPlaceSelector(shopifyProductOfferQuery, amazonProductOfferQuery),
      variables,
    )
      .then((res) => {
        setFetchProductOffersResponse(res);
      })
      .catch((error) => {
        setFetchProductOffersResponse(error);
      })
      .finally(() => {
        setIsFetchingProductOffers(false);
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
    const variables = marketPlaceSelector(
      shopifyPaymentIntentVariables(
        shopifyStoreCanonicalURL,
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
      })
      .finally(() => {
        setIsFetchingPaymentIntent(false);
      });
  };

  const onAPIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ apiConfig: { key: e.target.value } });
  };

  const onAddressFieldChangeFn = (field: keyof Address) => (e: React.ChangeEvent) => {
    const data = { address: { [field]: (e.target as HTMLInputElement).value } };
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
    updateData({ requestedProduct: { productURL: e.target.value } });
  };

  const onProductVariantChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedShopifyProductVariant(e.target.value);
  };

  const onMarketplaceChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508#issuecomment-256045682
    //   e.currentTarget.innerText is always "Amazon\nShopify"
    //   e.       target.innerText is either "Amazon" or "Shopify"
    const marketplace =
      target.innerText.toUpperCase() === Marketplace.Amazon.valueOf().toUpperCase()
        ? Marketplace.Amazon
        : Marketplace.Shopify;
    const otherTabButtons = document.evaluate(
      `//button[contains(., '${target.innerText}')]`,
      document,
      null,
      XPathResult.ANY_TYPE,
      null,
    );
    let button = otherTabButtons.iterateNext();
    while (button) {
      button.click();
      button = otherTabButtons.iterateNext();
    }
    updateData({ requestedProduct: { selectedMarketplace: marketplace } });
  };

  const prettifiedJSONResponse = (resp: object | null) => {
    if (!resp) {
      return null;
    }
    const prettyJSON = JSON.stringify(resp, null, 2);
    return (
      <CustomCodeBlock
        showLineNumbers={false}
        dataTheme={currentTheme}
        codeString={prettyJSON}
        language="json"
      ></CustomCodeBlock>
    );
  };

  const onProductIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const update: Partial<Store['requestedProduct']> = marketPlaceSelector(
      { shopifyProductID: e.target.value },
      { amazonProductID: e.target.value },
    );
    updateData({ requestedProduct: update });
  };

  const onShopifyStoreCanonicalURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShopifyStoreCanonicalURL(e.target.value);
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
    shopifyProductOfferSnippet(shopifyStoreCanonicalURL, selectedShopifyProductVariant, {
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
      shopifyStoreCanonicalURL,
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
      <Label htmlFor="shopify_store_canonical_url" value="Store Canonical URL" />
      <TextInput
        className="my-3 w-full"
        id="shopify_store_canonical_url"
        value={shopifyStoreCanonicalURL}
        onChange={onShopifyStoreCanonicalURLChange}
      ></TextInput>
      <Label htmlFor="product_id_offers" value="Select product variant" />
      <Select
        value={selectedShopifyProductVariant}
        onChange={onProductVariantChange}
        className="w-full mt-3"
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
        className="w-full mt-3"
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
        (currentTheme === Theme.Dark ? 'dark bg-black text-white' : 'bg-light-pastel text-black')
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
          <div className="flex items-center justify-end font-200">
            <DarkModeSwitch checked={currentTheme === Theme.Dark} onChange={onChangeTheme} />
          </div>
          <h1 className="flex items-center justify-between text-5xl font-200">
            Rye API Quick Start
          </h1>
          <h2 className="text-1xl my-2">
            Try out Rye API to make a purchase from Shopify or Amazon
          </h2>
          <Timeline>
            <Timeline.Item>
              <Timeline.Content>
                <div className="flex">
                  <Card className="max-w-xl">
                    <Timeline.Point icon={KeyIcon} />
                    <Timeline.Title>Grab your API Key</Timeline.Title>
                    <CustomTimelineBody>
                      <div className="py-3 text">
                        Navigate to{' '}
                        <a className={linkClasses} href="https://console.rye.com">
                          console.rye.com
                        </a>{' '}
                        and grab your API key
                      </div>
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <div className="py-1">
                        Under Access and Security, view and copy your API key
                      </div>
                      <img
                        src={currentTheme === Theme.Dark ? ApiKeyDarkImage : ApiKeyLightImage}
                        alt="API Key"
                        className="border rounded border-slate-200 dark:border-rye-lime"
                      />
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <div className="py-1">
                        <Label htmlFor="api_key" value="Enter your RYE API key" />
                        <TextInput
                          value={data.apiConfig.key}
                          icon={KeyIcon}
                          id="api_key"
                          className="mt-3"
                          placeholder="RYE-abcdef"
                          onChange={onAPIKeyChange}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <div className="w-6 h-6 flex items-center">
                          {isCheckingAPIKey ? <Spinner className="w-6 h-6" /> : null}
                          {!isCheckingAPIKey ? (
                            <Badge
                              className="h-full w-full flex justify-center"
                              icon={isValidAPIKey ? CheckIcon : XMarkIcon}
                              color={isValidAPIKey ? 'success' : 'warning'}
                            />
                          ) : null}
                        </div>
                        <span className="text-sm">
                          {isCheckingAPIKey
                            ? 'Validating'
                            : isValidAPIKey
                            ? 'Connected'
                            : 'Offline'}
                        </span>
                      </div>
                    </CustomTimelineBody>
                  </Card>
                  <div className="mx-3 max-w-2xl overflow-scroll">
                    <CustomCodeBlock
                      showLineNumbers={true}
                      dataTheme={currentTheme}
                      startingLineNumber={1}
                      codeString={initClientSnippet}
                    ></CustomCodeBlock>
                  </div>
                </div>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Content>
                <div className="flex">
                  <Card className="max-w-xl self-baseline">
                    <Timeline.Title>
                      <Timeline.Point />
                      Request an item to be requested by the Rye API
                    </Timeline.Title>
                    <CustomTimelineBody>
                      <div className="py-1">
                        Request an item from Rye to be requested. You can also do this via the
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
                          active={data.requestedProduct.selectedMarketplace === Marketplace.Amazon}
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
                          active={data.requestedProduct.selectedMarketplace === Marketplace.Shopify}
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
                        <div className="flex mt-3">
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
                            {!isRequestingProduct ? (
                              'Request'
                            ) : (
                              <Spinner style={{ maxHeight: 30 }} />
                            )}
                          </Button>
                        </div>
                        <RequestResponseCodeBlock response={requestProductResponse} />
                      </div>
                    </CustomTimelineBody>
                  </Card>
                  <div className="mx-3 max-w-xl overflow-scroll">
                    <CustomCodeBlock
                      showLineNumbers={true}
                      dataTheme={currentTheme}
                      startingLineNumber={requestedProductSnippetLineNumber}
                      codeString={requestedProductSnippet}
                    ></CustomCodeBlock>
                  </div>
                </div>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Content>
                <div className="flex">
                  <Card className="max-w-xl self-baseline">
                    <Timeline.Title>Fetch an item from the Rye API</Timeline.Title>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <div className="py-1">
                        Once an item is requested, it can be retrieved using the Rye API
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
                          active={data.requestedProduct.selectedMarketplace === Marketplace.Amazon}
                        >
                          <div className="mt-3">
                            The Amazon Standard identification Number (ASIN) can be used to fetch an
                            item from Amazon. You can find the item ID for an amazon item by using
                            the ID after <InlineCodeSnippet>dp/</InlineCodeSnippet> in the URL.
                            Example:
                          </div>
                          <span className="text-amber-700">
                            https://amazon.com/neo-sporin/dp/
                            <span className="text-amber-300 bg-red-500 px-2 rounded-lg">
                              B000NQ10FK
                            </span>
                          </span>
                          <div className="mt-3">
                            It is also returned in the response by the{' '}
                            <InlineCodeSnippet>requestProduct</InlineCodeSnippet> mutation.
                          </div>
                        </Tabs.Item>
                        <Tabs.Item
                          title="Shopify"
                          active={data.requestedProduct.selectedMarketplace === Marketplace.Shopify}
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
                        <Label
                          htmlFor="fetch_product_id"
                          value="Enter product ID"
                          className="mt-10"
                        />
                        <div className="flex my-3">
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
                        <RequestResponseCodeBlock response={fetchProductResponse} />
                      </div>
                    </CustomTimelineBody>
                  </Card>
                  <div className="mx-3 max-w-xl overflow-scroll">
                    <CustomCodeBlock
                      showLineNumbers={true}
                      startingLineNumber={productFetchSnippetLineNumber}
                      dataTheme={currentTheme}
                      codeString={productFetchSnippet}
                    ></CustomCodeBlock>
                  </div>
                </div>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Content>
                <div className="flex">
                  <Card className="max-w-xl self-baseline">
                    <Timeline.Title>Fetch offers on the item from the Rye API</Timeline.Title>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <div className="py-1">
                        You can use the offers query to display a sample checkout for the item. This
                        is useful for showing estimated taxes, and any shipping costs
                      </div>
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <div>
                        {marketPlaceSelector(shopifyOfferFields(), amazonOfferFields())}
                        <div className="flex mt-3">
                          <div>
                            <Label htmlFor="city" value="City" />
                            <TextInput
                              className="w-64 mt-3"
                              id="city"
                              onChange={onCityChange}
                              value={data.address.city}
                              placeholder="San Francisco"
                            ></TextInput>
                          </div>
                          <div className="ml-3">
                            <Label className="mt-3" htmlFor="product_id_offers" value="State" />
                            <Select
                              onChange={onStateCodeChange}
                              value={data.address.stateCode}
                              className="mt-3 w-24"
                            >
                              <option value="AL">AL</option>
                              <option value="AK">AK</option>
                              <option value="AR">AR</option>
                              <option value="AZ">AZ</option>
                              <option value="CA">CA</option>
                              <option value="CO">CO</option>
                              <option value="CT">CT</option>
                              <option value="DE">DE</option>
                              <option value="FL">FL</option>
                              <option value="GA">GA</option>
                              <option value="HI">HI</option>
                              <option value="IA">IA</option>
                              <option value="ID">ID</option>
                              <option value="IL">IL</option>
                              <option value="IN">IN</option>
                              <option value="KS">KS</option>
                              <option value="KY">KY</option>
                              <option value="LA">LA</option>
                              <option value="MA">MA</option>
                              <option value="MD">MD</option>
                              <option value="ME">ME</option>
                              <option value="MI">MI</option>
                              <option value="MN">MN</option>
                              <option value="MO">MO</option>
                              <option value="MS">MS</option>
                              <option value="MT">MT</option>
                              <option value="NC">NC</option>
                              <option value="ND">ND</option>
                              <option value="NE">NE</option>
                              <option value="NH">NH</option>
                              <option value="NJ">NJ</option>
                              <option value="NM">NM</option>
                              <option value="NV">NV</option>
                              <option value="NY">NY</option>
                              <option value="OH">OH</option>
                              <option value="OK">OK</option>
                              <option value="OR">OR</option>
                              <option value="PA">PA</option>
                              <option value="RI">RI</option>
                              <option value="SC">SC</option>
                              <option value="SD">SD</option>
                              <option value="TN">TN</option>
                              <option value="TX">TX</option>
                              <option value="UT">UT</option>
                              <option value="VA">VA</option>
                              <option value="VT">VT</option>
                              <option value="WA">WA</option>
                              <option value="WI">WI</option>
                              <option value="WV">WV</option>
                              <option value="WY">WY</option>
                            </Select>
                          </div>
                          <div className="w-full flex">
                            <Button
                              style={{ width: 150, height: 40, maxHeight: 40 }}
                              onClick={fetchProductOffers}
                              className="self-end mx-3"
                              disabled={isFetchingProduct}
                            >
                              {!isFetchingProductOffers ? (
                                'Fetch'
                              ) : (
                                <Spinner style={{ maxHeight: 30 }} />
                              )}
                            </Button>
                          </div>
                        </div>
                        <RequestResponseCodeBlock response={fetchProductOffersResponse} />
                      </div>
                    </CustomTimelineBody>
                  </Card>
                  <div className="mx-3 max-w-xl overflow-scroll">
                    <CustomCodeBlock
                      showLineNumbers={true}
                      dataTheme={currentTheme}
                      startingLineNumber={productOfferSnippetLineNumber}
                      codeString={productOfferSnippet}
                    ></CustomCodeBlock>
                  </div>
                </div>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Content>
                <div className="flex">
                  <Card className="max-w-xl self-baseline">
                    <Timeline.Title>Fetch payment intent to perform Stripe checkout</Timeline.Title>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <div className="py-1">
                        You can use the offers query to display a sample checkout for the item. This
                        is useful for showing estimated taxes, and any shipping costs
                      </div>
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <div>
                        {marketPlaceSelector(shopifyOfferFields(), amazonOfferFields())}
                        <div className="flex mt-3">
                          <div>
                            <Label htmlFor="first_name" value="First Name" />
                            <TextInput
                              className="w-64 mt-3"
                              id="first_name"
                              onChange={onFirstNameChange}
                              value={data.address.firstName}
                              placeholder="Will"
                            />
                          </div>
                          <div className="mx-3">
                            <Label htmlFor="last_name" value="Last Name" />
                            <TextInput
                              className="w-64 mt-3"
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
                            className="w-full mt-3"
                            id="address_one"
                            onChange={onAddressOneChange}
                            value={data.address.address1}
                            placeholder="Bel Air Mansion"
                          />
                        </div>
                        <div className="flex">
                          <div className="mt-3">
                            <Label htmlFor="address_two" value="Address Line 2" />
                            <TextInput
                              className="w-64 mt-3"
                              id="address_two"
                              onChange={onAddressTwoChange}
                              value={data.address.address2}
                              placeholder=""
                            />
                          </div>
                          <div className="mx-3 mt-3">
                            <Label htmlFor="zip_code" value="Address Line 2" />
                            <TextInput
                              type="text"
                              className="w-64 mt-3"
                              id="zip_code"
                              onChange={onZipCodeChange}
                              value={data.address.zipCode}
                              placeholder=""
                            />
                          </div>
                        </div>
                        <div className="flex mt-3">
                          <div>
                            <Label htmlFor="email" value="Email" />
                            <TextInput
                              type="email"
                              className="w-64 mt-3"
                              id="email"
                              onChange={onEmailChange}
                              value={data.address.email}
                              placeholder="jane-smith@email.com"
                            />
                          </div>
                          <div className="mx-3">
                            <Label htmlFor="phone" value="Phone" />
                            <TextInput
                              type="tel"
                              className="w-64 mt-3"
                              id="phone"
                              onChange={onPhoneChange}
                              value={data.address.phone}
                              placeholder="123-456-7890"
                            />
                          </div>
                        </div>
                        <div className="flex mt-3">
                          <div>
                            <Label htmlFor="city" value="City" />
                            <TextInput
                              className="w-64 mt-3"
                              id="city"
                              onChange={onCityChange}
                              value={data.address.city}
                              placeholder="San Francisco"
                            ></TextInput>
                          </div>
                          <div className="ml-3">
                            <Label className="mt-3" htmlFor="product_id_offers" value="State" />
                            <Select
                              onChange={onStateCodeChange}
                              value={data.address.stateCode}
                              className="mt-3 w-24"
                            >
                              <option value="AL">AL</option>
                              <option value="AK">AK</option>
                              <option value="AR">AR</option>
                              <option value="AZ">AZ</option>
                              <option value="CA">CA</option>
                              <option value="CO">CO</option>
                              <option value="CT">CT</option>
                              <option value="DE">DE</option>
                              <option value="FL">FL</option>
                              <option value="GA">GA</option>
                              <option value="HI">HI</option>
                              <option value="IA">IA</option>
                              <option value="ID">ID</option>
                              <option value="IL">IL</option>
                              <option value="IN">IN</option>
                              <option value="KS">KS</option>
                              <option value="KY">KY</option>
                              <option value="LA">LA</option>
                              <option value="MA">MA</option>
                              <option value="MD">MD</option>
                              <option value="ME">ME</option>
                              <option value="MI">MI</option>
                              <option value="MN">MN</option>
                              <option value="MO">MO</option>
                              <option value="MS">MS</option>
                              <option value="MT">MT</option>
                              <option value="NC">NC</option>
                              <option value="ND">ND</option>
                              <option value="NE">NE</option>
                              <option value="NH">NH</option>
                              <option value="NJ">NJ</option>
                              <option value="NM">NM</option>
                              <option value="NV">NV</option>
                              <option value="NY">NY</option>
                              <option value="OH">OH</option>
                              <option value="OK">OK</option>
                              <option value="OR">OR</option>
                              <option value="PA">PA</option>
                              <option value="RI">RI</option>
                              <option value="SC">SC</option>
                              <option value="SD">SD</option>
                              <option value="TN">TN</option>
                              <option value="TX">TX</option>
                              <option value="UT">UT</option>
                              <option value="VA">VA</option>
                              <option value="VT">VT</option>
                              <option value="WA">WA</option>
                              <option value="WI">WI</option>
                              <option value="WV">WV</option>
                              <option value="WY">WY</option>
                            </Select>
                          </div>
                          <div className="w-full flex">
                            <Button
                              style={{ width: 150, height: 40, maxHeight: 40 }}
                              onClick={fetchPaymentIntent}
                              className="self-end mx-3"
                              disabled={isFetchingProduct}
                            >
                              {!isFetchingPaymentIntent ? (
                                'Fetch'
                              ) : (
                                <Spinner style={{ maxHeight: 30 }} />
                              )}
                            </Button>
                          </div>
                        </div>
                        <RequestResponseCodeBlock response={fetchPaymentIntentResponse} />
                      </div>
                    </CustomTimelineBody>
                  </Card>
                  <div className="mx-3 max-w-xl overflow-scroll">
                    <CustomCodeBlock
                      showLineNumbers={true}
                      dataTheme={currentTheme}
                      startingLineNumber={paymentIntentSnippetLineNumber}
                      codeString={paymentIntentSnippet}
                    ></CustomCodeBlock>
                  </div>
                </div>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Content>
                <div className="flex">
                  <Card className="max-w-xl self-baseline">
                    <Timeline.Title>Perform checkout</Timeline.Title>
                    <CustomTimelineBody>
                      <div className="py-1">
                        Fetch a payment intent to display a Stripe checkout form. The stripe payment
                        form will use Rye's Stripe account to accept payment for the item.
                      </div>
                      <Timeline.Point />
                      {stripePromise && clientSecret ? (
                        <StripeElements
                          stripe={stripePromise}
                          options={{
                            clientSecret: clientSecret,
                            appearance: {
                              theme: currentTheme === Theme.Dark ? 'night' : 'flat',
                            },
                          }}
                        >
                          <CheckoutForm />
                        </StripeElements>
                      ) : null}
                    </CustomTimelineBody>
                  </Card>
                  <div className="mx-3 max-w-2xl overflow-scroll">
                    <CustomCodeBlock
                      showLineNumbers={true}
                      dataTheme={currentTheme}
                      startingLineNumber={1}
                      codeString={checkoutFormCode}
                    ></CustomCodeBlock>
                  </div>
                </div>
              </Timeline.Content>
            </Timeline.Item>
          </Timeline>
        </div>
      </Flowbite>
    </div>
  );
}
