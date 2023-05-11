import { useContext, useState } from "react";
import { CheckoutFormConstants, TutorialContext } from "../../constants";
import { updateBuyerIdentityInputVariables } from "../../CodeSnippets/updateBuyerIdentitySnippet";
import { updateBuyerIdentityMutation } from "../../CodeSnippets/code_snippets";
import TerminalTab from "../../styled-components/code-terminal-tab";
import Terminal from "../../styled-components/code-terminal";

export default function UpdateBuyerIdentity() {
  const context = useContext(TutorialContext);
  const {
    createCart: {
      currentCreateCartID,
    },
    updateBuyerIdentity: {
      updateBuyerIdentityCallback,
      updateBuyerIdentityError,
      updateBuyerIdentityData,
    },
    apiKey: { currentApiKey },
  } = context;

  const [fetchError, setFetchError] = useState(false);
  const updateBuyerIdentityDataOutputJSON = JSON.stringify(updateBuyerIdentityData, null, 2);

  const onClickFetch = () => {
    if (updateBuyerIdentityCallback && currentApiKey && cartId) {
      updateBuyerIdentityCallback(
          currentApiKey,
          updateBuyerIdentityInputVariables({
            address: {
              "address1": CheckoutFormConstants.streetAddress,
              "address2": "",
              "city": CheckoutFormConstants.city,
              "countryCode": CheckoutFormConstants.countryCode,
              "email": CheckoutFormConstants.emailId,
              "firstName": CheckoutFormConstants.firstName,
              "lastName": CheckoutFormConstants.lastName,
              "phone": CheckoutFormConstants.phone,
              "postalCode": CheckoutFormConstants.zipCode,
              "provinceCode": CheckoutFormConstants.state,
            },
            cartId: currentCreateCartID || "",
          }),
      );
      setFetchError(false);
    } else {
      setFetchError(true);
    }
  }

  return (
      <div>
        <div className="flex flex-row gap-2 h-[400px]">
          <div>
            <Terminal>
              <TerminalTab language="graphql" label="Mutation" code={updateBuyerIdentityMutation}/>
            </Terminal>
            <button
                className="mx-3 rounded-xl bg-brand-green px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green h-14 relative top-[-80px] left-[10px]"
                onClick={onClickFetch}
            >
              Fetch shipping options
            </button>
          </div>
          <Terminal>
            <TerminalTab language="graphql" label="Response" code={updateBuyerIdentityData ? updateBuyerIdentityDataOutputJSON: ""} />
          </Terminal>
        </div>
        {(fetchError || updateBuyerIdentityError) && (
            <p className="my-3 text-paragraph-small font-normal text-alerts-danger">
              There was an issue with the request. Please double check your Rye API key connection
              within the 'Manage Cart - Update Buyer Identity' step.
            </p>
        )}
      </div>
  );
}
