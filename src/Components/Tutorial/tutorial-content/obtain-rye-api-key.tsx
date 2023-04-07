import RyeApiKeyV2 from '../../../assets/rye-key-v2.png';
import ListItem from '../styled-components/list-item';
import ExternalLink from '../styled-components/external-link';
import { LinkType } from '../constants';
import { ArrowTopRightOnSquareIcon, CheckIcon } from '@heroicons/react/24/solid';
import Input from '../styled-components/input';
import { KeyIcon } from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { TutorialContext } from '../constants';
import { Spinner } from 'flowbite-react';
import Terminal from '../styled-components/code-terminal';
import { initializeClientSnippet } from '../code_snippets';

export default function ObtainRyeApiKey() {
  const context = useContext(TutorialContext);
  const {
    apiKey: { setApiKey, currentApiKey, isApiKeyValid, apiKeyCheckIsLoading },
  } = context;
  const initClientSnippet = initializeClientSnippet(currentApiKey || '<RYE_API_KEY>');

  return (
    <ol className="list-inside list-decimal text-paragraph-medium font-semibold">
      <ListItem
        content={
          <div className="inline">
            Sign up and log in to{' '}
            <span>
              <ExternalLink
                href="https://console.rye.com"
                text="console.rye.com"
                type={LinkType.Pill}
                startEnhancer={ArrowTopRightOnSquareIcon}
              />
            </span>
          </div>
        }
      />
      <ListItem
        styleOverrides={{ paragraph: 'inline-block mb-[12px]' }}
        content="Under Account → Access and Security, view and copy your API key"
      >
        <img src={RyeApiKeyV2} alt="API Key" />
      </ListItem>
      <ListItem
        styleOverrides={{ paragraph: 'inline-block mb-[12px]' }}
        content="Enter your Rye API key"
      >
        <div className="flex">
          <div className="w-3/4">
            <Input
              startEnhancer={KeyIcon}
              onChange={(e) => {
                setApiKey && setApiKey(e.target.value);
              }}
              value={currentApiKey}
            />
          </div>
          {isApiKeyValid && (
            <p className="ml-[10px] flex items-center text-alerts-success">
              <CheckIcon className="h-[20px] w-[20px]" /> CONNECTED
            </p>
          )}
          {apiKeyCheckIsLoading && <Spinner className="mt-[12px] ml-[10px]" />}
        </div>
      </ListItem>
      <ListItem content="Now you can use your API key to access the Rye API throughout the tutorial">
        <p className="mb-[12px] text-paragraph-small font-normal">
          See below for the code snippet to call the Rye API:
        </p>
        <Terminal code={initClientSnippet} />
      </ListItem>
    </ol>
  );
}
