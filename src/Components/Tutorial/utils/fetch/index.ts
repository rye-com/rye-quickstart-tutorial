import { useState } from 'react';
import type { Variables } from 'graphql-request';
import { GraphQLClient } from 'graphql-request';

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

export const useRequest = (graphQLQuery: string, variables: Variables) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null); //data could be in various forms
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  function callback(key: string) {
    let ignore = false;
    const request = async () => {
      setLoading(true);
      try {
        setError({});
        const response = await makeGQLRequest(graphQLQuery, variables, key);
        if (!ignore) setData(response);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
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
