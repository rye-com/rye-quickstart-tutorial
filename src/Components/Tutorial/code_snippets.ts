import type { Address } from '../../types/api-data/Address';

const indent = (code: string) => {
  const split = code.split('\n');
  // no need to indent single line code
  if (split.length === 1) return code;
  return (
    split[0] +
    '\n' +
    split
      .slice(1, split.length)
      .map((line) => `  ${line}`)
      .join('\n')
  );
};

const formatQueryCode = (fnName: string, query: string, variables: object) => {
  return `function ${fnName}() {
  const variables = ${indent(JSON.stringify(variables, null, 2))};
  const query = gql\`${indent(query)}\`;
  const data = await client.request(query, variables, headers)
  console.log(JSON.stringify(data, undefined, 2))
}
${fnName}();`;
};

export const initializeClientSnippet = (RYE_API_TOKEN: string) =>
  `import { GraphQLClient, gql } from 'graphql-request'
const API_KEY = '${RYE_API_TOKEN}'

const endpoint = 'https://graphql.api.rye.com/v1/query'
const client = new GraphQLClient(endpoint)
const headers = {
  'Authorization': 'Basic ' + 
    Buffer.from(API_KEY + ':').toString('base64'),
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
  };
};
export const requestProductSnippet = (productURL: string, marketplace: string) => {
  return formatQueryCode(
    'requestProduct',
    requestProductQuery,
    requestProductVariables(productURL, marketplace),
  );
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
}`;

export const productFetchVariables = (productID: string, marketplace: string) => {
  return {
    input: {
      id: productID,
      marketplace: marketplace,
    },
  };
};

export const amazonProductFetchSnippet = (productID?: string) => {
  return formatQueryCode(
    'fetchProduct',
    amazonProductFetchQuery,
    productFetchVariables(productID || '<AMAZON_PRODUCT_ID>', 'AMAZON'),
  );
};

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
}`;

export const shopifyProductFetchSnippet = (productID?: string) => {
  return formatQueryCode(
    'fetchProduct',
    shopifyProductFetchQuery,
    productFetchVariables(productID || '<SHOPIFY_PRODUCT_ID>', 'SHOPIFY'),
  );
};

export const shopifyProductOfferQuery = `query ShopifyOffer($input: ShopifyOfferInput!) {
  shopifyOffer(input: $input) {
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
    margin {
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
}`;

export const shopifyProductOfferVariables = (
  productVariantID: string,
  { city, stateCode }: { city: string; stateCode: string },
) => {
  return {
    input: {
      variantID: productVariantID,
      location: {
        city: city,
        stateCode: stateCode,
        countryCode: 'US',
      },
    },
  };
};
export const shopifyProductOfferSnippet = (
  productVariantID: string,
  { city, stateCode }: { city: string; stateCode: string },
) => {
  return formatQueryCode(
    'fetchProductOffer',
    shopifyProductOfferQuery,
    shopifyProductOfferVariables(productVariantID || '<SHOPIFY_PRODUCT_VARIANT_ID>', {
      city,
      stateCode,
    }),
  );
};

export const amazonProductOfferQuery = `query AmazonOffer($input: AmazonOfferInput!) {
  amazonOffer(input: $input) {
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
    margin {
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
}`;

export const amazonProductOfferVariables = (
  { city, stateCode }: { city: string; stateCode: string },
  productID: string,
) => {
  return {
    input: {
      productID: productID,
      location: {
        city: city,
        stateCode: stateCode,
        countryCode: 'US',
      },
    },
  };
};

export const amazonProductOfferSnippet = (
  { city, stateCode }: { city: string; stateCode: string },
  productID?: string,
) => {
  return formatQueryCode(
    'fetchProductOffer',
    amazonProductOfferQuery,
    amazonProductOfferVariables({ city, stateCode }, productID || '<AMAZON_PRODUCT_ID>'),
  );
};

export const shopifyPaymentIntentVariables = (
  productVariantID: string,
  { firstName, lastName, email, phone, address1, address2, city, stateCode, zipCode }: Address,
  promoCode?: string,
) => {
  return {
    input: {
      variantID: productVariantID,
      address: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        address1: address1,
        address2: address2,
        city: city,
        stateCode: stateCode,
        countryCode: 'US',
        zip: zipCode,
      },
      promoCode: promoCode,
    },
  };
};
export const shopifyPaymentIntentQuery = `mutation DemoShopifyPaymentIntent(
  $input: CreateShopifyPaymentIntentInput!
  ) {
  createShopifyPaymentIntent(input: $input) {
    clientSecret
    publishableAPIKey
  }
}`;

export const shopifyPaymentIntentSnippet = (
  productVariantID: string,
  { firstName, lastName, email, phone, address1, address2, city, stateCode, zipCode }: Address,
  promoCode?: string,
) => {
  return formatQueryCode(
    'createPaymentIntent',
    shopifyPaymentIntentQuery,
    shopifyPaymentIntentVariables(
      productVariantID || '<SHOPIFY_PRODUCT_VARIANT_ID>',
      { firstName, lastName, email, phone, address1, address2, city, stateCode, zipCode },
      promoCode,
    ),
  );
};

export const amazonPaymentIntentVariables = (
  productID: string,
  { firstName, lastName, email, phone, address1, address2, city, stateCode, zipCode }: Address,
) => {
  return {
    input: {
      productID: productID,
      address: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        address1: address1,
        address2: address2,
        city: city,
        stateCode: stateCode,
        countryCode: 'US',
        zip: zipCode,
      },
    },
  };
};
export const amazonPaymentIntentQuery = `mutation DemoAmazonPaymentIntent(
  $input: CreateAmazonPaymentIntentInput!
  ) {
  createAmazonPaymentIntent(input: $input) {
    clientSecret
    publishableAPIKey
  }
}`;

export const amazonPaymentIntentSnippet = (
  { firstName, lastName, email, phone, address1, address2, city, stateCode, zipCode }: Address,
  productID?: string,
) => {
  return formatQueryCode(
    'createPaymentIntent',
    amazonPaymentIntentQuery,
    amazonPaymentIntentVariables(productID || '<AMAZON_PRODUCT_ID>', {
      firstName,
      lastName,
      email,
      phone,
      address1,
      address2,
      city,
      stateCode,
      zipCode,
    }),
  );
};

export const checkoutFormCode = `import {Elements, useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js/pure';
import {useState, useMemo} from 'react';

export const App = () => {
  const clientSecret = fetchPaymentIntentResponse?.createShopifyPaymentIntent?.clientSecret || fetchPaymentIntentResponse?.createAmazonPaymentIntent?.clientSecret;
  const stripeAPIKey = fetchPaymentIntentResponse?.createShopifyPaymentIntent?.publishableAPIKey || fetchPaymentIntentResponse?.createAmazonPaymentIntent?.publishableAPIKey;

  const stripePromise = useMemo(() => {
    if(stripeAPIKey) {
      return loadStripe(stripeAPIKey);
    }

  }, [stripeAPIKey])

  return (
    {stripePromise && clientSecret ?
      <Elements  stripe={stripePromise} options={{clientSecret: clientSecret}}>
        <CheckoutForm />
      </Elements>
    : <></>}
  )
}

const CheckoutForm = () => {
  const [paymentSucceeded, setPaymentSucceeded] = useState<boolean>(false)
  const [paymentInProgress, setPaymentInProgress] = useState<boolean>(false)
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setPaymentInProgress(true);
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //Elements instance that was used to create the Payment Element
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
    } else {
      setPaymentSucceeded(true);
    }
    setPaymentInProgress(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement/>
      <Button disabled={!stripe || paymentInProgress}></Button>
    </form>
  )
};`;
