import type { UserModel } from './UserModel';
import type { ACTION, SOURCE } from './constants';

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
  ...rest: Array<{ [key: string]: any }>
) => {
  window.analytics.track(
    [source.valueOf(), action.valueOf(), noun].join('_'),
    filterUndefinedProps({
      ...rest,
    }),
  );
};

export const filterUndefinedProps = (obj: object) => {
  return Object.keys(obj).reduce((result, key) => {
    const propKey = key as keyof typeof obj;
    if (obj[propKey] !== undefined && obj[propKey] !== null) {
      result[propKey] = obj[propKey];
    }
    return result;
  }, {});
};
