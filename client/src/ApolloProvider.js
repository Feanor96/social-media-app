import React from "react";
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client"

const client = new ApolloClient({
    link: 'http://localhost:5000/',
    cache: new InMemoryCache()
})

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)