import {
  createRootRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { NotFound } from "../components/NotFound";

// Root component (now a valid React component)
const RootComponent = () => {
  const { location } = useRouterState();
  const hideMenu = location.pathname.startsWith("/map");

  return (
    <>
      {!hideMenu && (
        <>
          <nav className="p-2 flex gap-2">
            <Link to="/" className="[&.active]:font-bold">
              Create a map
            </Link>
            <Link to="/map" className="[&.active]:font-bold">
              Map
            </Link>
            <Link to="/about" className="[&.active]:font-bold">
              About
            </Link>
            <Link to="/geocoder" className="[&.active]:font-bold">
              Geocode
            </Link>
          </nav>
          <hr />
        </>
      )}
      <Outlet />
    </>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});
