import type { Address } from '../../../types/api-data/Address';

type APIConfiguration = {
  key: string;
  endpoint: string;
};

export enum ThemeEnum {
  Dark = 'dark',
  Light = 'light',
}

export enum MarketplaceEnum {
  Shopify = 'SHOPIFY',
  Amazon = 'AMAZON',
}

export type Store = {
  appTheme: string;
  apiConfig: APIConfiguration;
  requestedProduct: {
    productURL: string;
    shopifyProductID?: string;
    amazonProductID?: string;
    selectedMarketplace: MarketplaceEnum;
  };
  address: Address;
};

// Pedantically typed to force us to validate everything as we need it.
export type FetchProductResponse = {
  product: null | {
    variants: null | Array<{
      id: string;
      title: string;
    }>;
  };
};

type ApiAccessData = {
  clientSecret?: undefined | string;
  publishableAPIKey?: undefined | string;
};

export type FetchPaymentIntentResponse = {
  createShopifyPaymentIntent?: ApiAccessData;
  createAmazonPaymentIntent?: ApiAccessData;
};
