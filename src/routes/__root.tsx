import {
  createRootRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { NotFound } from "../components/NotFound";
import { useState } from "react";

// Root component (now a valid React component)
const RootComponent = () => {
  const { location } = useRouterState();
  const hideMenu = location.pathname.startsWith("/map");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

            {/* Mobile menu button */}
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex gap-6">
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

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white shadow-lg py-2 absolute top-[56px] left-0 right-0 z-50">
              <div className="flex flex-col px-4 space-y-3">
                <Link
                  to="/"
                  className="hover:text-blue-400 transition-colors [&.active]:font-bold py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create a Map
                </Link>
                <Link
                  to="/geocoder"
                  className="hover:text-blue-400 transition-colors [&.active]:font-bold py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Geocoder
                </Link>
                <Link
                  to="/geojson"
                  className="hover:text-blue-400 transition-colors [&.active]:font-bold py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Geojson
                </Link>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors [&.active]:font-bold py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Help & Instructions
                </Link>
              </div>
            </div>
          )}

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
