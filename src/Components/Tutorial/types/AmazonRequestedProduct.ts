import type { MarketplaceEnum } from '.';

export type AmazonRequestedProduct = {
  amazonProductID: string;
  selectedMarketplace: MarketplaceEnum.Amazon;
  productURL: string;
};
