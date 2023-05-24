import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

// Pages
import OrdersList from "../pages/OrdersList";
import OrderProfile from "../pages/OrderProfile";
import Layout from "../layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Navigate to="/orders" />
      },
      {
        path: "/orders",
        element: <OrdersList />,
      },
      {
        path: "/orders/:id",
        element: <OrderProfile />,
      },
    ]
  },
]);