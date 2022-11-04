import type { UserModel } from './UserModel';
import type { ACTION, SOURCE } from './constants';
import type { Analytics, AnalyticsBrowser } from '@segment/analytics-next';

export const getRyeAnalytics = (analytics: AnalyticsBrowser) => {
  return {
    identify: (userInfoModel: UserModel) => {
      analytics.identify(userInfoModel.uid, {
        email: userInfoModel.email,
      });
    },

    page: (pageName: string) => {
      analytics.page(pageName);
    },

    track: (
      source: SOURCE,
      action: ACTION,
      noun: string,
      properties?: Parameters<Analytics['track']>[1],
      // Not used yet. Uncomment if you need these.
      // _options?: Parameters<Analytics['track']>[2],
      // _callback?: Parameters<Analytics['track']>[3],
    ) => {
      analytics.track(
        [source.valueOf(), action.valueOf(), noun].join('_'),
        properties,
        // _options,
        // _callback,
      );
    },
  };
};
