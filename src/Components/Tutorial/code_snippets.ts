const indent = (code: string) => {
  const split = code.split('\n')
  // no need to indent single line code
  if(split.length === 1) return code;
  return split[0] + '\n' + split.slice(1, split.length).map(line => `  ${line}`).join('\n');
}

const formatQueryCode = (fnName: string, query: string, variables: object) => {
  return (
`function ${fnName}() {
  const variables = ${indent(JSON.stringify(variables, null, 2))};
  const query = gql\`${indent(query)}\`;
  const data = await client.request(query, variables, headers)
  console.log(JSON.stringify(data, undefined, 2))
}
${fnName}();`
  );
}

export const initializeClientSnippet = (RYE_API_TOKEN: string) =>
  `import { GraphQLClient, gql } from 'graphql-request'
const API_KEY = '${RYE_API_TOKEN}'

const endpoint = 'https://graphql.api.rye.com/v1/query'B000NQ10FK
const client = new GraphQLClient(endpoint)
const headers = {
  'Authorization': 'Basic ' + Buffer.from(API_KEY + ':').toString('base64'),
}`;


export const requestProductQuery = `mutation RequestProductByURL(
  $input: RequestProductByURLInput!
) {
  requestProductByURL(input: $input) {
    productID
  }
}`;
export const requestProductVariables = (productURL: string, marketplace: string) => {
  return {
    input: {
      url: productURL,
      marketplace: marketplace,
    },
  }
};
export const requestProductSnippet = (productURL: string, marketplace: string) => {
  return formatQueryCode("requestProduct", requestProductQuery, requestProductVariables(productURL, marketplace));
};

export const amazonProductFetchQuery = `query DemoAmazonProductFetch($input: ProductByIDInput!) {
  product: productByID(input: $input) {
    title
    vendor
    url
    isAvailable
    images {
      url
    }
    price {
      displayValue
    }
    ... on AmazonProduct {
      ASIN
    }
  }
}`

export const productFetchVariables = (productID: string, marketplace: string) => {
  return {
    input: {
      productID: productID,
      marketplace: marketplace,
    },
  }
}

export const amazonProductFetchSnippet = (productID: string) => {
  return formatQueryCode("fetchProduct", amazonProductOfferQuery, productFetchVariables(productID || "<AMAZON_PRODUCT_ID>", "AMAZON"));
}


export const shopifyProductFetchQuery = `query DemoShopifyProductByID($input: ProductByIDInput!) {
  product: productByID(input: $input) {
    title
    vendor
    url
    isAvailable
    variants {
      ... on ShopifyVariant {
        id
      }
      title
    }
    images {
      url
    }
    price {
      displayValue
    }
    ... on ShopifyProduct {
      tags
      storeCanonicalURL
    }
  }
}`

export const shopifyProductFetchSnippet = (productID: string) => {
  return formatQueryCode("fetchProduct", shopifyProductFetchQuery, productFetchVariables(productID || "<SHOPIFY_PRODUCT_ID>", "SHOPIFY"));
}

export const shopifyProductOfferQuery = `query ShopifyOffer($input: ShopifyOfferInput!) {
  shopifyOffer(input: $input) {
    offer {
      storeURL
      variantID
      subtotal {
        value
        currency
        displayValue
      }
      digitalItemTaxes {
        value
        currency
        displayValue
      }
      isDigitalItem
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
      }
    }
  }
}`


export const shopifyProductOfferVariables = (storeCanonicalURL: string, productVariantID: string, { city, stateCode }: {city: string, stateCode: string}) => {
  return {
    "input": {
      "variantID": productVariantID,
      "storeURL": storeCanonicalURL,
      "location": {
        "city": city,
        "stateCode": stateCode,
        "countryCode": "US"
      }
    }
  }
};
export const shopifyProductOfferSnippet = (storeCanonicalURL: string, productVariantID: string, { city, stateCode }: {city: string, stateCode: string}) => {
  return formatQueryCode("fetchProductOffer", shopifyProductOfferQuery, shopifyProductOfferVariables(storeCanonicalURL || "<SHOPIFY_STORE_CANONICAL_URL>", productVariantID || "<SHOPIFY_PRODUCT_VARIANT_ID>", { city, stateCode }));
}





export const amazonProductOfferQuery = `query AmazonOffer {
  amazonOffer(input: {
    productID: "B08C1W5N87",
    location: {
      city: "Berkeley",
      stateCode: "CA",
      countryCode: "US",
    }
  }) {
    offer {
      productID
      subtotal {
        value
        currency
        displayValue
      }
      taxes {
        value
        currency
        displayValue
      }
      shipping {
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
  }
}`

export const amazonProductOfferVariables = (productID: string, { city, stateCode}: {city: string, stateCode: string}) => {
  return {
    "input": {
      "productID": productID,
      "location": {
        "city": city,
        "stateCode": stateCode,
        "countryCode": "US"
      }
    }
  }
};
export const amazonProductOfferSnippet = (productID: string, { city, stateCode}: {city: string, stateCode: string}) => {
  return formatQueryCode("fetchProductOffer", amazonProductOfferQuery, amazonProductOfferVariables(productID, { city, stateCode }));
}
