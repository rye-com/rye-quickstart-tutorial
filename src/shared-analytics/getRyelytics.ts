import type { UserModel } from './UserModel';
import type { ACTION, SOURCE } from './constants';
import { AnalyticsBrowser } from '@segment/analytics-next';

type RyelyticsProperties = {
  /** Feel free to add new SOURCE values to shared-analytics/constants */
  source: SOURCE;
  /** Feel free to add new ACTION values to shared-analytics/constants */
  action: ACTION;
  /**
   * A proper noun, like "Request scrape button", not "Request scrape"
   *
   * noun is used to generate the eventName like so:
   * ```tsx
   * const eventName = capitalize(noun.replaceAll('_', ' '))
   * ```
   */
  noun: string;

  /** User inputs or request parameters */
  params?: Record<string, string | boolean | number>;

  // In google BigQuery (segment integration) nested data gets flattened out: { params: { id } } becomes { params_id }.
  // Therefore, we want to avoid nesting in a way that is "too" noisy.
  // Some nesting makes reading/writing code easier.
  // We also want to avoid prop spreading: `...props`.
  // Therefore, feel free to add new keys for new categories of data.
};

// Based on: https://github.com/rye-com/dev-console/blob/ccdaf725d7a9782cdd1a020b7b97399e4aaa4528/src/app/utils.ts#L59
export const getRyelytics = () => {
  const devKey = 'yv3GSCG8FGnDawBWNCRYbKDRjvLHDqdx';
  const prodKey = 'bN1nSWedUvp3WNAB9baPCNG87RrEkrSk';
  const writeKey = window.location.origin === 'https://tutorial.rye.com' ? prodKey : devKey;

  const analytics = AnalyticsBrowser.load({ writeKey });
  analytics.page();

  const enableLogging = sessionStorage.getItem('enableRyelyticsLogging') === '1';

  return {
    identify: ({ uid, ...userInfoModel }: Partial<UserModel>) => {
      if (enableLogging) {
        console.log('ryelytics.identify', userInfoModel);
      }
      // https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
      if (uid) {
        return analytics.identify(uid, userInfoModel);
      } else {
        return analytics.identify(userInfoModel);
      }
    },

    page: (pageName: string) => {
      if (enableLogging) {
        console.log('ryelytics.page', pageName);
      }
      return analytics.page(pageName);
    },

    track: (event: RyelyticsProperties) => {
      if (enableLogging) {
        console.log('ryelytics.track', event);
      }
      return analytics.track(
        // Searching google for "segment analytics.track", opening first 10 results, and searching those pages for ".track(" reveals a clear pattern:
        // They always pass an eventName initial string like "Clicked Pay" before the event properties.
        [event.source, event.action, event.noun].join('_'),
        event,
      );
    },
  };
};

/**
 * Global ryelytics instance (shared across app)
 */
export const ryelytics = getRyelytics();

export type Ryelytics = ReturnType<typeof getRyelytics>;
