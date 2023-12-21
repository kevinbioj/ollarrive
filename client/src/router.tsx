import { createBrowserRouter } from "react-router-dom";

import Layout from "~/layout/Layout";
import DelivererDetailsPage from "~/pages/DelivererDetailsPage";
import DelivererListPage from "~/pages/DelivererListPage";
import HomePage from "~/pages/HomePage";
import TourDetailsPage from "~/pages/TourDetailsPage";
import TourListPage from "~/pages/TourListPage";
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
      {
        path: PathConstants.TOUR_LIST,
        element: <TourListPage />,
      },
      {
        path: PathConstants.TOUR_DETAILS,
        element: <TourDetailsPage />,
      },
    ],
  },
]);

export default router;
