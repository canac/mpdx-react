import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';
import fetch from 'isomorphic-fetch';
import generatedIntrospection from '../../graphql/possibleTypes.generated';
import snackNotifications from '../components/Snackbar/Snackbar';
import { relayStylePaginationWithNodes } from './relayStylePaginationWithNodes';

const ignoredkeyArgsForPagination = ['before', 'after', 'first', 'last'];
const paginationFieldPolicy = relayStylePaginationWithNodes((args) =>
  args
    ? Object.keys(args).filter(
        (arg) => !ignoredkeyArgsForPagination.includes(arg),
      )
    : undefined,
);

export const cache = new InMemoryCache({
  possibleTypes: generatedIntrospection.possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        contacts: paginationFieldPolicy,
        userNotifications: paginationFieldPolicy,
      },
    },
  },
});

const httpLink = createHttpLink({
  uri: `${process.env.SITE_URL}/api/graphql`,
  fetch,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => snackNotifications.error(message));
  }

  if (networkError) snackNotifications.error(networkError.message);
});

if (process.browser && process.env.NODE_ENV === 'production') {
  persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  });
}

const client = new ApolloClient({
  link: errorLink.concat(httpLink),
  cache,
  assumeImmutableResults: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
  },
});

export const ssrClient = (
  token?: string,
): ApolloClient<NormalizedCacheObject> => {
  const httpLink = createHttpLink({
    uri: process.env.API_URL,
    fetch,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
      Accept: 'application/json',
    },
  });

  return new ApolloClient({
    link: errorLink.concat(httpLink),
    ssrMode: true,
    assumeImmutableResults: true,
    cache: new InMemoryCache({
      possibleTypes: generatedIntrospection.possibleTypes,
    }),
  });
};

export default client;
