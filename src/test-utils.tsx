import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  client?: ApolloClient<NormalizedCacheObject>;
}

const AllTheProviders = ({
  children,
  client,
}: {
  children: React.ReactNode;
  client?: ApolloClient<NormalizedCacheObject>;
}) => {
  const content = <Router>{children}</Router>;

  return client ? (
    <ApolloProvider client={client}>{content}</ApolloProvider>
  ) : (
    content
  );
};

const customRender = (ui: ReactElement, options?: CustomRenderOptions) => {
  const { client, ...rest } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders client={client}>{children}</AllTheProviders>
    ),
    ...rest,
  });
};

export * from "@testing-library/react";
export { customRender as render };
