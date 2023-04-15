import { MarketplaceEnum } from "../types";

export const addItemToCartMutation = `mutation ($input: CartItemsAddInput!) {
    addCartItems(input: $input) {
        cart {
            id
            stores {
                ... on AmazonStore {
                    store
                    cartLines {
                        quantity
                        product {
                            id
                        }
                    }
                }
                ... on ShopifyStore {
                    store
                    cartLines {
                        quantity
                        variant {
                            id
                        }
                    }
                }
            }
        }
    }
}`;

export const addItemToCartInputVariables = (cartId: string, productId: string, marketplace: MarketplaceEnum) => {
  const items = marketplace === MarketplaceEnum.Shopify ? {
    shopifyCartItemsInput: {
      quantity: 1,
      variantId: productId
    }
  } : {
    amazonCartItemsInput: {
      quantity: 1,
      productId: productId
    }
  }

  return {
    input: {
      id: cartId,
      items: items,
    }
  }
}
