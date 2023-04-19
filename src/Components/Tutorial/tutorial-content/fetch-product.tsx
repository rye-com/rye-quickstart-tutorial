import ExternalLink from '../styled-components/external-link';
import { LinkType } from '../constants';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import FetchProductScreenV2 from '../../../assets/fetch-product-v2.png';
import { InlineCodeSnippet } from '../helper-components/InlineCodeSnippet';
import ListItem from '../styled-components/list-item';
import Input from '../styled-components/input';
import { useContext, useState } from 'react';
import { TutorialContext } from '../constants';
import { productFetchVariables } from '../CodeSnippets/code_snippets';
import { MarketplaceEnum } from '../types';
import Terminal from '../styled-components/code-terminal';
import { amazonProductFetchSnippet } from '../CodeSnippets/code_snippets';

export default function FetchProduct() {
  const context = useContext(TutorialContext);
  const {
    fetchProduct: {
      fetchProductCallback,
      fetchProductData,
      setCurrentFetchedProductId,
      currentFetchedProductId,
      fetchProductError,
    },
    apiKey: { currentApiKey },
  } = context;
  const [fetchError, setFetchError] = useState(false);
  const fetchSnippet = amazonProductFetchSnippet('B08KHY1PKR');
  const prettyJSON = JSON.stringify(fetchProductData, null, 2);

  return (
    <section>
      <div className="mb-[12px] flex">
        <h2 className="mr-[8px] text-heading-small font-bold">Example</h2>
        <ExternalLink
          href="https://console.rye.com"
          text="See it live"
          type={LinkType.Pill}
          startEnhancer={ArrowTopRightOnSquareIcon}
        />
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
              onChange={(e) => {
                console.log(e);
              }}
              value="B08KHY1PKR"
              internalLabel="Sample product ID"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText('B08KHY1PKR');
              }}
              className="mx-3 rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green"
            >
              Copy
            </button>
          </div>
        </ListItem>
        <ListItem content="Use the item ID in the following function to fetch product info">
          <Terminal label="amazon.js" code={fetchSnippet} />
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
              }}
              internalLabel="Product ID"
              value={currentFetchedProductId}
            />
            <button
              onClick={() => {
                if (fetchProductCallback && currentApiKey && currentFetchedProductId) {
                  fetchProductCallback(
                    currentApiKey,
                    productFetchVariables(currentFetchedProductId, MarketplaceEnum.Amazon),
                  );
                  setFetchError(false);
                } else {
                  setFetchError(true);
                }
              }}
              className="my-[6px] mx-3 rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green"
            >
              Fetch
            </button>
          </div>
          {(fetchError || fetchProductError) && (
            <p className="mb-[4px] text-paragraph-small font-normal text-alerts-danger">
              There was an issue with the request. Please double check your Rye API key connection
              within the 'Obtaining Rye API key' step and that the product ID above is properly
              copied.
            </p>
          )}
          {fetchProductData && <Terminal label="JSON" code={prettyJSON} language="json" />}
        </ListItem>
      </ol>
    </section>
  );
}
