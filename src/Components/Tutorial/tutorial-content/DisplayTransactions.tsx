import ExternalLink from "../styled-components/external-link";
import { LinkType } from "../constants";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { ReactComponent as DisplayTransactionsImage } from "../../../assets/display-transactions.svg";

export default function DisplayTransactions() {
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
        <DisplayTransactionsImage className="mb-[50px]"/>
        <h3 className="mb-[24px] text-heading-small font-bold font-poppinsBold">How it works</h3>
      </section>
  );
}
