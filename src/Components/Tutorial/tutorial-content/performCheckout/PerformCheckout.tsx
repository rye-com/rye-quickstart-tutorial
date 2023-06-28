import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { InlineCodeSnippet } from "../../helper-components/InlineCodeSnippet";
import { showPaymentForm, submitCartMutation } from "../../CodeSnippets/code_snippets";
import { CheckoutFormConstants, LinkType, RyeCapProductCheckoutUrl } from '../../constants';
import { ReactComponent as ManageCheckoutImage } from "../../../../assets/manage-checkout.svg";
import ExternalLink from "../../styled-components/external-link";
import ListItem from "../../styled-components/list-item";
import TerminalTab from "../../styled-components/code-terminal-tab";
import CheckoutForm from "./CheckoutForm";
import Terminal from "../../styled-components/code-terminal";

export default function PerformCheckout() {
  return (
      <section>
        <div className="mb-3 flex">
          <h2 className="mr-2 text-heading-small font-bold">Example</h2>
          <ExternalLink
              href={RyeCapProductCheckoutUrl}
              text="See it live"
              type={LinkType.Pill}
              startEnhancer={ArrowTopRightOnSquareIcon}
          />
        </div>
        <ManageCheckoutImage className="mb-[50px]"/>
        <h3 className="mb-6 text-heading-small font-bold">How it works</h3>
        <ol className="list-inside list-decimal text-paragraph-medium font-semibold">
          <ListItem content="Show payment form">
            <p className="text-paragraph-small font-normal mt-1 mb-2">
              Show a payment form to the user. It is up to developers to provide required input fields to capture billing information including billing address.
            </p>
            <p className="text-paragraph-small font-normal mt-1 mb-2">
              Critical payment information (credit card number and cvv) will be captured by Spreedly iFrame.
              Developers will need to use rye-pay script that is responsible for the integration with Spreedly.
              Developers should reserve html elements in their form with{' '}
              <InlineCodeSnippet version="v2redText">spreedly-number</InlineCodeSnippet> and{' '}
              <InlineCodeSnippet version="v2redText">spreedly-cvv</InlineCodeSnippet> ids that will be used to render iFrames.
            </p>
            <Terminal>
              <TerminalTab label="JavaScript" code={showPaymentForm} />
            </Terminal>
          </ListItem>
          <ListItem content="Submit the cart">
            <p className="text-paragraph-small font-normal mt-1 mb-2">
              When the user enters their credit card information, use{' '}
              <InlineCodeSnippet version="v2redText">ryePay.submit</InlineCodeSnippet> method of the rye-pay script to submit the cart.
            </p>
            <p className="text-paragraph-small font-normal mt-1 mb-2">
              <InlineCodeSnippet version="v2redText">rye-pay</InlineCodeSnippet> script allows developers to provide a callback that will be called with submission results.
              The result provides a submission status per each store in the cart. Use
              <InlineCodeSnippet version="v2redText">cart.stores[idx].status</InlineCodeSnippet> to get a status for a store. If the
              submission for the store was successful, the status is{' '}
              <InlineCodeSnippet version="v2redText">COMPLETED</InlineCodeSnippet>.
            </p>
            <p className="text-paragraph-small font-normal mt-1 mb-2">
              NOTE: Developers can use the{' '}
              <InlineCodeSnippet version="v2redText">submitCart</InlineCodeSnippet> mutation directly to submit the user's cart.
              But in this case they are responsible for getting the Spreedly token that is required for this mutation.
            </p>
            <Terminal>
              <TerminalTab language="graphql" label="GraphQL" code={submitCartMutation} />
            </Terminal>
          </ListItem>
        </ol>
        <div>
          <h3 className="mb-6 text-heading-small font-bold">See it in action</h3>
          <p className="text-paragraph-small font-normal mt-1 mb-2">
            Here's an example of how you can use our APIs and tools to create a payment form.
            Here we try to checkout an existing cart which contains a product {' '}
            <InlineCodeSnippet version="v2redText">{CheckoutFormConstants.variantId}</InlineCodeSnippet>.
          </p>
          <p className="text-paragraph-small font-normal mt-1 mb-2">
            Click the "Submit" button to see what response a developer can expect when a cart is successfully checked out!
          </p>
          <CheckoutForm/>
        </div>
      </section>
  );
}
