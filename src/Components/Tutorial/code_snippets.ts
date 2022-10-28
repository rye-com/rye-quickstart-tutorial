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
const API_KEY = '${RYE_API_TOKEN || "<YOUR RYE API KEY>"}'

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
export const requestProductSnippet = (productURL: string, marketplace: string) => {
  const variables = {
    input: {
      url: productURL,
      marketplace: marketplace,
    },
  };
  return formatQueryCode("requestProduct", requestProductQuery, variables);
};

export const amazonProductFetchQuery = `query DemoAmazonProductFetch($input: ProductByIDInput!) {
  amazonItem: productByID(input: $input) {
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

export const amazonProductFetchSnippet = (productID: string) => {
  const variables = {
    input: {
      id: productID || "<YOUR AMAZON PRODUCT ID>",
      marketplace: "AMAZON",
    },
  };
  return formatQueryCode("fetchProduct", amazonProductFetchQuery, variables);
}


export const shopifyProductFetchQuery = `query DemoShopifyProductByID($input: ProductByIDInput!) {
  shopifyProduct: productByID(input: $input) {
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
    ... on ShopifyProduct {
      tags
    }
  }
}`

export const shopifyProductFetchSnippet = (productID: string) => {
  const variables = {
    input: {
      id: productID || "<YOUR SHOPIFY PRODUCT ID>",
      marketplace: "SHOPIFY",
    },
  };
  return formatQueryCode("fetchProduct", shopifyProductFetchQuery, variables);
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


export const shopifyProductOfferSnippet = (productID: string, { city, stateCode}: {city: string, stateCode: string}) => {
  const variables = {
    "input": {
      "productID": productID || "<YOUR SHOPIFY PRODUCT ID>",
      "location": {
        "city": city,
        "stateCode": stateCode,
        "countryCode": "US"
      }
    }
  };
  return formatQueryCode("fetchProductOffer", shopifyProductOfferQuery, variables);
}
