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
    <div className="flex flex-col h-screen">
      {!hideMenu && (
        <>
          <nav
            className="p-2 flex items-center justify-between shrink-0"
            style={{ backgroundColor: "#fdfbf8" }}
          >
            <Link to="/">
              <div className="flex items-center gap-4">
                <img src="logo.svg" alt="Logo" className="h-10 w-10" />
                <div>
                  <h1 className="text-lg font-bold">GeoMapi.com</h1>
                </div>
              </div>
            </Link>
            <div className="flex gap-6">
              <Link
                to="/"
                className="hover:text-blue-400 transition-colors [&.active]:font-bold"
              >
                Create a Map
              </Link>
              <Link
                to="/geocoder"
                className="hover:text-blue-400 transition-colors [&.active]:font-bold"
              >
                Geocoder
              </Link>
              <Link
                to="/geojson"
                className="hover:text-blue-400 transition-colors [&.active]:font-bold"
              >
                Geojson
              </Link>
              <Link
                to="/about"
                className="hover:text-blue-400 transition-colors [&.active]:font-bold"
              >
                Help & Instructions
              </Link>
            </div>
          </nav>
          <hr className="shrink-0" />
        </>
      )}
      <div className="flex-1 ">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});
