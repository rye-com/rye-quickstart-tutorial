import ExternalLink from '../styled-components/external-link';
import { LinkType } from '../constants';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import FetchProductScreenV2 from '../../../assets/fetch-product-v2.png';
import { InlineCodeSnippet } from '../helper-components/InlineCodeSnippet';
import ListItem from '../styled-components/list-item';
import Input from '../styled-components/input';

export default function FetchProduct() {
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
          <div className="w-3/4">
            <Input
              onChange={(e) => {
                console.log(e);
              }}
              value="test"
              internalLabel="Sample product ID"
            />
          </div>
        </ListItem>
        <ListItem content="Use the item ID in the following function to fetch product info">
          {/* Add terminal */}
        </ListItem>
      </ol>
    </section>
  );
}
