import FetchProductScreenV2 from '../../../assets/fetch-product-v2.png';
import { InlineCodeSnippet } from '../helper-components/InlineCodeSnippet';
import ListItem from '../styled-components/list-item';
import Input from '../styled-components/input';
import { useContext, useState } from 'react';
import { TutorialContext } from '../constants';
import { productFetchVariables } from '../CodeSnippets/code_snippets';
import { MarketplaceEnum } from '../types';
import TerminalTab from '../styled-components/code-terminal-tab';
import { amazonProductFetchSnippet, shopifyProductFetchSnippet } from '../CodeSnippets/code_snippets';
import Terminal from '../styled-components/code-terminal';
import { Spinner } from 'flowbite-react';

export default function FetchProduct() {
  const context = useContext(TutorialContext);
  const {
    fetchProduct: {
      fetchProductCallback,
      fetchProductData,
      fetchProductLoading,
      setCurrentFetchedProductId,
      currentFetchedProductId,
      fetchProductError,
    },
    authHeaders: { currentAuthHeaders },
  } = context;
  const [fetchError, setFetchError] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState<MarketplaceEnum>(MarketplaceEnum.Shopify);
  const amazonProductId = 'B08KHY1PKR';
  const shopifyProductId = '7074033139917';
  const amazonFetchSnippet = amazonProductFetchSnippet(amazonProductId);
  const shopifyFetchSnippet = shopifyProductFetchSnippet(shopifyProductId);
  const prettyJSON = JSON.stringify(fetchProductData, null, 2);

  const isAmazonId = (id: string | undefined) => !id ? true : /\D/.test(id); // Amazon IDs contain characters
  const selectedProductId = selectedMarketplace === MarketplaceEnum.Amazon ? amazonProductId : shopifyProductId;

  return (
    <section>
      <div className="mb-[12px] flex">
        <h2 className="mr-[8px] text-heading-small font-bold">Example</h2>
      </div>
      <img className="mb-[12px]" src={FetchProductScreenV2} alt="API Key" />
      <p className="mb-[48px]">
        In a product page, we can use the{' '}
        <InlineCodeSnippet version="v2">product</InlineCodeSnippet> query to fetch product
        information such as name, description, price, and any images associated with the product.
      </p>
      <h3 className="mb-[24px] text-heading-small font-bold">How it works</h3>
      <ol className="list-inside list-decimal text-paragraph-medium font-semibold">
        <ListItem content="Locate the item ID for a product on Amazon or Shopify">
          <p className="text-paragraph-small font-normal">
            The Amazon Standard identification Number (ASIN) can be used. You can find the item ID
            for an amazon item by using the ID after dp/ in the URL. (Ex:
            https://amazon.com/neo-sporin/dp/<span className="font-semibold">B000NQ10FK</span>)
          </p>
          <p className="mb-[24px] text-paragraph-small font-normal">
            It is also returned in the response by the{' '}
            <InlineCodeSnippet version="v2redText">requestProduct</InlineCodeSnippet> mutation.
          </p>
          <p className="mb-[24px] text-paragraph-small font-normal">
            The Shopify product ID can be found in the response of the{' '}
            <InlineCodeSnippet version="v2redText">requestProduct</InlineCodeSnippet> mutation.
          </p>
          <div className="flex w-3/4 items-center">
            <Input
              value={selectedProductId}
              internalLabel="Sample product ID"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedProductId);
              }}
              className="mx-3 rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green"
            >
              Copy
            </button>
          </div>
        </ListItem>
        <ListItem content="Use the item ID in the following function to fetch product info">
          <Terminal onTabChange={(tabIndex) => tabIndex === 0 ? setSelectedMarketplace(MarketplaceEnum.Shopify) : setSelectedMarketplace(MarketplaceEnum.Amazon)}>
            <TerminalTab label="shopify.js" code={shopifyFetchSnippet} selected={selectedMarketplace === MarketplaceEnum.Shopify} />
            <TerminalTab label="amazon.js" code={amazonFetchSnippet} selected={selectedMarketplace === MarketplaceEnum.Amazon}/>
          </Terminal>
        </ListItem>
        <ListItem content="Run the function to fetch product information, prices, and more.">
          <p className="mb-[4px] font-poppins text-paragraph-small font-normal">
            Try out our tool below, which fetches product information from Amazon or Shopify based
            on a specific product ID. It's a demo we created for you to experiment with.
          </p>
          <div className="flex">
            <Input
              onChange={(e) => {
                setCurrentFetchedProductId && setCurrentFetchedProductId(e.target.value);
                setSelectedMarketplace(isAmazonId(e.target.value) ? MarketplaceEnum.Amazon : MarketplaceEnum.Shopify);
              }}
              internalLabel="Product ID"
              value={currentFetchedProductId}
            />
            <button
              onClick={() => {
                if (fetchProductCallback && currentAuthHeaders && currentFetchedProductId) {
                  fetchProductCallback(
                    currentAuthHeaders,
                    productFetchVariables(currentFetchedProductId, selectedMarketplace),
                  );
                  setFetchError(false);
                } else {
                  setFetchError(true);
                }
              }}
              className="my-[6px] mx-3 rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green"
            >
              {fetchProductLoading ? <Spinner/> : "Fetch"}
            </button>
          </div>
          {(fetchError || fetchProductError) && (
            <p className="mb-[4px] text-paragraph-small font-normal text-alerts-danger">
              There was an issue with the request. Please double check your Rye API key connection
              within the 'Obtaining Rye API key' step and that the product ID above is properly
              copied.
            </p>
          )}
          {fetchProductData && <Terminal><TerminalTab label="JSON" code={prettyJSON} language="json" /></Terminal>}
        </ListItem>
      </ol>
    </section>
  );
}
