import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Restaurants } from "../pages/client/restaurants";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { NotFound } from "../pages/404";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { AddRestaurant } from "../pages/owner/add-restaurant";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { EditRestaurant } from "../pages/owner/edit-restaurant";
import { AddDish } from "../pages/owner/add-dish";
import { Order } from "../pages/user/order";
import { UserRole } from "../gql/graphql";
import { Dashboard } from "../pages/driver/dashboard";

const clientRoutes = [
  {
    path: "/",
    exact: true,
    component: <Restaurants />,
  },
  {
    path: "/search",
    exact: false,
    component: <Search />,
  },
  {
    path: "/category/:slug",
    exact: false,
    component: <Category />,
  },
  {
    path: "/restaurants/:id",
    exact: false,
    component: <Restaurant />,
  },
];

const ownerRoutes = [
  {
    path: "/",
    exact: true,
    component: <MyRestaurants />,
  },
  {
    path: "/add-restaurant",
    exact: true,
    component: <AddRestaurant />,
  },
  {
    path: "/restaurants/:id",
    exact: true,
    component: <MyRestaurant />,
  },
  {
    path: "/edit-restaurant/:id",
    exact: true,
    component: <EditRestaurant />,
  },
  {
    path: "/restaurants/:id/add-dish",
    exact: true,
    component: <AddDish />,
  },
];

const driverRoutes = [
  {
    path: "/",
    exact: true,
    component: <Dashboard />,
  },
];

const commonRoutes = [
  {
    path: "/confirm",
    component: <ConfirmEmail />,
  },
  {
    path: "/edit-profile",
    component: <EditProfile />,
  },
  {
    path: "/orders/:orderId",
    component: <Order />,
  },
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact={route.exact}>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Owner &&
          ownerRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact={route.exact}>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Delivery &&
          driverRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact={route.exact}>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path}>
            {route.component}
          </Route>
        ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
