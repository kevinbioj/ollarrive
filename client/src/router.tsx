import { createBrowserRouter } from "react-router-dom";

import Layout from "~/layout/Layout";
import PathConstants from "~/routes";

import HomePage from "~/pages/HomePage";
import DelivererListPage from "~/pages/deliverers/DelivererListPage";
import DelivererDetailsPage from "~/pages/deliverers/DelivererDetailsPage";
import DeliveryListPage from "~/pages/deliveries/DeliveryListPage";
import DeliveryDetailsPage from "~/pages/deliveries/DeliveryDetailsPage";
import TourListPage from "~/pages/tours/TourListPage";
import TourDetailsPage from "~/pages/tours/TourDetailsPage";

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
      {
        path: PathConstants.DELIVERY_LIST,
        element: <DeliveryListPage />,
      },
      {
        path: PathConstants.DELIVERY_DETAILS,
        element: <DeliveryDetailsPage />,
      },
    ],
  },
]);

export default router;
