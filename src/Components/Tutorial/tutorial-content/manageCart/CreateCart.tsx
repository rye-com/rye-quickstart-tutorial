import Terminal from "../../styled-components/code-terminal";
import {useContext, useEffect, useState} from "react";
import {TutorialContext} from "../../constants";
import {createCartInputVariables, createCartMutation} from "../../CodeSnippets/createCartSnippet";

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

        <Terminal language="graphql" label="Mutation" code={createCartMutation} />
        <button
            className="mx-3 rounded-xl bg-brand-green px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green h-14"
            onClick={onClickFetch}
        >
          Create cart
        </button>
        <Terminal language="graphql" label="Response" code={createCartData ? createCartDataOutputJSON: ""} />
        {(fetchError || createCartError) && (
            <p className="mb-[4px] text-paragraph-small font-normal text-alerts-danger">
              There was an issue with the request. Please double check your Rye API key connection
              within the 'Manage Cart - Create a cart' step.
            </p>
        )}
      </div>
  );
}
