import type { UserModel } from './UserModel';
import type { ACTION, SOURCE } from './constants';
import type { Analytics } from '@segment/analytics-next';
import { AnalyticsBrowser } from '@segment/analytics-next';

// Based on: https://github.com/rye-com/dev-console/blob/ccdaf725d7a9782cdd1a020b7b97399e4aaa4528/src/app/utils.ts#L59
export const getRyelytics = () => {
  const devKey = 'yv3GSCG8FGnDawBWNCRYbKDRjvLHDqdx';
  const prodKey = 'bN1nSWedUvp3WNAB9baPCNG87RrEkrSk';
  const writeKey = window.location.origin === 'https://tutorial.rye.com' ? prodKey : devKey;

  const analytics = AnalyticsBrowser.load({ writeKey });
  analytics.page();

  const logAnalyticsEvents = sessionStorage.getItem('logAnalyticsEvents') === '1';

  return {
    identify: (userInfoModel: UserModel) => {
      if (logAnalyticsEvents) {
        console.log('ryelytics.identify', userInfoModel);
      }
      return analytics.identify(userInfoModel.uid, {
        email: userInfoModel.email,
      });
    },

    page: (pageName: string) => {
      if (logAnalyticsEvents) {
        console.log('ryelytics.page', pageName);
      }
      return analytics.page(pageName);
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
      const eventName = [source.valueOf(), action.valueOf(), noun].join('_');
      if (logAnalyticsEvents) {
        console.log('ryelytics.track', eventName, properties);
      }
      return analytics.track(
        eventName,
        properties,
        // _options,
        // _callback,
      );
    },
  };
};
