import ExternalLink from "../../styled-components/external-link";
import { LinkType } from "../../constants";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { ReactComponent as ManageCartImage } from "../../../../assets/manage-cart.svg";
import ListItem from "../../styled-components/list-item";
import {InlineCodeSnippet} from "../../helper-components/InlineCodeSnippet";

export default function ManageCart() {
  return (
      <section>
        <div className="mb-3 flex font-poppinsBold">
          <h2 className="mr-2 text-heading-small font-bold">Example</h2>
          <ExternalLink
              href="https://console.rye.com"
              text="See it live"
              type={LinkType.Pill}
              startEnhancer={ArrowTopRightOnSquareIcon}
          />
        </div>
        <ManageCartImage className="mb-[50px]"/>
        <h3 className="mb-6 text-heading-small font-bold font-poppinsBold">How it works</h3>
        <ol className="list-inside list-decimal text-paragraph-medium font-semibold font-poppinsSemiBold">
          <ListItem content="Create a cart ">
            <p className="text-paragraph-small font-normal mt-1">
              Use{' '}
              <InlineCodeSnippet version="v2redText">createCart</InlineCodeSnippet> mutation.
            </p>
            <p className="text-paragraph-small font-normal mb-2">
              Upon creation developers can provide{' '}
              <InlineCodeSnippet version="v2redText">buyerIdentity</InlineCodeSnippet> and {' '}
              <InlineCodeSnippet version="v2redText">items</InlineCodeSnippet> with initial list of products.
            </p>
          </ListItem>
          <ListItem content="Add products to a user’s cart">
            <p className="text-paragraph-small font-normal mt-1 mb-2">
              Use the{' '}
              <InlineCodeSnippet version="v2redText">addToCart</InlineCodeSnippet> mutation to add the product to the user's cart.
              This will return a cart ID that can be used to fetch the cart data in the next step.
            </p>
          </ListItem>
          <ListItem content="Fetch a user’s cart">
            <p className="text-paragraph-small font-normal mt-1 mb-2">
              Use the{' '}
              <InlineCodeSnippet version="v2redText">cart</InlineCodeSnippet> query to fetch the cart data by ID.
              This will include information such as the products in the cart, and their quantities.
              You can also use this query to fetch the available shipping options and tax rates.
            </p>
          </ListItem>
          <ListItem content="Display cart to user">
          </ListItem>
        </ol>
      </section>
  );
}
