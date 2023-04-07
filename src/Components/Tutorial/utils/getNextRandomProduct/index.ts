import { MarketplaceEnum } from '../../types';
import type { AmazonRequestedProduct } from '../../types/AmazonRequestedProduct';
import type { ShopifyRequestedProduct } from '../../types/ShopifyRequestedProduct';
import { randomAmazonProducts } from './random-amazon-products';
import { randomShopifyProducts } from './random-shopify-products';

/**
 * Get next product, from a list of random products lol
 */
export const getNextRandomProduct = (
  storeType: MarketplaceEnum,
): ShopifyRequestedProduct | AmazonRequestedProduct => {
  // loop through products, instead of being truly random:
  const lastIndex = parseInt(
    window.localStorage.getItem(`last${storeType}ProductIndex`) ?? '-1',
    10,
  );

  const productList =
    storeType === MarketplaceEnum.Amazon ? randomAmazonProducts : randomShopifyProducts;

  let nextIndex = lastIndex + 1;
  let nextProduct = productList[nextIndex];
  if (!nextProduct) {
    nextIndex = 0;
    nextProduct = productList[nextIndex];
  }

  window.localStorage.setItem(`last${storeType}ProductIndex`, nextIndex.toString());

  if (!nextProduct || nextProduct.id === undefined || nextProduct.url === undefined) {
    throw new Error('Devins next product logic is broken');
  }

  if (storeType === MarketplaceEnum.Shopify) {
    return {
      shopifyProductID: nextProduct.id,
      selectedMarketplace: MarketplaceEnum.Shopify,
      productURL: nextProduct.url,
    };
  }

  return {
    amazonProductID: nextProduct.id,
    selectedMarketplace: MarketplaceEnum.Amazon,
    productURL: nextProduct.url,
  };
};
