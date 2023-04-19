import { useState } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { InlineCodeSnippet } from "../helper-components/InlineCodeSnippet";
import { LinkType } from "../constants";
import { ReactComponent as DisplayTransactionsImage } from "../../../assets/display-transactions.svg";
import { getOrderStatusQuery, getOrderStatusQueryOutput } from "../CodeSnippets/getOrderStatusSnippet";
import { submitCartMutationResponse } from "../CodeSnippets/code_snippets";
import ExternalLink from "../styled-components/external-link";
import ListItem from "../styled-components/list-item";
import Terminal from "../styled-components/code-terminal";

export default function DisplayTransactions() {
  const [orderStatusOutput, setOrderStatusOutput] = useState<string>("");

  return (
      <section>
        <div className="mb-3 flex font-bold">
          <h2 className="mr-2 text-heading-small font-bold">Example</h2>
          <ExternalLink
              href="https://console.rye.com"
              text="See it live"
              type={LinkType.Pill}
              startEnhancer={ArrowTopRightOnSquareIcon}
          />
        </div>
        <DisplayTransactionsImage className="mb-[50px]"/>
        <h3 className="mb-6 text-heading-small font-bold">How it works</h3>
        <p className="text-paragraph-small mt-1 mb-6">
          Use the cart data from the previous step to display the status of the transaction to the user.
          If the status is{' '}
          <InlineCodeSnippet version="v2redText">COMPLETED</InlineCodeSnippet>
          , you can show the user a confirmation message and any relevant order details.
          If the status is{' '}
          <InlineCodeSnippet version="v2redText">PAYMENT_FAILED</InlineCodeSnippet>, you can display an error message
          and prompt the user to update payment info and try again. If the status is{' '}
          <InlineCodeSnippet version="v2redText">FAILED</InlineCodeSnippet>, some unknown error occurred and developers
          should contact rye support to handle this case.
        </p>
        <ol className="list-inside list-decimal text-paragraph-medium font-semibold">
          <ListItem content="View transaction status">
            <p className="text-paragraph-small font-normal mt-1 mb-6">
              From the previous step, we can see that the response we receive on submitting our cart gives us a{' '}
              <InlineCodeSnippet version="v2redText">cart.stores[idx].status</InlineCodeSnippet> with a{' '}
              <InlineCodeSnippet version="v2redText">COMPLETED</InlineCodeSnippet> value, indicating that the order
              has been placed correctly.
            </p>
            <Terminal language="graphql" label="GraphQL" code={submitCartMutationResponse}/>
          </ListItem>
          <ListItem content="Get order status">
            <p className="text-paragraph-small font-normal mt-1 mb-2">
              Use the{' '}
              <InlineCodeSnippet version="v2redText">cart.stores[idx].requestId</InlineCodeSnippet> from the previous response
              with the <InlineCodeSnippet version="v2redText">order</InlineCodeSnippet> query to check the status of the
              order.
            </p>
            <div className="flex flex-row gap-2 h-[475px] grid grid-cols-2">
              <div>
                <Terminal language="graphql" label="Query" code={getOrderStatusQuery} />
                <button
                    className="mx-3 rounded-xl bg-brand-green px-[24px] hover:bg-brand-hover-green active:bg-brand-active-green h-14 relative top-[-80px] left-[10px]"
                    onClick={() => setOrderStatusOutput(getOrderStatusQueryOutput)}
                >
                  Get order status
                </button>
              </div>
              <Terminal language="json" label="Response" code={orderStatusOutput} />
            </div>
          </ListItem>
        </ol>
      </section>
  );
}
