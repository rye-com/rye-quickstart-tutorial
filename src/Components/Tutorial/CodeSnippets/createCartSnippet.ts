export const createCartMutation = `mutation ($input: CartCreateInput!) {
    createCart(input: $input) {
        cart {
          id
        }
    }
}`

export const createCartInputVariables = () => {
  return {
    input: {
      items: {},
    },
  };
};

export const createCartInput = `{
  "input": {
    "items": {}
  }
}`
