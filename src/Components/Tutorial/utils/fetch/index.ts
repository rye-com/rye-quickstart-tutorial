import { useState } from 'react';
import type { Variables } from 'graphql-request';
import { GraphQLClient } from 'graphql-request';

const gqlClient = new GraphQLClient('https://graphql.api.rye.com/v1/query');

const makeGQLRequest = <T>(
  query: string,
  variables: Variables, // using generic TVars for this causes a weird type error with client.request call
  apiKey: string,
): Promise<T> => {
  const headers = {
    Authorization: 'Basic ' + window.btoa(apiKey + ':'),
  };
  return gqlClient.request<T>(query, variables, headers);
};

export const useRequest = <T>(graphQLQuery: string) => {
  const [data, setData] = useState<T | null>(null); //data could be in various forms
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  function callback(key: string, variables: Variables) {
    let ignore = false;
    const request = async () => {
      setLoading(true);
      try {
        setError(null);
        const response = await makeGQLRequest<T>(graphQLQuery, variables, key);
        if (!ignore) setData(response);
      } catch (err: unknown) {
        setError(err);
        setData(null);
      }
      setLoading(false);
    };
    request();
    return () => {
      ignore = true;
    };
  }

  return { data, loading, error, callback };
};
