import { useState } from "react";
import ApiKeyDarkImage from "./rye-api-key-dark.png";
import ApiKeyLightImage from "./rye-api-key-light.png";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { Button, Card, Flowbite, Label, Select, Spinner, Tabs, TextInput, Timeline } from "flowbite-react";
import { KeyIcon,AtSymbolIcon } from '@heroicons/react/24/solid'
import { TimelineBody } from "flowbite-react/lib/esm/components/Timeline/TimelineBody";
import SyntaxHighlighter from "react-syntax-highlighter";
import { amazonProductFetchSnippet, initializeClientSnippet, requestProductSnippet } from "./code_snippets";
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { json } from "stream/consumers";
import { mergeDeep } from "../../utils/merge";



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
  theme: Theme;
  apiConfig: APIConfiguration;
  requestedProduct: {
    productURL: string;
    shopifyProductID?: string;
    amazonProductID?: string; 
    selectedMarketplace: Marketplace;
  }
};

function detectThemePreference(): Theme {
  const setTheme = window.localStorage?.getItem("theme");
  if (setTheme) {
    return JSON.parse(setTheme) as Theme;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? Theme.Dark : Theme.Light;
}

const defaultStore: Store = {
  apiConfig: JSON.parse(window.localStorage?.getItem("apiConfig") || "{}"),
  theme: detectThemePreference(),
  requestedProduct: JSON.parse(window.localStorage?.getItem("requestedProduct") || JSON.stringify({shopifyProductID: "", amazonProductID: "", selectedMarketplace: Marketplace.Amazon, productURL: ""})),
};

const codeSnippetClasses = "text-slate-500 dark:bg-neutral-700 border dark:border-neutral-500 dark:text-amber-200 px-1";
const linkClasses = "text-indigo-500 dark:text-rye-lime"


function CustomTimelineBody(props: any) {
  return <TimelineBody className="text-slate-600 dark:text-slate-200">
    {props.children}
  </TimelineBody>
}

function CustomCodeBlock({codeString, dataTheme}: {codeString: string, dataTheme: Theme}) {
  const theme = dataTheme === Theme.Dark.valueOf().valueOf() ? atomOneDark : atomOneLight
  const themeOverrides: { [key: string]: React.CSSProperties } = { 
    "hljs": { background: "transparent" },
  }
  return (
    <SyntaxHighlighter 
      codeTagProps={{
        style: {
          fontSize: "0.8rem",
        }
        // className: ""

      }}
    language="javascript"
    style={{
      ...theme,
      ...themeOverrides,
    }}>
      {codeString}
    </SyntaxHighlighter>
  )
}


export default function Index() {
  const [ data, setData ] = useState<Store>(defaultStore);
  const [ isTrackingProduct, setIsTrackingProduct ] = useState(false);
  const [ isFetchingProduct, setIsFetchingProduct ] = useState(false);

  function updateData(data: Store) {
    setData(data)
    let key: keyof Store
    for(key in data) {
      window.localStorage?.setItem(key, JSON.stringify(data[key]));
    }
  }

  const onChangeTheme = (checked: boolean) => {
    const theme = checked ? Theme.Dark : Theme.Light;
    window.localStorage?.setItem("theme", theme);
    updateData({ ...data, theme });
  }

  const trackProduct = () => {
    setIsTrackingProduct(true);
    setTimeout(() => {
      setIsTrackingProduct(false);
    }, 3000)
  }

  const fetchProduct = () => {
    setIsFetchingProduct(true);
    setTimeout(() => {
      setIsFetchingProduct(false);
    }, 3000)
  }

  const onAPIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData: Store = mergeDeep(data, { apiConfig: { key: e.target.value } });
    updateData(newData)
  }

  const onProductURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData: Store = mergeDeep(data, {
        requestedProduct: {
          productURL: e.target.value,
        }
    });
    updateData(newData)
  }

  const onTabChange = (e: any) => {
    console.log(e)
  }

  const onProductIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData: Store = mergeDeep(data, {
      requestedProduct: {
        id: e.target.value,
      }
    });
    updateData(newData)
  }

  const productFetchSnippet = amazonProductFetchSnippet(data.apiConfig?.key || "")

  return (
    <div className={"flex " + (data.theme === Theme.Dark.valueOf() ? "dark bg-black text-white" : "bg-light-pastel text-black")}>
      <Flowbite
        theme={{
          theme: {
            card: {
              base: "flex rounded-lg border border-gray-200 text-slate-800 bg-white shadow-md dark:border-gray-700 dark:bg-neutral-900 flex-col"
            },
            tab: {
              tablist: {
                tabitem: {
                  styles: {
                    underline: {
                      // base: "bg-slate-600 dark:bg-slate-200",
                      active: {
                        // off: "bg-slate-600 dark:bg-slate-200",
                        on: "text-indigo-600 rounded-t-lg border-b-2 border-indigo-600 active dark:text-rye-lime dark:border-rye-lime",
                      }
                       
                    }
                  }
                
                }
              }
            },
          }
        }}>
        <div className="mx-10 mt-5">
          <div className="flex items-center justify-end font-200">
            <DarkModeSwitch checked={data.theme === Theme.Dark.valueOf()} onChange={onChangeTheme}/>
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
                      <div className="py-3 text">Navigate to <a className={linkClasses} href="https://console.rye.com">console.rye.com</a> and grab your API key</div>
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <div className="py-1">Under Access and Security, view and copy your API key</div>
                      <img src={data.theme === Theme.Dark.valueOf() ? ApiKeyDarkImage : ApiKeyLightImage} alt="API Key" className="border rounded border-slate-200 dark:border-rye-lime" />
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                    <Timeline.Point />
                      <div className="py-1">
                        <Label
                          htmlFor="api_key"
                          value="Enter your RYE API key"
                        />
                        <TextInput defaultValue={data?.apiConfig.key} icon={KeyIcon} id="api_key" className="mt-3" placeholder="RYE-abcdef" onChange={onAPIKeyChange} />  
                      </div>
                    </CustomTimelineBody>
                  </Card>
                  <div className="mx-3">
                    <CustomCodeBlock dataTheme={data.theme} key={data?.apiConfig.key} codeString={initializeClientSnippet(data?.apiConfig.key || "")}></CustomCodeBlock>
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
                      <div className="py-1">Request an item from Rye to be tracked. You can also do this via the<a href="https://console.rye.com/requests" className={linkClasses}> Rye Console</a></div>
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <Tabs.Group
                        aria-label="Full width tabs"
                        style="underline"  
                        onChange={onTabChange}
                      >
                        <Tabs.Item title="Amazon" active={data.requestedProduct.selectedMarketplace === Marketplace.Amazon}>
                          <span className="py-3">Navigate to <a target="_blank" href="https://www.amazon.com" className={linkClasses}>Amazon</a> and find an item you want to track, and copy the URL</span>
                        </Tabs.Item>
                        <Tabs.Item title="Shopify" active={data.requestedProduct.selectedMarketplace === Marketplace.Shopify}>
                          <span className="py-3">Navigate to any<a target="_blank" href="https://rye-test-store.myshopify.com/" className={linkClasses}> Shopify store</a> and find an item you want to track, and copy the URL</span>
                        </Tabs.Item>
                      </Tabs.Group>
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                    <Timeline.Point />
                    <div className="py-1">
                      <Label
                        htmlFor="item_url"
                        value="Enter product URL"
                      />
                      <div className="flex py-3">
                        <TextInput icon={AtSymbolIcon} className="w-full" id="item_url" placeholder="https://www.amazon.com/Neosporin-Maximum-Strength-Antibiotic-Protection-Bacitracin/dp/B000NQ10FK/" onChange={onProductURLChange}></TextInput>
                        <Button style={{width: 150, height: 40, maxHeight: 40}} onClick={trackProduct} className="mx-3">
                          {
                            !!!isTrackingProduct ? "Track" : <Spinner style={{maxHeight: 30}}/>
                          }
                        </Button>
                      </div>
                    </div>
                    </CustomTimelineBody>
                  </Card>
                  <div className="mx-3">
                    <CustomCodeBlock dataTheme={data.theme} codeString={requestProductSnippet(data.requestedProduct?.productURL || "", data.requestedProduct?.selectedMarketplace  )}></CustomCodeBlock>
                  </div>
                </div>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Content>
                <div className="flex">
                  <Card className="max-w-xl">
                    <Timeline.Title>
                      Fetch the item from the Rye API
                    </Timeline.Title>
                    <CustomTimelineBody>
                      <Timeline.Point icon={AtSymbolIcon} />
                      <div className="py-1">Once an item is tracked, it can be retrieved using the Rye API</div>
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                      <Timeline.Point />
                      <Tabs.Group
                        aria-label="Full width tabs"
                        style="underline"
                        onChange={onTabChange}
                      >
                        <Tabs.Item title="Amazon" active={data.requestedProduct.selectedMarketplace === Marketplace.Amazon}>
                          <div className="py-3">The Amazon Standard identification Number (ASIN) can be used to fetch an item from Amazon. You can find the item ID for an amazon item by using the ID after <span className={codeSnippetClasses}>dp/</span> in the URL</div>
                          <span className="text-amber-700">https://amazon.com/neo-sporin/dp/<span className="text-amber-300 bg-red-500 px-2 rounded-lg">B000NQ10FK</span></span>
                        </Tabs.Item>
                        <Tabs.Item title="Shopify" active={data.requestedProduct.selectedMarketplace === Marketplace.Shopify}>
                          <div className="py-3">The Shopify product ID can be found by navigating to the product URL and and suffixing the product URL with <span className={codeSnippetClasses}>/product.json</span> Example: </div>
                          <a className={linkClasses} target="_blank" href="https://rye-test-store.myshopify.com/products/test-digital-product/product.json">https://rye-test-store.myshopify.com/products/test-digital-product/product.json</a>
                          <div className="mt-3">The item above has the product ID: <span className={codeSnippetClasses}>6806717890647</span></div>
                        </Tabs.Item>
                      </Tabs.Group>
                    </CustomTimelineBody>
                    <CustomTimelineBody>
                    <div className="">
                      <Label
                        htmlFor="marketplace"
                        value="Marketplace"
                      />
                      <TextInput disabled icon={AtSymbolIcon} className="my-3 w-full" id="marketplace" value={data.requestedProduct.selectedMarketplace}></TextInput>
                      <Timeline.Point />
                      <Label
                        htmlFor="item_id"
                        value="Enter product ID"
                        className="mt-10"
                      />
                      <div className="flex my-3">
                        <TextInput icon={AtSymbolIcon} className="w-full" id="item_id" placeholder="B000NQ10FK" onChange={onProductIDChange}></TextInput>
                        <Button style={{width: 150, height: 40, maxHeight: 40}} onClick={fetchProduct} className="mx-3">
                          {
                            !!!isFetchingProduct ? "Fetch" : <Spinner style={{maxHeight: 30}}/>
                          }
                        </Button>
                      </div>
                    </div>
                    </CustomTimelineBody>
                  </Card>
                  <div className="mx-3">
                    <CustomCodeBlock dataTheme={data.theme} codeString={productFetchSnippet}></CustomCodeBlock>
                  </div>
                </div>
              </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
              <Timeline.Content>
                <Card className="max-w-xl">
                  <Timeline.Title>
                    Fetch offers on the item from the Rye API
                  </Timeline.Title>
                  <CustomTimelineBody>
                    <Timeline.Point icon={AtSymbolIcon} />
                    <div className="py-1">You can use the offers query to display a sample checkout for the item. This is useful for showing estimated taxes, and any shipping costs</div>
                  </CustomTimelineBody>
                  <CustomTimelineBody>
                  <Timeline.Point />
                  <div className="">
                    <Label
                      htmlFor="marketplace"
                      value="Marketplace"
                    />
                    <Select className="my-3" defaultValue="Amazon">
                      <option value="Amazon">Amazon</option>
                      <option value="Shopify">Shopify</option>
                    </Select>
                    <Label
                      htmlFor="product_id_offers"
                      value="Enter product ID"
                    />
                    <div className="flex py-3">
                      <TextInput icon={AtSymbolIcon} className="w-full" id="product_id_offers" placeholder="B000NQ10FK" onChange={onProductIDChange}></TextInput>
                      <Button style={{width: 150, height: 40, maxHeight: 40}} onClick={fetchProduct} className="mx-3">
                        {
                          !!!isFetchingProduct ? "Fetch" : <Spinner style={{maxHeight: 30}}/>
                        }
                      </Button>
                    </div>
                  </div>
                  </CustomTimelineBody>
                </Card>
              </Timeline.Content>
            </Timeline.Item>
          </Timeline>
        </div>
      </Flowbite>
    </div>
  );
}
