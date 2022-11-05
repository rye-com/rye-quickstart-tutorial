// Copied from https://github.com/rye-com/dev-console/blob/ccdaf725d7a9782cdd1a020b7b97399e4aaa4528/src/app/analytics.ts#L1
export enum SOURCE {
  TUTORIAL_MODULE = 'tutorial',

  AUTH_SECTION = 'auth',

  CONSOLE_MENU = 'console_menu',

  API_KEY_MODULE = 'api_key_module',
  SCHEDULE_MODULE = 'schedule_module',
  WEBHOOK_MODULE = 'webhook_module',
  MARGIN_AMOUNT_MODULE = 'margin_amount_module',
  REQUEST_PRODUCT_URL_MODULE = 'request_product_url_module',
  REQUEST_STORE_URL_MODULE = 'request_store_url_module',
  DEVELOPER_RESOURCES_MODULE = 'developer_resources_module',
}

export enum ACTION {
  /** Paste, manual typing, etc */
  KEYBOARD = 'keyboard',
  CLICK = 'click',
  ERROR = 'error',
}
