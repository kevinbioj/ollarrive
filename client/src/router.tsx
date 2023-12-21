import { createBrowserRouter } from "react-router-dom";

import Layout from "~/layout/Layout";
import DelivererDetailsPage from "~/pages/DelivererDetailsPage";
import DelivererListPage from "~/pages/DelivererListPage";
import HomePage from "~/pages/HomePage";
import PathConstants from "~/routes";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: PathConstants.HOME,
        element: <HomePage />,
      },
      {
        path: PathConstants.DELIVERER_LIST,
        element: <DelivererListPage />,
      },
      {
        path: PathConstants.DELIVERER_DETAILS,
        element: <DelivererDetailsPage />,
      },
    ],
  },
]);

export default router;
