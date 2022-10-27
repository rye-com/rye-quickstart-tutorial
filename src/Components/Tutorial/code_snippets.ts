import { format } from "path";

function formatQueryCode(query: string, variables: object): string {
  return `
const variables = ${JSON.stringify(variables, null, 2)};
const query = gql\`${query}\`;
const data = await client.request(query, variables, headers)
console.log(JSON.stringify(data, undefined, 2))`;
}

export const initializeClientSnippet = (
  RYE_API_TOKEN: string
) => `import { GraphQLClient, gql } from 'graphql-request'

const API_KEY = '${RYE_API_TOKEN || "<YOUR RYE API KEY>"}'

const endpoint = 'https://graphql.api.rye.com/v1/query'
const client = new GraphQLClient(endpoint)
const headers = {
  'Authorization': 'Basic ' + Buffer.from(API_KEY + ':').toString('base64'),
}`;

export const requestProductSnippet = (
  productURL: string,
  marketplace: string
) => {
  const query = `mutation RequestProductByURL(
  $input: RequestProductByURLInput!
) {
  requestProductByURL(input: $input) {
    productID
  }
}`;
  const variables = {
    input: {
      url: productURL,
      marketplace: marketplace,
    },
  };
  return formatQueryCode(query, variables);
};

export const amazonProductFetchSnippet = (productID: string) => `
const query = gql\`query DemoAmazonShopifyProductFetch($input: ProductByIDInput!) {
  amazonItem: productByID(input: $input) {
    title
    description
    vendor
    url
    isAvailable
    images {
      url
    }
    variants {
      title
    }
    price {
      displayValue
    }
    ... on AmazonProduct {
      ASIN
      titleExcludingVariantName
    }
  }
}\`

const variables = {
  "input": {
    "id": "${productID || "<YOUR AMAZON PRODUCT ID>"}",
    "marketplace": "AMAZON"
  }
}

const data = await client.request(query, variables, headers)
console.log(JSON.stringify(data, undefined, 2))
`;
