import ListItem from '../styled-components/list-item';
import Input from '../styled-components/input';
import { InlineCodeSnippet } from '../helper-components/InlineCodeSnippet';
import Terminal from '../styled-components/code-terminal';
import { requestProductSnippet } from '../code_snippets';
import { MarketplaceEnum } from '../types';
import { useContext } from 'react';
import { TutorialContext } from '../constants';

export default function AddProduct() {
  const context = useContext(TutorialContext);
  const {
    addProduct: { currentAddProductUrl, setCurrentAddProductUrl },
  } = context;

  const requestSnippetExample = requestProductSnippet(
    'https://www.amazon.com/cool-product/dp/B08KHY1PKR',
    MarketplaceEnum.Amazon,
  );
  return (
    <section className="pb-[24px]">
      <h3 className="mb-[24px] text-heading-small font-bold">How it works</h3>
      <ol className="mb-[48px] list-inside list-decimal text-paragraph-medium font-semibold">
        <ListItem
          styleOverrides={{ paragraph: 'mb-[12px] inline-block font-semibold' }}
          content="Copy the URL from an Amazon or Shopify product page"
        >
          <div className="flex w-3/4 items-center">
            <Input
              onChange={(e) => {
                console.log(e);
              }}
              value="https://www.amazon.com/cool-product/dp/B08KHY1PKR"
              internalLabel="Sample product URL"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText('https://www.amazon.com/cool-product/dp/B08KHY1PKR');
              }}
              className="mx-3 rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green"
            >
              Copy
            </button>
          </div>
        </ListItem>
        <ListItem content="Use the URL in the addProduct mutation">
          <p className="mb-[24px] text-paragraph-small font-normal">
            Add an external product to Rye inventory using the
            <InlineCodeSnippet version="v2redText">addProduct</InlineCodeSnippet> mutation. You can
            use the product ID returned by this mutation to fetch product data. You can also do this
            via the Rye Console
          </p>
          <Terminal code={requestSnippetExample} />
        </ListItem>
      </ol>
      <h4 className="mb-[4px] text-heading-small font-bold">See it in action</h4>
      <p className="mb-[24px] text-paragraph-small font-normal">
        Try inputting any product URL from Amazon or Shopify and see a product ID get returned.
      </p>
      <div className="flex">
        <Input
          onChange={(e) => {
            setCurrentAddProductUrl && setCurrentAddProductUrl(e.target.value);
          }}
          internalLabel="Product URL"
          value={currentAddProductUrl}
        />
        <button
          onClick={() => {
            //TODO: implement graphql call
          }}
          className="my-[6px] mx-3 rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green"
        >
          Fetch
        </button>
      </div>
    </section>
  );
}
