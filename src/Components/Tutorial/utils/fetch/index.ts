import { useState } from 'react';
import type { Variables } from 'graphql-request';
import { GraphQLClient } from 'graphql-request';

const RYE_SHOPPER_IP_HEADER_KEY = 'rye-shopper-ip';
const IP_JSON_URL = `https://api.ipify.org/?format=json`;

const gqlClient = new GraphQLClient('https://graphql.api.rye.com/v1/query');

const EMPTY_CLIENT_IP = '<< Insert IP address here >>';

let ipAddressCache= '';

const makeGQLRequest = async <T>(
  query: string,
  variables: Variables, // using generic TVars for this causes a weird type error with client.request call
  authHeaders: string,
): Promise<T> => {
  const headers = JSON.parse(authHeaders);
  if (ipAddressCache === '' || headers?.[RYE_SHOPPER_IP_HEADER_KEY] === EMPTY_CLIENT_IP) {
    const ipJson = await fetch(IP_JSON_URL);
    const ipObj = await ipJson.json();
    ipAddressCache = ipObj.ip;
    headers[RYE_SHOPPER_IP_HEADER_KEY] = ipAddressCache;
  }
  return gqlClient.request<T>(query, variables, headers);
};

export const useRequest = <T>(graphQLQuery: string) => {
  const [data, setData] = useState<T | null>(null); //data could be in various forms
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  function callback(authHeaders: string, variables: Variables) {
    let ignore = false;
    const request = async () => {
      setLoading(true);
      try {
        setError(null);
        const response = await makeGQLRequest<T>(graphQLQuery, variables, authHeaders);
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
