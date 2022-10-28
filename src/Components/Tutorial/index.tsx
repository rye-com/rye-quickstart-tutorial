import { useEffect, useState } from "react";
import ApiKeyDarkImage from "./rye-api-key-dark.png";
import ApiKeyLightImage from "./rye-api-key-light.png";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { Badge, Button, Card, Flowbite, Label, Select, Spinner, Tabs, TextInput, Timeline } from "flowbite-react";
import { KeyIcon, AtSymbolIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import SyntaxHighlighter from "react-syntax-highlighter";
import { amazonProductFetchQuery, amazonProductFetchSnippet, initializeClientSnippet, requestProductQuery, requestProductSnippet, shopifyProductFetchQuery, shopifyProductFetchSnippet, shopifyProductOfferSnippet } from "./code_snippets";
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { cloneDeep, merge } from "lodash";
import { GraphQLClient } from 'graphql-request';

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
  theme: string;
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
  }
};

function detectThemePreference(): string {
  const setTheme = window.localStorage?.getItem("theme");
  if (setTheme) {
    return JSON.parse(setTheme);
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return JSON.stringify(prefersDark ? Theme.Dark.valueOf() : Theme.Light.valueOf());
}

const defaultStore: Store = {
  apiConfig: JSON.parse(window.localStorage?.getItem("apiConfig") || "{}"),
  theme: detectThemePreference(),
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
  )
};


const codeSnippetClasses = "text-slate-500 dark:bg-neutral-700 border dark:border-neutral-500 dark:text-amber-200 px-1";
const linkClasses = "text-indigo-500 dark:text-rye-lime";

function CustomTimelineBody(props: any) {
  return <div className="text-slate-600 dark:text-slate-200">{props.children}</div>;
}

function CustomCodeBlock({ codeString, dataTheme, language = "javascript", showLineNumbers = false, startingLineNumber = 1, style = {}, ...rest }: { language?: string, codeString: string; dataTheme: Theme, showLineNumbers?: boolean, startingLineNumber?: number, rest?: any, style?: React.CSSProperties }) {
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

export const useDebouncedEffect = (effect: any, deps: Array<any>, delay: number) => {
  useEffect(() => {
      const handler = setTimeout(() => effect(), delay);

      return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
}

export default function Index() {
  const [data, setData] = useState<Store>(defaultStore);
  const [isTrackingProduct, setIsTrackingProduct] = useState<boolean>(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFetchingProductOffers, setIsFetchingProductOffers] = useState<boolean>(false);
  const [trackProductResponse, setTrackProductResponse] = useState<object | null>(null);
  const [fetchProductResponse, setFetchProductResponse] = useState<object | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fetchProductOffersResponse, setFetchProductOffersResponse] = useState<object | null>(null);
  const [isValidAPIKey, setIsValidAPIKey] = useState<boolean>(false);
  const [isCheckingAPIKey, setIsCheckingAPIKey] = useState<boolean>(data?.apiConfig.key?.length !== 0 || false);

  const currentTheme = data.theme === Theme.Dark.valueOf() ? Theme.Dark : Theme.Light;

  const makeGQLRequest = (query: string, variables: any) => {
    const client = new GraphQLClient('https://graphql.api.rye.com/v1/query');
    const headers = {
      'Authorization': 'Basic ' + btoa(data.apiConfig.key + ':'),
    };
    return client.request(query, variables, headers)
  }

  const checkRyeAPIKey = () => {
    if(!data.apiConfig.key || data.apiConfig.key.length === 0) {
      setIsCheckingAPIKey(false);
      return
    }
    setIsCheckingAPIKey(true);
    const variables = {
      input: {
        id: "B073K14CVB",
        marketplace: "AMAZON",
      },
    };
    makeGQLRequest(amazonProductFetchQuery, variables).then((result) => {
      setIsValidAPIKey(true);
    }).catch((error) => {
      setIsValidAPIKey(false);
    }).finally(() => {
      setIsCheckingAPIKey(false)
    });
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
    updateData({ theme });
  };

  const trackProduct = () => {
    setIsTrackingProduct(true);
    const variables = {
      input: {
          url: data.requestedProduct.productURL,
          marketplace: data.requestedProduct.selectedMarketplace.valueOf().toUpperCase(),
      }
    };
    makeGQLRequest(requestProductQuery, variables).then((res) => {
      setTrackProductResponse(res);
      let requestedProduct: Partial<Store["requestedProduct"]> = {}
      if(data.requestedProduct.selectedMarketplace === Marketplace.Shopify) {
        requestedProduct["shopifyProductID"] = res["requestProductByURL"].productID;
      } else {
        requestedProduct["amazonProductID"] = res["requestProductByURL"].productID;
      }
      updateData({ requestedProduct: requestedProduct });
    }).catch((error) => {
      // TODO: test this path
      setTrackProductResponse(error);
    }).finally(() => {
      setIsTrackingProduct(false);
    });
  };

  const fetchProduct = () => {
    setIsFetchingProduct(true);
    const variables = {
      input: {
          id: data.requestedProduct.selectedMarketplace === Marketplace.Shopify ? data.requestedProduct.shopifyProductID : data.requestedProduct.amazonProductID,
          marketplace: data.requestedProduct.selectedMarketplace.valueOf().toUpperCase(),
      }
    };
    makeGQLRequest(data.requestedProduct.selectedMarketplace === Marketplace.Shopify ? shopifyProductFetchQuery : amazonProductFetchQuery, variables).then((res) => {
      setFetchProductResponse(res);
    }).catch((error) => {
    }).finally(() => {
      setIsFetchingProduct(false);
    });
  };

  // const fetchProductOffers = () => {
  //   setIsFetchingProductOffers(true);
  //   const variables = {
  //     input: {
  //         id: data.requestedProduct.selectedMarketplace === Marketplace.Shopify ? data.requestedProduct.shopifyProductID : data.requestedProduct.amazonProductID,
  //         marketplace: data.requestedProduct.selectedMarketplace.valueOf().toUpperCase(),
  //     }
  //   };
  //   makeGQLRequest(amazonProductFetchQuery, variables).then((res) => {
  //     setFetchProductResponse(res);
  //   }).catch((error) => {
  //   }).finally(() => {
  //     setIsFetchingProductOffers(false);
  //   });
  // };

  const onAPIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ apiConfig: { key: e.target.value } }, )
  };

  const onProductURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ requestedProduct: { productURL: e.target.value } });
  };

  const onMarketplaceChange = (e: any) => {
    // console.log(Object.keys(Marketplace));
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
    if(!resp) {
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
  }

  const onProductIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let update: Partial<Store["requestedProduct"]> = {};
    if (data.requestedProduct.selectedMarketplace === Marketplace.Amazon) {
      update = { amazonProductID: e.target.value };
    } else if (data.requestedProduct.selectedMarketplace === Marketplace.Shopify) {
      update = { shopifyProductID: e.target.value };
    }
    updateData({ requestedProduct: update });
  };

  useDebouncedEffect(() => {
    checkRyeAPIKey();
  }, [data.apiConfig.key], 500);

  const initClientSnippet = initializeClientSnippet(data.apiConfig.key || "")
  const requestedProductSnippet = requestProductSnippet(
    data.requestedProduct?.productURL || "",
    data.requestedProduct?.selectedMarketplace
  )
  const requestedProductSnippetLineNumber = initClientSnippet.split("\n").length + 1;
  const productFetchSnippet = data.requestedProduct.selectedMarketplace === Marketplace.Shopify ? shopifyProductFetchSnippet(data.requestedProduct.shopifyProductID || "") : amazonProductFetchSnippet(data.requestedProduct.amazonProductID || "");
  const productFetchSnippetLineNumber = requestedProductSnippet.split("\n").length + requestedProductSnippetLineNumber;

  const productOfferSnippet = data.requestedProduct.selectedMarketplace === Marketplace.Shopify ? shopifyProductOfferSnippet(data.requestedProduct.shopifyProductID || "", {
    city: "San Francisco",
    stateCode: "CA",
  }) : amazonProductFetchSnippet(data.requestedProduct.amazonProductID || "");
  const productOfferSnippetLineNumber = productFetchSnippet.split("\n").length + productFetchSnippetLineNumber;

  return (
    <div
      className={
        "flex " + (currentTheme === Theme.Dark ? "dark bg-black text-white" : "bg-light-pastel text-black")
      }
    >
      <Flowbite
        theme={{
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
                          {!isCheckingAPIKey ? <Badge
                            className="h-full w-full flex justify-center"
                            icon={isValidAPIKey ? CheckIcon : XMarkIcon}
                            color={isValidAPIKey ? "success" : "warning"}
                          /> : null}
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
                      Request an item to be tracked by the Rye API
                    </Timeline.Title>
                    <CustomTimelineBody>
                      <div className="py-1">
                        Request an item from Rye to be tracked. You can also do this via the
                        <a href="https://console.rye.com/requests" className={linkClasses}> Rye Console</a>
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
                            and find an item you want to track, and copy the URL
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
                            > Shopify store</a>{" "}
                            and find an item you want to track, and copy the URL
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
                            placeholder="https://www.amazon.com/Neosporin-Maximum-Strength-Antibiotic-Protection-Bacitracin/dp/B000NQ10FK/"
                            onChange={onProductURLChange}
                          ></TextInput>
                          <Button
                            style={{ width: 150, height: 40, maxHeight: 40 }}
                            onClick={trackProduct}
                            className="mx-3"
                            disabled={isTrackingProduct}
                          >
                            {!isTrackingProduct ? "Track" : <Spinner style={{ maxHeight: 30 }} />}
                          </Button>
                        </div>
                        {trackProductResponse ? <div className="rounded-lg p-4 border border-gray-300 dark:border-gray-800">{prettifiedJSONResponse(trackProductResponse)}</div> : null}
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
                      <div className="py-1">Once an item is tracked, it can be retrieved using the Rye API</div>
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
                          <div className="py-3">
                            The Amazon Standard identification Number (ASIN) can be used to fetch an item from Amazon.
                            You can find the item ID for an amazon item by using the ID after{" "}
                            <span className={codeSnippetClasses}>dp/</span> in the URL
                          </div>
                          <span className="text-amber-700">
                            https://amazon.com/neo-sporin/dp/
                            <span className="text-amber-300 bg-red-500 px-2 rounded-lg">B000NQ10FK</span>
                          </span>
                        </Tabs.Item>
                        <Tabs.Item
                          title="Shopify"
                          active={data.requestedProduct.selectedMarketplace === Marketplace.Shopify}
                        >
                          <div className="py-3">
                            The Shopify product ID can be found by navigating to the product URL and and suffixing the
                            product URL with <span className={codeSnippetClasses}>/product.json</span> Example:{" "}
                          </div>
                          <a
                            className={linkClasses}
                            target="_blank"
                            href="https://rye-test-store.myshopify.com/products/test-digital-product/product.json"
                            rel="noreferrer"
                          >
                            https://rye-test-store.myshopify.com/products/test-digital-product/product.json
                          </a>
                          <div className="mt-3">
                            The item above has the product ID: <span className={codeSnippetClasses}>6806717890647</span>
                          </div>
                        </Tabs.Item>
                      </Tabs.Group>
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                      <div className="">
                        <Label htmlFor="marketplace_request" value="Marketplace" />
                        <TextInput
                          disabled
                          icon={AtSymbolIcon}
                          className="my-3 w-full"
                          id="marketplace_request"
                          value={data.requestedProduct.selectedMarketplace}
                        ></TextInput>
                        <Timeline.Point />
                        <Label htmlFor="item_id" value="Enter product ID" className="mt-10" />
                        <div className="flex my-3">
                          <TextInput
                            value={
                              (data.requestedProduct.selectedMarketplace === Marketplace.Amazon
                                ? data.requestedProduct.amazonProductID
                                : data.requestedProduct.shopifyProductID) || ""
                            }
                            icon={AtSymbolIcon}
                            className="w-full"
                            id="item_id"
                            placeholder={data.requestedProduct.selectedMarketplace === Marketplace.Amazon ? "B000NQ10FK" : "2863039381604"}
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
                        {fetchProductResponse ? <div className="overflow-x-scroll rounded-lg p-4 border border-gray-300 dark:border-gray-800">{prettifiedJSONResponse(fetchProductResponse)}</div> : null}
                      </div>
                    </CustomTimelineBody>
                  </Card>
                  <div className="mx-3 max-w-xl overflow-scroll">
                    <CustomCodeBlock
                      showLineNumbers={true} startingLineNumber={productFetchSnippetLineNumber} dataTheme={currentTheme} codeString={productFetchSnippet}></CustomCodeBlock>
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
                        You can use the offers query to display a sample checkout for the item. This is useful for showing
                        estimated taxes, and any shipping costs
                      </div>
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <div className="">
                        <Label htmlFor="marketplace_fetch" value="Marketplace" />
                        <TextInput
                            disabled
                            icon={AtSymbolIcon}
                            className="my-3 w-full"
                            id="marketplace_fetch"
                            value={data.requestedProduct.selectedMarketplace}
                          ></TextInput>
                        <Label htmlFor="product_id_offers" value="Enter product ID" />
                        <TextInput
                          icon={AtSymbolIcon}
                          className="w-full mt-3"
                          id="product_id_offers"
                          onChange={onProductIDChange}
                          value={
                            (data.requestedProduct.selectedMarketplace === Marketplace.Amazon
                              ? data.requestedProduct.amazonProductID
                              : data.requestedProduct.shopifyProductID) || ""
                          }
                          placeholder={data.requestedProduct.selectedMarketplace === Marketplace.Amazon ? "B000NQ10FK" : "2863039381604"}
                        ></TextInput>
                        <div className="flex mt-3">
                          <div>
                            <Label htmlFor="city" value="City" />
                            <TextInput
                              icon={AtSymbolIcon}
                              className="w-64 mt-3"
                              id="city"
                              onChange={onProductIDChange}
                              value={
                                (data.requestedProduct.selectedMarketplace === Marketplace.Amazon
                                  ? data.requestedProduct.amazonProductID
                                  : data.requestedProduct.shopifyProductID) || ""
                              }
                              placeholder="San Francisco"
                            ></TextInput>
                          </div>
                          <div className="ml-3">
                            <Label className="mt-3" htmlFor="product_id_offers" value="State" />
                            <Select className="mt-3 w-24">
                              <option value="AL">AL</option>
                              <option value="AK">AK</option>
                              <option value="AR">AR</option>
                              <option value="AZ">AZ</option>
                              <option selected value="CA">CA</option>
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
                              onClick={fetchProduct}
                              className="self-end mx-3"
                              disabled={isFetchingProduct}
                            >
                              {!isFetchingProduct ? "Fetch" : <Spinner style={{ maxHeight: 30 }} />}
                            </Button>
                          </div>
                        </div>
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
