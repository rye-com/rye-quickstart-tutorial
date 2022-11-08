// Based on https://github.com/rye-com/dev-console/blob/ccdaf725d7a9782cdd1a020b7b97399e4aaa4528/src/app/analytics.ts#L1
export const enum SOURCE {
  TUTORIAL_MODULE = 'tutorial',
}

export const enum ACTION {
  /** Paste, manual typing, etc */
  KEYBOARD = 'keyboard',
  CLICK = 'click',
  ERROR = 'error',
}
