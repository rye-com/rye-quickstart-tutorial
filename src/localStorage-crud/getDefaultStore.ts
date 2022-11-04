import type { Store } from '../Components/Tutorial/types';
import { Marketplace } from '../Components/Tutorial/types';
import { detectThemePreference } from './detectThemePreference';

export const getDefaultStore = (): Store => {
  return {
    apiConfig: JSON.parse(window.localStorage.getItem('apiConfig') || '{}'),
    appTheme: detectThemePreference(),
    requestedProduct: JSON.parse(
      window.localStorage.getItem('requestedProduct') ||
        JSON.stringify({
          shopifyProductID: '',
          amazonProductID: '',
          selectedMarketplace: Marketplace.Amazon,
          productURL: '',
        }),
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
