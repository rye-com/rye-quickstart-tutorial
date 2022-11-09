import ApiKeyDarkImage from './rye-api-key-dark.png';
import ApiKeyLightImage from './rye-api-key-light.png';
import { Badge, Card, Label, Spinner, TextInput, Timeline } from 'flowbite-react';
import { KeyIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import type { Store } from '../../types';
import { ThemeEnum } from '../../types';
import { CustomTimelineBody } from '../../helper-components/CustomTimelineBody';
import { CustomCodeBlock } from '../../helper-components/CustomCodeBlock';
import { linkClasses } from '../../index';

export function enterApiKey(
  currentTheme: ThemeEnum,
  data: Store,
  onAPIKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  isCheckingAPIKey: boolean,
  isValidAPIKey: boolean,
  initClientSnippet: string,
) {
  return (
    <Timeline.Item>
      <Timeline.Content>
        <div className="flex">
          <Card className="max-w-xl">
            <Timeline.Point icon={KeyIcon} />
            <Timeline.Title>Grab your API Key</Timeline.Title>
            <CustomTimelineBody>
              <div className="text py-3">
                Navigate to{' '}
                <a className={linkClasses} href="https://console.rye.com">
                  console.rye.com
                </a>{' '}
                and grab your API key
              </div>
            </CustomTimelineBody>
            <CustomTimelineBody>
              <Timeline.Point />
              <div className="py-1">Under Access and Security, view and copy your API key</div>
              <img
                src={currentTheme === ThemeEnum.Dark ? ApiKeyDarkImage : ApiKeyLightImage}
                alt="API Key"
                className="rounded border border-slate-200 dark:border-rye-lime"
              />
            </CustomTimelineBody>
            <CustomTimelineBody>
              <Timeline.Point />
              <div className="py-1">
                <Label htmlFor="api_key" value="Enter your RYE API key" />
                <TextInput
                  value={data.apiConfig.key}
                  icon={KeyIcon}
                  id="api_key"
                  className="mt-3"
                  placeholder="RYE-abcdef"
                  onChange={onAPIKeyChange}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex h-6 w-6 items-center">
                  {isCheckingAPIKey ? <Spinner className="h-6 w-6" /> : null}
                  {!isCheckingAPIKey ? (
                    <Badge
                      className="flex h-full w-full justify-center"
                      icon={isValidAPIKey ? CheckIcon : XMarkIcon}
                      color={isValidAPIKey ? 'success' : 'warning'}
                    />
                  ) : null}
                </div>
                <span className="text-sm">
                  {isCheckingAPIKey ? 'Validating' : isValidAPIKey ? 'Connected' : 'Offline'}
                </span>
              </div>
            </CustomTimelineBody>
          </Card>
          <div className="mx-3 max-w-2xl overflow-scroll">
            <CustomCodeBlock
              showLineNumbers={true}
              currentTheme={currentTheme}
              startingLineNumber={1}
              codeString={initClientSnippet}
            ></CustomCodeBlock>
          </div>
        </div>
      </Timeline.Content>
    </Timeline.Item>
  );
}
