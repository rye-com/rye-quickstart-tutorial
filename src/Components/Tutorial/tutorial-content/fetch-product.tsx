import { useContext, useState } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { LinkType, TutorialContext } from '../constants';
import { InlineCodeSnippet } from '../helper-components/InlineCodeSnippet';
import { amazonProductFetchSnippet, productFetchVariables } from '../CodeSnippets/code_snippets';
import { MarketplaceEnum } from '../types';
import { Dropdown } from "flowbite-react";
import { DropdownDivider } from "flowbite-react/lib/esm/components/Dropdown/DropdownDivider";
import ExternalLink from '../styled-components/external-link';
import type { ChangeEvent } from 'react';
import FetchProductScreenV2 from '../../../assets/fetch-product-v2.png';
import ListItem from '../styled-components/list-item';
import Input from '../styled-components/input';
import Terminal from '../styled-components/code-terminal';

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
    fetchShopifyProduct: {
      fetchShopifyProductCallback,
      fetchShopifyProductData,
      currentFetchedShopifyProductId,
      setCurrentFetchedShopifyProductId,
      fetchShopifyProductError,
    },
    apiKey: { currentApiKey },
  } = context;

  const [fetchError, setFetchError] = useState(false);
  const [marketplace, setMarketplace] = useState(MarketplaceEnum.Amazon);
  const fetchSnippet = amazonProductFetchSnippet('B08KHY1PKR');
  const prettyJSON = JSON.stringify(marketplace === MarketplaceEnum.Amazon ?
      fetchProductData : fetchShopifyProductData, null, 2);

  const productData = (marketplace === MarketplaceEnum.Amazon ? fetchProductData : fetchShopifyProductData);
  const productError = (marketplace === MarketplaceEnum.Amazon ? fetchProductError : fetchShopifyProductError);

  const onProductIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (marketplace === MarketplaceEnum.Amazon) {
      setCurrentFetchedProductId && setCurrentFetchedProductId(e.target.value);
    } else {
      setCurrentFetchedShopifyProductId && setCurrentFetchedShopifyProductId(e.target.value);
    }
  }

  const onClickFetch = () => {
    if (fetchShopifyProductCallback && fetchProductCallback &&
        currentFetchedProductId && currentFetchedShopifyProductId && currentApiKey) {
      if (marketplace === MarketplaceEnum.Amazon) {
        fetchProductCallback(
            currentApiKey,
            productFetchVariables(currentFetchedProductId, MarketplaceEnum.Amazon),
        );
      } else {
        fetchShopifyProductCallback(
            currentApiKey,
            productFetchVariables(currentFetchedShopifyProductId, MarketplaceEnum.Shopify),
        );
      }

      setFetchError(false);
    } else {
      setFetchError(true);
    }
  }

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
          <div className="flex gap-x-3">
            <div className="flex text-black">
              <Dropdown
                  className="rounded-xl bg-white px-3"
                  label={marketplace.charAt(0) + marketplace.slice(1).toLowerCase()}
                  color={"light"}
                  style={{ color: "black", height: "4rem", borderRadius: "1rem" }}
              >
                <Dropdown.Item onClick={() => setMarketplace(MarketplaceEnum.Shopify)}>
                  Shopify
                </Dropdown.Item>
                <DropdownDivider/>
                <Dropdown.Item onClick={() => setMarketplace(MarketplaceEnum.Amazon)}>
                  Amazon
                </Dropdown.Item>
              </Dropdown>
            </div>
            <Input
              onChange={onProductIdChange}
              internalLabel="Product ID"
              value={marketplace === MarketplaceEnum.Amazon ? currentFetchedProductId : currentFetchedShopifyProductId}
            />
            <button
              onClick={onClickFetch}
              className="my-[6px] mx-3 rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green"
            >
              Fetch
            </button>
          </div>
          {(fetchError || productError) && (
            <p className="mb-[4px] text-paragraph-small font-normal text-alerts-danger">
              There was an issue with the request. Please double check your Rye API key connection
              within the 'Obtaining Rye API key' step and that the product ID above is properly
              copied.
            </p>
          )}
          {productData && <Terminal label="JSON" code={prettyJSON} language="json" />}
        </ListItem>
      </ol>
    </section>
  );
}
