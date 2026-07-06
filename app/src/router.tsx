import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // no scroll restoration: a refresh should always start at the top of the
    // page, not resume wherever you were scrolled to.
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
