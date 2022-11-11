// Based on https://github.com/rye-com/dev-console/blob/ccdaf725d7a9782cdd1a020b7b97399e4aaa4528/src/app/analytics.ts#L1
export const enum SOURCE {
  TOP_NAV_BAR = 'top_nav_bar',
  /** step 0 */
  API_KEY_STEP = 'api_key_step',
  /** step 1 */
  REQUEST_SCRAPE_STEP = 'request_scrape_step',
}

export const enum ACTION {
  /** Paste, manual typing, dropdown/select, etc */
  UPDATE = 'update',
  CLICK = 'click',
  ERROR = 'error',
}
