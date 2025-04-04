import { useQuery } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import { graphql } from "../gql";
import { MeQuery } from "../gql/graphql";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import { Restaurants } from "../pages/client/restaurant";

const ClientRoutes = [
  <Route path="/" exact>
    <Restaurants />
  </Route>,
];

const ME_QUERY = graphql(`
  query Me {
    me {
      id
      email
      role
      verified
    }
  }
`);

export const LoggedInRouter = () => {
  const onClick = () => {
    isLoggedInVar(false);
  };
  const { data, loading, error } = useQuery<MeQuery>(ME_QUERY);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Switch>
        {data.me.role === "Client" && ClientRoutes}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
