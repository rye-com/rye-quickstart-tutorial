import type { UserModel } from './UserModel';
import type { ACTION, SOURCE } from './constants';
import { AnalyticsBrowser } from '@segment/analytics-next';
import { isProd } from '../utils/env/isProd';

type StringLike = string | boolean | number;

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
  params?: Record<string, StringLike | Record<string, StringLike>>;

  /** Miscellaneous metadata associated with this event */
  properties?: Record<string, StringLike>;

  /**
   * Was the users action successful or not?
   *
   * Discussion on user vs programmer errors: https://github.com/rye-com/rye-quickstart-tutorial/pull/21#discussion_r1019604268
   */
  success?: boolean;

  // In google BigQuery (segment integration) nested data gets flattened out: { params: { id } } becomes { params_id }.
  // Therefore, we want to avoid nesting in a way that is "too" noisy.
  // Some nesting makes reading/writing code easier.
  // We also want to avoid prop spreading: `...props`.
  // Therefore, feel free to add new keys for new categories of data.
};

// Based on: https://github.com/rye-com/dev-console/blob/ccdaf725d7a9782cdd1a020b7b97399e4aaa4528/src/app/utils.ts#L59
// TODO: Turn this into a shareable library
// cspell:disable-next-line
const devKey = 'yv3GSCG8FGnDawBWNCRYbKDRjvLHDqdx';
// cspell:disable-next-line
const prodKey = 'bN1nSWedUvp3WNAB9baPCNG87RrEkrSk';
const writeKey = isProd ? prodKey : devKey;

const analytics = AnalyticsBrowser.load({ writeKey });
analytics.page();

export const getRyelytics = (
  options?: Partial<{
    /** Defaults to checking if `sessionStorage.getItem('enableRyelyticsLogging')` is truthy/defined */
    enableLogging: boolean | string | null;
  }>,
) => {
  const enableLogging = options?.enableLogging ?? sessionStorage.getItem('enableRyelyticsLogging');

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
 *
 * You can also have your own local instance by doing:
 * ```tsx
 * import { getRyelytics } from 'shared-analytics/getRyelytics';
 *
 * const ryelytics = getRyelytics({ enableLogging: true });
 * ```
 *
 * This allows you enable analytics logging for only certain parts of the codebase.
 */
export const ryelytics = getRyelytics();

export type Ryelytics = ReturnType<typeof getRyelytics>;
