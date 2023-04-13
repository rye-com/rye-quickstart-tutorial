import ExternalLink from "../styled-components/external-link";
import { LinkType } from "../constants";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { ReactComponent as DisplayTransactionsImage } from "../../../assets/display-transactions.svg";

export default function DisplayTransactions() {
  return (
      <section>
        <div className="mb-3 flex font-poppinsBold">
          <h2 className="mr-2 text-heading-small font-bold">Example</h2>
          <ExternalLink
              href="https://console.rye.com"
              text="See it live"
              type={LinkType.Pill}
              startEnhancer={ArrowTopRightOnSquareIcon}
          />
        </div>
        <DisplayTransactionsImage className="mb-[50px]"/>
        <h3 className="mb-6 text-heading-small font-bold font-poppinsBold">How it works</h3>
      </section>
  );
}
