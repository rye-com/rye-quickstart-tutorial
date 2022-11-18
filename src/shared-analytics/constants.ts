// Based on https://github.com/rye-com/dev-console/blob/ccdaf725d7a9782cdd1a020b7b97399e4aaa4528/src/app/analytics.ts#L1
export const enum SOURCE {
  TOP_NAV_BAR = 'top_nav_bar',
  /** step 0 */
  API_KEY_STEP = 'api_key_step',
  /** step 1 */
  REQUEST_SCRAPE_STEP = 'request_scrape_step',
  /** step 2 */
  FETCH_PRODUCT_DATA_STEP = 'request_product_data_step',
  /** step 3 */
  FETCH_OFFERS_STEP = 'fetch_offers_step',
  /** step 4 */
  PAYMENT_INTENT_STEP = 'payment_intent_step',
  /** step 5 */
  CHECKOUT_STEP = 'checkout_step',
}

export const enum ACTION {
  /** Paste, manual typing, dropdown/select, etc */
  UPDATE = 'update',
  CLICK = 'click',
  ERROR = 'error',
}
