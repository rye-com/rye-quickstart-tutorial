import Terminal from "../../styled-components/code-terminal";
import {
  getCartInputVariables,
  getCartQuery,
} from "../../CodeSnippets/code_snippets";
import {useContext, useState} from "react";
import {TutorialContext} from "../../constants";
import Input from "../../styled-components/input";

export default function GetCart() {
  const context = useContext(TutorialContext);
  const {
    createCart: {
      currentCreateCartID,
    },
    getCart: {
      getCartCallback,
      getCartData,
      getCartError,
    },
    apiKey: { currentApiKey },
  } = context;

  const [fetchError, setFetchError] = useState(false);
  const getCartDataJSONOutput = JSON.stringify(getCartData, null, 2);

  const onClickFetch = () => {
    if (getCartCallback && currentApiKey && currentCreateCartID) {
      getCartCallback(
          currentApiKey,
          getCartInputVariables(currentCreateCartID),
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
              value={currentCreateCartID}
              internalLabel="Cart ID"
          />
          <button
              onClick={onClickFetch}
              className="mx-3 rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green"
          >
            Fetch
          </button>
        </div>
        <div className="flex flex-row gap-2 overflow-hidden">
          <Terminal language="graphql" label="Query" code={getCartQuery} />
          <Terminal language="graphql" label="JSON" code={getCartData ? getCartDataJSONOutput: ""} />
          {(fetchError || getCartError) && (
              <p className="mb-[4px] text-paragraph-small font-normal text-alerts-danger">
                There was an issue with the request. Please double check your Rye API key connection
                within the 'Manage Cart - Create a cart' step.
              </p>
          )}
        </div>
      </div>
  );
}
