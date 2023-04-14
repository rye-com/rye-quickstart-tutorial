import { useState } from "react";
import { CheckoutFormConstants } from "../../constants";
import { generateEmptyCodeSnippetForLineNumbers, submitCartMutationResponse } from "../../code_snippets";
import Input from "../../styled-components/input";
import Terminal from "../../styled-components/code-terminal";

// Number of lines should equal the size of the JSON output (for now)
// TODO: update the Terminal component to be able to do this via providing height instead of a hacky approach like this
// TODO task: https://linear.app/rye/issue/RYE-2186/[tutorial][fix]-clean-up-terminal
const emptyCodeSnippet = generateEmptyCodeSnippetForLineNumbers(28);

export default function CheckoutForm() {
  const [submitCartOutput, setSubmitCartOutput] = useState<string>(emptyCodeSnippet);

  return (
      <div className="flex flex-row items-start gap-2">
        <div className="flex flex-col items-start p-6 bg-choice-active w-[320px] h-[770px] rounded-[24px] gap-6 mt-2">
          <div className="flex flex-col items-start gap-2 w-[272px] h-[100px]">
            <h4 className="paragraph-xsmall font-semibold font-poppinsSemiBold">Products</h4>
            <Input value={CheckoutFormConstants.productId} internalLabel="Product ID"/>
          </div>
          <div className="flex flex-col items-start gap-2 w-[272px] h-[100px]">
            <h4 className="paragraph-xsmall font-semibold font-poppinsSemiBold">Contact info</h4>
            <Input value={CheckoutFormConstants.emailId} internalLabel="Email ID"/>
          </div>
          <div className="flex flex-col items-start gap-2 w-[272px] h-[424px]">
            <h4 className="paragraph-xsmall font-semibold font-poppinsSemiBold">Shipping</h4>
            <Input value={CheckoutFormConstants.emailId} internalLabel="First name"/>
            <Input value={CheckoutFormConstants.firstName} internalLabel="Last name"/>
            <Input value={CheckoutFormConstants.lastName} internalLabel="Street address"/>
            <Input value={CheckoutFormConstants.city} internalLabel="City"/>
            <div className="flex flex-row gap-2">
              <Input value={CheckoutFormConstants.zipCode} internalLabel="Zip code"/>
              <Input value={CheckoutFormConstants.state} internalLabel="State"/>
            </div>
            <Input value={CheckoutFormConstants.phone} internalLabel="Phone (Optional)"/>
          </div>
          <button
              onClick={() => setSubmitCartOutput(submitCartMutationResponse)}
              className="rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green"
          >
            Submit
          </button>
        </div>
        <div className="overflow-x-auto min-w-[474px] min-h-[760px]">
          <Terminal language="graphql" label="Response" code={submitCartOutput}/>
        </div>
      </div>
  );
}

