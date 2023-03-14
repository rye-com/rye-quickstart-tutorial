import { useState } from 'react';
import type { Variables } from 'graphql-request';
import { GraphQLClient } from 'graphql-request';
import { amazonProductFetchQuery } from '../../code_snippets';

const gqlClient = new GraphQLClient('https://graphql.api.rye.com/v1/query');

const makeGQLRequest = (
  query: string,
  variables: Variables, // using generic TVars for this causes a weird type error with client.request call
  apiKey: string,
) => {
  const headers = {
    Authorization: 'Basic ' + window.btoa(apiKey + ':'),
  };
  return gqlClient.request(query, variables, headers);
};

export const useRequest = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const variables = {
    input: {
      id: 'B073K14CVB',
      marketplace: 'AMAZON',
    },
  };

  function callback(key: string) {
    let ignore = false;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        setError({});
        const response = await makeGQLRequest(amazonProductFetchQuery, variables, key);
        if (!ignore) setData(response);
      } catch (err: any) {
        setError(err);
        setData({});
      }
      setLoading(false);
    };
    fetchProduct();
    return () => {
      ignore = true;
    };
  }

  return { data, loading, error, callback };
};
