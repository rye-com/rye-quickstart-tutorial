export const updateBuyerIdentityMutation = `mutation updateCartBuyerIdentity($input: CartBuyerIdentityUpdateInput!) {
  updateCartBuyerIdentity(input: $input) {
    cart {
      id
      stores {
        ... on AmazonStore {
          store
          offer {
            subtotal {
              value
              currency
              displayValue
            }
            margin {
              value
              currency
              displayValue
            }
            notAvailableIds
            shippingMethods {
              id
              label
              taxes {
                value
                currency
                displayValue
              }
              total {
                value
                currency
                displayValue
              }
            }
            selectedShippingMethod {
              id
              label
            }
            errors {
              code
              message
              details {
                productIds
              }
            }
          }
          errors {
            message
            code
            details {
              productIds
            }
          }
          requestId
          isSubmitted
        }
        ... on ShopifyStore {
          store
          offer {
            subtotal {
              value
              currency
              displayValue
            }
            margin {
              value
              currency
              displayValue
            }
            notAvailableIds
            shippingMethods {
              id
              label
              price {
                value
                currency
                displayValue
              }
              taxes {
                value
                currency
                displayValue
              }
              total {
                value
                currency
                displayValue
              }
            }
            selectedShippingMethod {
              id
              label
            }
            errors {
              code
              message
              details {
                variantIds
              }
            }
          }
          errors {
            message
            code
            details {
              variantIds
            }
          }
          requestId
          isSubmitted
        }
      }
    }
    errors {
      message
      code
    }
  }
}`


export const updateBuyerIdentityInputVariables = ({
  address: {
    address1,
    address2,
    city,
    countryCode,
    email,
    firstName,
    lastName,
    phone,
    postalCode,
    provinceCode,
  },
  cartId
}: {
  address: {
    address1: string;
    address2: string;
    city: string;
    countryCode: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    postalCode: string;
    provinceCode: string;
  },
  cartId: string;
}) => ({
  "input": {
    "buyerIdentity": {
      "address1": address1,
      "address2": address2,
      "city": city,
      "countryCode": countryCode,
      "email": email,
      "firstName": firstName,
      "lastName": lastName,
      "phone": phone,
      "postalCode": postalCode,
      "provinceCode": provinceCode,
    },
    "id": cartId,
  }
});

export const updateBuyerIdentityInput = `{
  "input": {
    "items": {}
  }
}`
