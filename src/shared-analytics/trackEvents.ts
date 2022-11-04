import type { UserModel } from './UserModel';
import type { ACTION, SOURCE } from './constants';
import type { Analytics } from '@segment/analytics-next';

// copy from https://github.com/rye-com/dev-console/blob/ccdaf725d7a9782cdd1a020b7b97399e4aaa4528/src/app/utils.ts
export const trackIdentifyEvent = (userInfoModel: UserModel) => {
  window.analytics.identify(userInfoModel.uid, {
    email: userInfoModel.email,
  });
};

export const trackPageEvent = (pageName: string) => {
  window.analytics.page(pageName);
};

export const trackEvent = (
  source: SOURCE,
  action: ACTION,
  noun: string,
  properties?: Parameters<Analytics['track']>[1],
  _options?: Parameters<Analytics['track']>[2],
  _callback?: Parameters<Analytics['track']>[3],
) => {
  window.analytics.track(
    [source.valueOf(), action.valueOf(), noun].join('_'),
    properties,
    _options,
    _callback,
  );
};
