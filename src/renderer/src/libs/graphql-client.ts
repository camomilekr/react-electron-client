import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import { navigateTo } from '@/libs/navigator';
import { useAuthStore } from '@/stores/useAuthStore';
import { ConvertedError } from '@/types/common';

import { ROUTES } from '@/constants/index';

const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().currentUser?.accessToken ?? undefined;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : undefined,
    },
  };
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors && graphQLErrors[0].extensions?.convertedError) {
    const convertedError = graphQLErrors[0].extensions.convertedError as ConvertedError;

    if (
      convertedError?.code === 'EXPIRED_TOKEN' ||
      convertedError?.code === 'VERIFY_TOKEN_FAIL' ||
      convertedError?.code === 'INVALID_TOKEN'
    ) {
      useAuthStore.getState().setCurrentUser(null);
      navigateTo(ROUTES.LOGIN.path, { replace: true });
      return;
    }
  }
  return forward(operation);
});

const httpLink = createHttpLink({
  // You should use an absolute URL here
  credentials: 'include',
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
  }),
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  // fetchPolicy 참고: https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

export default apolloClient;
