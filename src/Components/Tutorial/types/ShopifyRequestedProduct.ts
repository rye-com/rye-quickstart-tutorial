import type { MarketplaceEnum } from '.';

export type ShopifyRequestedProduct = {
  shopifyProductID: string;
  selectedMarketplace: MarketplaceEnum.Shopify;
  productURL: string;
};
