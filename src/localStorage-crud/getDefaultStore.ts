import type { Store, ThemeEnum } from '../Components/Tutorial/types';
import { MarketplaceEnum } from '../Components/Tutorial/types';
import { getNextRandomProduct } from '../Components/Tutorial/utils/getNextRandomProduct';
import { queryParameters } from '../utils/getParams.utils';
import { detectThemePreference } from './detectThemePreference';

export const getDefaultStore = (): Store => {
  const queryTheme = queryParameters.get('theme') as ThemeEnum;

  return {
    apiConfig: JSON.parse(window.localStorage.getItem('apiConfig') || '{}'),
    appTheme: queryTheme || detectThemePreference(),
    requestedProduct: JSON.parse(
      window.sessionStorage.getItem('requestedProduct') ||
        (() => {
          const nextProduct = getNextRandomProduct(MarketplaceEnum.Amazon);
          // I like seeing a new product every page load,
          // but we could stick to one random product per tab by uncommenting this:
          // window.sessionStorage.setItem('requestedProduct', JSON.stringify(nextProduct));
          return JSON.stringify(nextProduct);
        })(),
    ),
    address: JSON.parse(
      window.localStorage.getItem('address') ||
        JSON.stringify({
          firstName: 'Will',
          lastName: 'Smith',
          address1: 'Bel Air Mansion',
          address2: '',
          city: 'Beverly Hills',
          stateCode: 'CA',
          zipCode: '90210',
          phone: '1234567890',
          email: 'tutorial@rye.com',
        }),
    ),
  };
};
