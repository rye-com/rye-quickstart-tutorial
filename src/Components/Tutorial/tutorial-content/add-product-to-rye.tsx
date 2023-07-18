import { useContext, useState } from 'react';
import { getNextRandomProduct } from "../utils/getNextRandomProduct";
import { InlineCodeSnippet } from '../helper-components/InlineCodeSnippet';
import { TutorialContext } from '../constants';
import { requestProductSnippet, requestProductVariables } from '../CodeSnippets/code_snippets';
import { MarketplaceEnum } from '../types';
import { Spinner } from 'flowbite-react';
import Input from '../styled-components/input';
import ListItem from '../styled-components/list-item';
import TerminalTab from '../styled-components/code-terminal-tab';
import Terminal from '../styled-components/code-terminal';

const amazonProduct = getNextRandomProduct(MarketplaceEnum.Amazon);
const shopifyProduct = getNextRandomProduct(MarketplaceEnum.Shopify);
const requestProductAmazonCodeSnippet = requestProductSnippet(amazonProduct.productURL, amazonProduct.selectedMarketplace);
const requestProductShopifyCodeSnippet = requestProductSnippet(shopifyProduct.productURL, shopifyProduct.selectedMarketplace);

export default function AddProductToRye() {
  const context = useContext(TutorialContext);
  const {
    requestProduct: {
      requestProductCallback,
      requestProductData,
      requestProductError,
      currentRequestedProductURL,
      requestProductLoading,
      setCurrentRequestedProductURL,
    },
    authHeaders: { currentAuthHeaders },
  } = context;
  const [fetchError, setFetchError] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState<MarketplaceEnum>(MarketplaceEnum.Shopify);
  const selectedProductUrl = selectedMarketplace === MarketplaceEnum.Amazon ? amazonProduct.productURL : shopifyProduct.productURL;
  const marketplace = selectedMarketplace.charAt(0).toUpperCase() + selectedMarketplace.slice(1).toLowerCase();
  const requestProductDataOutputJSON = JSON.stringify(requestProductData, null, 2);

  const onClickFetch = () => {
    if (requestProductCallback && currentAuthHeaders && currentRequestedProductURL) {
      const marketplace = currentRequestedProductURL?.includes(MarketplaceEnum.Amazon.toLowerCase()) ?
          MarketplaceEnum.Amazon : MarketplaceEnum.Shopify;

      requestProductCallback(
          currentAuthHeaders,
          requestProductVariables(currentRequestedProductURL, marketplace),
      );
      setFetchError(false);
    } else {
      setFetchError(true);
    }
  }

  return (
      <section>
        <h3 className="mb-[24px] text-heading-small font-bold">How it works</h3>
        <ol className="list-inside list-decimal text-paragraph-medium font-semibold">
          <ListItem content="Copy the URL from an Amazon or Shopify product page">
            <div className="flex w-3/4 items-center mt-[4px]">
              <Input
                  value={selectedProductUrl}
                  internalLabel="Sample product URL"
              />
              <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedProductUrl);
                  }}
                  className="mx-3 rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green"
              >
                Copy
              </button>
            </div>
          </ListItem>
          <ListItem content="Use the URL in the addProduct mutation">
            <p className="text-paragraph-small font-normal mt-[4px] mb-[8px]">
              Add an external product to Rye inventory using the{' '}
              <InlineCodeSnippet version="v2redText">addProduct</InlineCodeSnippet> mutation.
              You can use the product ID returned by this mutation to fetch product data.
              You can also do this via the Rye Console.
            </p>
            <Terminal onTabChange={(tabIndex) => tabIndex === 0 ? setSelectedMarketplace(MarketplaceEnum.Shopify) : setSelectedMarketplace(MarketplaceEnum.Amazon)}>
              <TerminalTab label="shopify.js" code={requestProductShopifyCodeSnippet} selected={selectedMarketplace === MarketplaceEnum.Shopify}/>
              <TerminalTab label="amazon.js" code={requestProductAmazonCodeSnippet} selected={selectedMarketplace === MarketplaceEnum.Amazon}/>
            </Terminal>
          </ListItem>
        </ol>
        <h3 className="mt-[58px] mb-[6px] text-heading-small font-bold">See it in action</h3>
        <p className="text-paragraph-small font-normal mb-3">
          Try inputting any product URL from Amazon or Shopify and see a product ID get returned.
        </p>
        <div className="flex">
          <Input
              onChange={(e) => {
                setCurrentRequestedProductURL && setCurrentRequestedProductURL(e.target.value);
              }}
              internalLabel={`${marketplace} product URL`}
              value={currentRequestedProductURL}
          />
          <button
              onClick={onClickFetch}
              className="mx-3 rounded-xl bg-brand-green py-[14px] px-[36px] hover:bg-brand-hover-green active:bg-brand-active-green whitespace-nowrap"
          >
            {requestProductLoading ? <Spinner/> : "Add to Rye"}
          </button>
        </div>
        {(fetchError || requestProductError) && (
            <p className="mb-[4px] text-paragraph-small font-normal text-alerts-danger">
              There was an issue with the request. Please double check your Rye API key connection
              within the 'Obtaining Rye API key' step and that the product URL above is properly
              copied.
            </p>
        )}
        {requestProductData && <Terminal><TerminalTab label="JSON" code={requestProductDataOutputJSON} language="json" /></Terminal>}
      </section>
  );
}
