export const getCartQuery = `query ($id: ID!) {
    getCart(id: $id) {
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
                    offer {
                        errors {
                            code
                            message
                            details {
                                ... on AmazonOfferErrorDetails {
                                productIds
                            }
                            }
                        }
                        subtotal {
                            value
                            displayValue
                            currency
                        }
                        margin {
                            value
                            displayValue
                            currency
                        }
                        shippingMethods {
                            id
                            label
                            price {
                                value
                                displayValue
                                currency
                            }
                            taxes {
                                value
                                displayValue
                                currency
                            }
                            total {
                                value
                                displayValue
                                currency
                            }
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
                    offer {
                        errors {
                            code
                            message
                            details {
                                ... on ShopifyOfferErrorDetails {
                                variantIds
                            \t}
                            }
                        }
                        subtotal {
                            value
                            displayValue
                            currency
                        }
                        margin {
                            value
                            displayValue
                            currency
                        }
                        shippingMethods {
                            id
                            label
                            price {
                                value
                                displayValue
                                currency
                            }
                            taxes {
                                value
                                displayValue
                                currency
                            }
                            total {
                                value
                                displayValue
                                currency
                            }
                        }
                    }
                }
            }
        }
    }
}`;

export const getCartInputVariables = (cartId: string) => {
  return {
    id: cartId,
  }
}
