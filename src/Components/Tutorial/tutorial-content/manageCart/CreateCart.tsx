import Terminal from "../../styled-components/code-terminal";
import {
  createCartInput,
  createCartInputVariables,
  createCartMutation,
} from "../../CodeSnippets/code_snippets";
import {useContext, useEffect, useState} from "react";
import {TutorialContext} from "../../constants";

export default function CreateCart() {
  const context = useContext(TutorialContext);
  const {
    createCart: {
      createCartCallback,
      createCartError,
      createCartData,
      setCurrentCreateCartID,
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
      setCurrentCreateCartID(createCartData?.createCart?.cart?.id ?? "");
    }
  }, [createCartData])

  return (
      <div className="flex flex-row gap-2">
        <div>
          <Terminal language="graphql" label="Mutation" code={createCartMutation} />
          <Terminal language="graphql" label="Input Variables" code={createCartInput} />
        </div>
        <div className="overflow-x-auto min-w-max min-h-max">
          <button
            className="mx-3 rounded-xl bg-brand-green py-[14px] px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green"
            onClick={onClickFetch}
          >
            Create cart
          </button>
          <Terminal language="graphql" label="GraphQL" code={createCartData ? createCartDataOutputJSON: ""} />
          {(fetchError || createCartError) && (
              <p className="mb-[4px] text-paragraph-small font-normal text-alerts-danger">
                There was an issue with the request. Please double check your Rye API key connection
                within the 'Manage Cart - Create a cart' step.
              </p>
          )}
        </div>
      </div>
  );
}
