import 'semantic-ui-css/semantic.min.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';

import Routes from './routes';
import registerServiceWorker from './registerServiceWorker';

const httpLink = createHttpLink({
  uri: 'http://localhost:8081/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'x-token': localStorage.getItem('token'),
      'x-refreshtoken': localStorage.getItem('refreshToken'),
      authorization: token,
    },
  };
});

const afterwareLink = new ApolloLink((operation, forward) => forward(operation).map((response) => {
  const context = operation.getContext();
  const { response: { headers } } = context;

  if (headers) {
    const token = headers.get('x-token');
    const refreshToken = headers.get('x-refresh-token');

    if (token) {
      localStorage.setItem('x-token', token);
    }
    if (refreshToken) {
      localStorage.setItem('x-refresh-token', refreshToken);
    }
  }
  return response;
}));

authLink.concat(afterwareLink);

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>,
  document.getElementById('root'),
);
registerServiceWorker();
