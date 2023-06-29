import { useContext, useEffect, useState } from "react";
import { TutorialContext } from "../../constants";
import { createCartInputVariables, createCartMutation } from "../../CodeSnippets/createCartSnippet";
import { Spinner } from "flowbite-react";
import TerminalTab from "../../styled-components/code-terminal-tab";
import Terminal from "../../styled-components/code-terminal";

export default function CreateCart() {
  const context = useContext(TutorialContext);
  const {
    createCart: {
      createCartCallback,
      createCartError,
      createCartData,
      setCurrentCreateCartID,
      createCartLoading,
    },
    apiKey: { currentApiKey },
  } = context;

  const [fetchError, setFetchError] = useState(false);
  const createCartDataOutputJSON = JSON.stringify(createCartData, null, 2);

  const onClickFetch = () => {
    if (createCartCallback && currentApiKey) {
      createCartCallback(
          currentApiKey,
          createCartInputVariables(),
      );

      setFetchError(false);
    } else {
      setFetchError(true);
    }
  }

  useEffect(() => {
    if (setCurrentCreateCartID && createCartData) {
      setCurrentCreateCartID(createCartData.createCart.cart.id);
    }
  }, [createCartData, setCurrentCreateCartID])

  return (
      <div>
        <div className="flex flex-row gap-2 h-[400px]">
          <div>
            <Terminal>
              <TerminalTab language="graphql" label="Mutation" code={createCartMutation} />
            </Terminal>
            <button
                className="mx-3 rounded-xl bg-brand-green px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green h-14 relative top-[-80px] left-[10px]"
                onClick={onClickFetch}
            >
              {createCartLoading ? <Spinner/> : "Create cart"}
            </button>
          </div>
          <Terminal>
            <TerminalTab language="graphql" label="Response" code={createCartData ? createCartDataOutputJSON: ""} />
          </Terminal>
        </div>
        {(fetchError || createCartError) && (
            <p className="my-3 text-paragraph-small font-normal text-alerts-danger">
              There was an issue with the request. Please double check your Rye API key connection
              within the 'Manage Cart - Create a cart' step.
            </p>
        )}
      </div>
  );
}
