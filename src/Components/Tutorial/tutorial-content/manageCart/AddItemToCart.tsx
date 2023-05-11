import { useContext, useState } from "react";
import { addItemToCartInputVariables, addItemToCartMutation } from "../../CodeSnippets/addItemToCartSnippet";
import { addItemToCartTestData, TutorialContext} from "../../constants";
import Input from "../../styled-components/input";
import TerminalTab from "../../styled-components/code-terminal-tab";
import Terminal from "../../styled-components/code-terminal";

export default function AddItemToCart() {
  const context = useContext(TutorialContext);
  const {
    createCart: {
      currentCreateCartID,
    },
    addItemToCart: {
      addItemToCartCallback,
      addItemToCartData,
      addItemToCartError
    },
    apiKey: { currentApiKey },
  } = context;

  const [fetchError, setFetchError] = useState(false);
  const addItemToCartDataJSONOutput = JSON.stringify(addItemToCartData, null, 2);

  const onClickFetch = () => {
    if (addItemToCartCallback && currentApiKey && currentCreateCartID) {
      addItemToCartCallback(
          currentApiKey,
          addItemToCartInputVariables(currentCreateCartID, addItemToCartTestData.productId, addItemToCartTestData.marketplace),
      );

      setFetchError(false);
    } else {
      setFetchError(true);
    }
  }

  return (
      <div className="flex flex-col gap-2">
        <div className="flex w-3/4 items-center mt-[4px]">
          <Input
              value={addItemToCartTestData.productId}
              internalLabel="Product ID"
          />
          <button
              onClick={onClickFetch}
              className="mx-3 rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green w-fit whitespace-nowrap"
          >
            Add to cart
          </button>
        </div>
        <div className="flex flex-row gap-2 overflow-hidden h-[700px]">
          <Terminal>
            <TerminalTab language="graphql" label="Mutation" code={addItemToCartMutation} />
          </Terminal>
          <Terminal>
            <TerminalTab language="graphql" label="Response" code={addItemToCartData ? addItemToCartDataJSONOutput: ""} />
          </Terminal>
        </div>
        {(fetchError || addItemToCartError) && (
            <p className="mb-[4px] text-paragraph-small font-normal text-alerts-danger">
              There was an issue with the request. Please double check your Rye API key connection
              within the 'Manage Cart - Add an item to cart' step.
            </p>
        )}
      </div>
  );
}
