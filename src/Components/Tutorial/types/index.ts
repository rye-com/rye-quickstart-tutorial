import type { Address } from '../../../types/api-data/Address';

type APIConfiguration = {
  key: string;
  endpoint: string;
};

export const enum ThemeEnum {
  Dark = 'dark',
  Light = 'light',
}

export const enum MarketplaceEnum {
  Shopify = 'SHOPIFY',
  Amazon = 'AMAZON',
}

export type Store = {
  appTheme: string;
  compactView?: boolean;
  /** Must use Partial, because this starts off as an empty object. */
  apiConfig: Partial<APIConfiguration>;
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
    images: null | Array<{
      url: string;
    }>;
    title: string;
    price: null | {
      displayValue: string;
    };
  };
};

export type FetchProductOffersResponse = {
  amazonOffer?: {
    total: {
      currency: string;
      displayValue: string;
    };
  };
  shopifyOffer?: {
    total: {
      currency: string;
      displayValue: string;
    };
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
