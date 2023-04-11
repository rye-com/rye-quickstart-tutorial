import {LinkType} from '../constants';
import ExternalLink from "../styled-components/external-link";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/solid";
import {ReactComponent as ManageCheckoutImage} from "../../../assets/manage-checkout.svg";
import ListItem from "../styled-components/list-item";
import {InlineCodeSnippet} from "../helper-components/InlineCodeSnippet";
import Terminal from "../styled-components/code-terminal";
import {showPaymentForm, submitCartMutation, updateBuyerIdentityMutation} from "../code_snippets";

export default function ManageCheckout() {
  return (
      <section>
        <div className="mb-[12px] flex font-poppinsBold">
          <h2 className="mr-[8px] text-heading-small font-bold">Example</h2>
          <ExternalLink
              href="https://console.rye.com"
              text="See it live"
              type={LinkType.Pill}
              startEnhancer={ArrowTopRightOnSquareIcon}
          />
        </div>
        <ManageCheckoutImage className="mb-[50px]"/>
        <h3 className="mb-[24px] text-heading-small font-bold font-poppinsBold">How it works</h3>
        <ol className="list-inside list-decimal text-paragraph-medium font-semibold font-poppinsSemiBold">
          <ListItem content="Update buyer info">
            <p className="text-paragraph-small font-normal mt-[4px] mb-[8px]">
              Update buyer identity information if it was not provided during cart creation via{' '}
              <InlineCodeSnippet version="v2redText">updateCartBuyerIdentity</InlineCodeSnippet> mutation.
              This mutation stores shipping information such as customer’s name, address, phone, etc.
            </p>
            <Terminal language="graphql" label="GraphQL" code={updateBuyerIdentityMutation}/>
          </ListItem>

          <ListItem content="Show payment form">
            <p className="text-paragraph-small font-normal mt-[4px] mb-[8px]">
              Show a payment form to the user. It is up to developers to provide required input fields to capture billing information including billing address.
            </p>
            <p className="text-paragraph-small font-normal mt-[4px] mb-[8px]">
              Critical payment information (credit card number and cvv) will be captured by Spreedly iFrame.
              Developers will need to use rye-pay script that is responsible for the integration with Spreedly.
              Developers should reserve html elements in their form with{' '}
              <InlineCodeSnippet version="v2redText">spreedly-number</InlineCodeSnippet> and{' '}
              <InlineCodeSnippet version="v2redText">spreedly-cvv</InlineCodeSnippet> ids that will be used to render iFrames.
            </p>
            <Terminal label="JavaScript" code={showPaymentForm} />
          </ListItem>

          <ListItem content="Submit the cart">
            <p className="text-paragraph-small font-normal mt-[4px] mb-[8px]">
              When the user enters their credit card information, use{' '}
              <InlineCodeSnippet version="v2redText">ryePay.submit</InlineCodeSnippet> method of the rye-pay script to submit the cart.
            </p>
            <p className="text-paragraph-small font-normal mt-[4px] mb-[8px]">
              <InlineCodeSnippet version="v2redText">rye-pay</InlineCodeSnippet> script allows developers to provide a callback that will be called with submission results.
              The result provides a submission status per each store in the cart. Use
              <InlineCodeSnippet version="v2redText">cart.stores[idx].status</InlineCodeSnippet> to get a status for a store. If the
              submission for the store was successful, the status is{' '}
              <InlineCodeSnippet version="v2redText">COMPLETED</InlineCodeSnippet>.
            </p>
            <p className="text-paragraph-small font-normal mt-[4px] mb-[8px]">
              NOTE: Developers can use the{' '}
              <InlineCodeSnippet version="v2redText">submitCart</InlineCodeSnippet> mutation directly to submit the user's cart.
              But in this case they are responsible for getting the Spreedly token that is required for this mutation.
            </p>
            <Terminal language="graphql" label="GraphQL" code={submitCartMutation} />
          </ListItem>
        </ol>
      </section>
  );
}
