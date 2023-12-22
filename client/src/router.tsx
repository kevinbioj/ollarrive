import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import Layout from "~/layout/Layout";
import PathConstants from "~/routes";

const HomePage = lazy(() => import("./pages/HomePage"));
const DelivererListPage = lazy(() => import("./pages/deliverers/DelivererListPage"));
const DelivererDetailsPage = lazy(() => import("./pages/deliverers/DelivererDetailsPage"));
const DeliveryListPage = lazy(() => import("./pages/deliveries/DeliveryListPage"));
const DeliveryDetailsPage = lazy(() => import("./pages/deliveries/DeliveryDetailsPage"));
const TourListPage = lazy(() => import("./pages/tours/TourListPage"));
const TourDetailsPage = lazy(() => import("./pages/tours/TourDetailsPage"));

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
