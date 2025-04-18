import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <title>Not Found | CUber Eats</title>
    <h2 className="font-semibold text-2xl mb-3">Page Not Found.</h2>
    <h4 className="font-medium text-base mb-5">
      The page you're looking for does not exist or have moved.
    </h4>
    <Link className="link" to="/">
      Go back home &rarr;
    </Link>
  </div>
);
