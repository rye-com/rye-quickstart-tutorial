import { useState } from 'react';
import type { Variables } from 'graphql-request';
import { GraphQLClient } from 'graphql-request';

const RYE_SHOPPER_IP_HEADER_KEY = 'x-rye-shopper-ip';
const IP_JSON_URL = `https://api.ipify.org/?format=json`;

const gqlClient = new GraphQLClient('https://graphql.api.rye.com/v1/query');

let ipAddressCache= '';

const makeGQLRequest = async <T>(
  query: string,
  variables: Variables, // using generic TVars for this causes a weird type error with client.request call
  apiKey: string,
): Promise<T> => {
  if (ipAddressCache === '') {
    const ipJson = await fetch(IP_JSON_URL);
    const ipObj = await ipJson.json();
    ipAddressCache = ipObj.ip;
  }
  const headers = {
    Authorization: 'Basic ' + window.btoa(apiKey + ':'),
    [RYE_SHOPPER_IP_HEADER_KEY]: ipAddressCache,
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
