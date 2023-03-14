import RyeApiKeyV2 from '../../../assets/rye-key-v2.png';
import ListItem from '../styled-components/list-item';
import ExternalLink from '../styled-components/external-link';
import { LinkType } from '../constants';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import Input from '../styled-components/input';
import { KeyIcon } from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { TutorialContext } from '../constants';

export default function GettingStarted() {
  const context = useContext(TutorialContext);
  const {
    apiKey: { setApiKey, currentApiKey },
  } = context;
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
        <div className="w-2/4">
          <Input
            startEnhancer={KeyIcon}
            onChange={(e) => {
              setApiKey && setApiKey(e.target.value);
            }}
            value={currentApiKey}
          />
        </div>
      </ListItem>
      <ListItem content="Now you can use your API key to access the Rye API throughout the tutorial">
        <p className="mb-[12px] text-paragraph-small font-normal">
          See below for the code snippet to call the Rye API:
        </p>
      </ListItem>
    </ol>
  );
}
