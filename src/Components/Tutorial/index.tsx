import { ChangeEvent, ChangeEventHandler, ReactElement, useEffect, useState } from "react";
import ApiKeyDarkImage from "./rye-api-key-dark.png";
import ApiKeyLightImage from "./rye-api-key-light.png";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { Badge, Button, Card, Flowbite, Label, Select, Spinner, Tabs, TextInput, Timeline } from "flowbite-react";
import { KeyIcon, AtSymbolIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import SyntaxHighlighter from "react-syntax-highlighter";
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
} from "./code_snippets";
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { cloneDeep, merge } from "lodash";
import { GraphQLClient } from "graphql-request";
import { type } from "os";

type APIConfiguration = {
  key: string;
  endpoint: string;
};

enum Theme {
  Dark = "dark",
  Light = "light",
}

enum Marketplace {
  Shopify = "SHOPIFY",
  Amazon = "AMAZON",
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
  address: {
    stateCode: string;
    city: string;
  };
};

function detectThemePreference(): string {
  const setTheme = window.localStorage?.getItem("appTheme");
  if (setTheme) {
    return JSON.parse(setTheme);
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? Theme.Dark.valueOf() : Theme.Light.valueOf();
}

const defaultStore: Store = {
  apiConfig: JSON.parse(window.localStorage?.getItem("apiConfig") || "{}"),
  appTheme: detectThemePreference(),
  requestedProduct: JSON.parse(
    window.localStorage?.getItem("requestedProduct") ||
      JSON.stringify({
        shopifyProductID: "",
        amazonProductID: "",
        selectedMarketplace: Marketplace.Amazon,
        productURL: "",
      })
  ),
  address: JSON.parse(
    window.localStorage?.getItem("address") ||
      JSON.stringify({
        city: "San Francisco",
        stateCode: "CA",
      })
  ),
};

const linkClasses = "text-indigo-500 dark:text-rye-lime";

function CustomTimelineBody(props: any) {
  return <div className="text-slate-600 dark:text-slate-200">{props.children}</div>;
}

function CustomCodeBlock({
  codeString,
  dataTheme,
  language = "javascript",
  showLineNumbers = false,
  startingLineNumber = 1,
  style = {},
  ...rest
}: {
  language?: string;
  codeString: string;
  dataTheme: Theme;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  rest?: any;
  style?: React.CSSProperties;
}) {
  const theme = dataTheme === Theme.Dark.valueOf() ? atomOneDark : atomOneLight;
  const themeOverrides: { [key: string]: React.CSSProperties } = {
    hljs: { background: "transparent" },
  };
  return (
    <SyntaxHighlighter
      showLineNumbers={showLineNumbers}
      lineNumberStyle={{ color: "rgb(176 171 171)" }}
      startingLineNumber={startingLineNumber}
      codeTagProps={{
        style: {
          fontSize: "0.8rem",
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

function InlineCodeSnippet(props: any): JSX.Element {
  const codeSnippetClasses =
    "text-slate-500 dark:bg-neutral-700 border dark:border-neutral-500 dark:text-amber-200 px-1";
  return <span className={codeSnippetClasses}>{props.children}</span>;
}

export const useDebouncedEffect = (effect: any, deps: Array<any>, delay: number) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
};

export default function Index() {
  const [data, setData] = useState<Store>(defaultStore);
  const [isRequestingProduct, setIsRequestingProduct] = useState<boolean>(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState<boolean>(false);
  const [isFetchingProductOffers, setIsFetchingProductOffers] = useState<boolean>(false);
  const [requestProductResponse, setRequestProductResponse] = useState<any | null>(null);
  const [fetchProductResponse, setFetchProductResponse] = useState<any | null>(null);
  const [fetchProductOffersResponse, setFetchProductOffersResponse] = useState<any | null>(null);
  const [isValidAPIKey, setIsValidAPIKey] = useState<boolean>(false);
  const [isCheckingAPIKey, setIsCheckingAPIKey] = useState<boolean>(false);
  const [selectedShopifyProductVariant, setSelectedShopifyProductVariant] = useState<string>("");
  const [shopifyStoreCanonicalURL, setShopifyStoreCanonicalURL] = useState<string>("");

  const marketPlaceSelector = <T,V>(shopifyVar: T, amazonVar: V): T | V => {
    if (data.requestedProduct.selectedMarketplace === Marketplace.Shopify) {
      return shopifyVar;
    } else {
      return amazonVar;
    }
  };

  const selectedProductID = marketPlaceSelector(
    data.requestedProduct.shopifyProductID,
    data.requestedProduct.amazonProductID
  );

  const currentTheme = data.appTheme === Theme.Dark.valueOf() ? Theme.Dark : Theme.Light;

  const makeGQLRequest = (query: string, variables: any) => {
    const client = new GraphQLClient("https://graphql.api.rye.com/v1/query");
    const headers = {
      Authorization: "Basic " + btoa(data.apiConfig.key + ":"),
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
        id: "B073K14CVB",
        marketplace: "AMAZON",
      },
    };
    makeGQLRequest(amazonProductFetchQuery, variables)
      .then((result) => {
        setIsValidAPIKey(true);
      })
      .catch((error) => {
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
    const variables = requestProductVariables(data.requestedProduct.productURL, data.requestedProduct.selectedMarketplace.valueOf().toUpperCase())
    makeGQLRequest(requestProductQuery, variables)
      .then((res) => {
        setRequestProductResponse(res);
        let requestedProduct: Partial<Store["requestedProduct"]> = {};
        if (data.requestedProduct.selectedMarketplace === Marketplace.Shopify) {
          requestedProduct["shopifyProductID"] = res["requestProductByURL"].productID;
        } else {
          requestedProduct["amazonProductID"] = res["requestProductByURL"].productID;
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
    if(!selectedProductID) { return }
    setIsFetchingProduct(true);
    const variables =  productFetchVariables(selectedProductID, data.requestedProduct.selectedMarketplace.valueOf().toUpperCase())
    makeGQLRequest(marketPlaceSelector(shopifyProductFetchQuery, amazonProductFetchQuery), variables)
      .then((res) => {
        setFetchProductResponse(res);
        if (res["product"]?.variants && res["product"].variants.length > 0) {
          setSelectedShopifyProductVariant(res["product"].variants[0].id);
        }
        if (res["product"]?.storeCanonicalURL) {
          setShopifyStoreCanonicalURL(res["product"].storeCanonicalURL);
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
    setIsFetchingProductOffers(true);
    // Add more field validation here to skip request on validation failures
    // 
    const variables: any = marketPlaceSelector(
        shopifyProductOfferVariables(
          shopifyStoreCanonicalURL,
          selectedShopifyProductVariant,
          {
            city: data.address.city,
            stateCode: data.address.stateCode,
          }
        ),
        amazonProductOfferVariables(selectedProductID || "", { city: data.address.city, stateCode: data.address.stateCode })
    )
    makeGQLRequest(marketPlaceSelector(shopifyProductOfferQuery, amazonProductOfferQuery), variables)
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

  const onAPIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ apiConfig: { key: e.target.value } });
  };

  const onProductURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ requestedProduct: { productURL: e.target.value } });
  };

  const onStateCodeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateData({ address: { stateCode: e.target.value } });
  };

  const onProductVariantChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log("trigger w/ value: ", e.target.value);
    setSelectedShopifyProductVariant(e.target.value);
  };

  const onMarketplaceChange = (e: any) => {
    const marketplace =
      e.target.innerText.toUpperCase() === Marketplace.Amazon.valueOf().toUpperCase()
        ? Marketplace.Amazon
        : Marketplace.Shopify;
    var otherTabButtons = document.evaluate(
      `//button[contains(., '${e.target.innerText}')]`,
      document,
      null,
      XPathResult.ANY_TYPE,
      null
    );
    let button = otherTabButtons.iterateNext();
    while (button) {
      (button as any).click();
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
        rest={{
          wrapLines: true,
        }}
      ></CustomCodeBlock>
    );
  };

  const onProductIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let update: Partial<Store["requestedProduct"]> = marketPlaceSelector(
      { shopifyProductID: e.target.value },
      { amazonProductID: e.target.value }
    );
    updateData({ requestedProduct: update });
  };

  const onShopifyStoreCanonicalURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShopifyStoreCanonicalURL(e.target.value);
  };

  useDebouncedEffect(
    () => {
      checkRyeAPIKey();
    },
    [data.apiConfig.key],
    500
  );

  const shopifyProductVariantOptions = (): Array<{ id: string; title: string }> | null => {
    if (!fetchProductResponse || !fetchProductResponse.product?.variants) return null;
    return fetchProductResponse.product.variants;
  };

  const shopifyVariants = shopifyProductVariantOptions();

  const initClientSnippet = initializeClientSnippet(data.apiConfig.key || "<RYE_API_KEY>");
  const requestedProductSnippet = requestProductSnippet(
    data.requestedProduct?.productURL || "",
    data.requestedProduct?.selectedMarketplace
  );
  const requestedProductSnippetLineNumber = initClientSnippet.split("\n").length + 1;
  const productFetchSnippet = marketPlaceSelector(
    shopifyProductFetchSnippet(data.requestedProduct.shopifyProductID || ""),
    amazonProductFetchSnippet(data.requestedProduct.amazonProductID || "")
  );
  const productFetchSnippetLineNumber = requestedProductSnippet.split("\n").length + requestedProductSnippetLineNumber;

  const productOfferSnippet = marketPlaceSelector(
    shopifyProductOfferSnippet(
      shopifyStoreCanonicalURL,
      selectedShopifyProductVariant,
      {
        city: "San Francisco",
        stateCode: "CA",
      }
    ),
    amazonProductFetchSnippet(data.requestedProduct.amazonProductID || "")
  );
  const productOfferSnippetLineNumber = productFetchSnippet.split("\n").length + productFetchSnippetLineNumber;

  const shopifyOfferFields = () => (
    <div>
      <Label htmlFor="shopify_store_canonical_url" value="Store Canonical URL" />
      <TextInput
        icon={AtSymbolIcon}
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
        value={selectedProductID || ""}
        icon={AtSymbolIcon}
        className="w-full mt-3"
        id="offers_product_id"
        placeholder={marketPlaceSelector("2863039381604", "B000NQ10FK")}
        onChange={onProductIDChange}
      ></TextInput>
    </div>
  )


  return (
    <div
      className={"flex " + (currentTheme === Theme.Dark ? "dark bg-black text-white" : "bg-light-pastel text-black")}
    >
      <Flowbite
        theme={{
          usePreferences: false,
          theme: {
            card: {
              base: "flex rounded-lg border border-gray-200 text-slate-800 bg-white shadow-md dark:border-gray-700 dark:bg-neutral-900 flex-col",
            },
            tab: {
              tablist: {
                tabitem: {
                  styles: {
                    underline: {
                      active: {
                        on: "text-indigo-600 rounded-t-lg border-b-2 border-indigo-600 active dark:text-rye-lime dark:border-rye-lime",
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
          <h1 className="flex items-center justify-between text-5xl font-200">Rye API Quick Start</h1>
          <h2 className="text-1xl my-2">Try out Rye API to make a purchase from Shopify or Amazon</h2>
          <Timeline>
            <Timeline.Item>
              <Timeline.Content>
                <div className="flex">
                  <Card className="max-w-xl">
                    <Timeline.Point icon={KeyIcon} />
                    <Timeline.Title>Grab your API Key</Timeline.Title>
                    <CustomTimelineBody>
                      <div className="py-3 text">
                        Navigate to{" "}
                        <a className={linkClasses} href="https://console.rye.com">
                          console.rye.com
                        </a>{" "}
                        and grab your API key
                      </div>
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <div className="py-1">Under Access and Security, view and copy your API key</div>
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
                              color={isValidAPIKey ? "success" : "warning"}
                            />
                          ) : null}
                        </div>
                        <span className="text-sm">
                          {isCheckingAPIKey ? "Validating" : isValidAPIKey ? "Connected" : "Offline"}
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
                      <Timeline.Point icon={AtSymbolIcon} />
                      Request an item to be requested by the Rye API
                    </Timeline.Title>
                    <CustomTimelineBody>
                      <div className="py-1">
                        Request an item from Rye to be requested. You can also do this via the
                        <a href="https://console.rye.com/requests" className={linkClasses}>
                          {" "}
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
                            Navigate to{" "}
                            <a target="_blank" href="https://www.amazon.com" className={linkClasses} rel="noreferrer">
                              Amazon
                            </a>{" "}
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
                              {" "}
                              Shopify store
                            </a>{" "}
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
                            icon={AtSymbolIcon}
                            className="w-full"
                            id="item_url"
                            placeholder={marketPlaceSelector(
                              "https://www.some-store.shopify.com/products/cool-product",
                              "https://www.amazon.com/Neosporin-Maximum-Strength-Antibiotic-Protection-Bacitracin/dp/B000NQ10FK"
                            )}
                            onChange={onProductURLChange}
                          ></TextInput>
                          <Button
                            style={{ width: 150, height: 40, maxHeight: 40 }}
                            onClick={requestProduct}
                            className="mx-3"
                            disabled={isRequestingProduct}
                          >
                            {!isRequestingProduct ? "Request" : <Spinner style={{ maxHeight: 30 }} />}
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
                      <Timeline.Point icon={AtSymbolIcon} />
                      <div className="py-1">Once an item is requested, it can be retrieved using the Rye API</div>
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
                            The Amazon Standard identification Number (ASIN) can be used to fetch an item from Amazon.
                            You can find the item ID for an amazon item by using the ID after{" "}
                            <InlineCodeSnippet>dp/</InlineCodeSnippet> in the URL. Example:
                          </div>
                          <span className="text-amber-700">
                            https://amazon.com/neo-sporin/dp/
                            <span className="text-amber-300 bg-red-500 px-2 rounded-lg">B000NQ10FK</span>
                          </span>
                          <div className="mt-3">
                            It is also returned in the response by the{" "}
                            <InlineCodeSnippet>requestProduct</InlineCodeSnippet> mutation.
                          </div>
                        </Tabs.Item>
                        <Tabs.Item
                          title="Shopify"
                          active={data.requestedProduct.selectedMarketplace === Marketplace.Shopify}
                        >
                          <div className="py-3">
                            The Shopify product ID can be found in the response of the{" "}
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
                          icon={AtSymbolIcon}
                          className="my-3 w-full"
                          id="marketplace_request"
                          value={data.requestedProduct.selectedMarketplace}
                        ></TextInput>
                        <Timeline.Point />
                        <Label htmlFor="fetch_product_id" value="Enter product ID" className="mt-10" />
                        <div className="flex my-3">
                          <TextInput
                            value={selectedProductID || ""}
                            icon={AtSymbolIcon}
                            className="w-full"
                            id="fetch_product_id"
                            placeholder={marketPlaceSelector("2863039381604", "B000NQ10FK")}
                            onChange={onProductIDChange}
                          ></TextInput>
                          <Button
                            style={{ width: 150, height: 40, maxHeight: 40 }}
                            onClick={fetchProduct}
                            className="mx-3"
                            disabled={isFetchingProduct}
                          >
                            {!isFetchingProduct ? "Fetch" : <Spinner style={{ maxHeight: 30 }} />}
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
                      <Timeline.Point icon={AtSymbolIcon} />
                      <div className="py-1">
                        You can use the offers query to display a sample checkout for the item. This is useful for
                        showing estimated taxes, and any shipping costs
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
                              icon={AtSymbolIcon}
                              className="w-64 mt-3"
                              id="city"
                              onChange={onProductIDChange}
                              value={data.address.city}
                              placeholder="San Francisco"
                            ></TextInput>
                          </div>
                          <div className="ml-3">
                            <Label className="mt-3" htmlFor="product_id_offers" value="State" />
                            <Select onChange={onStateCodeChange} value={data.address.stateCode} className="mt-3 w-24">
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
                              {!isFetchingProductOffers ? "Fetch" : <Spinner style={{ maxHeight: 30 }} />}
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
          </Timeline>
        </div>
      </Flowbite>
    </div>
  );
}
