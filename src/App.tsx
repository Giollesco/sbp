import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./navigation/router";
import { useAppDispatch, useAppSelector } from "./hooks";
import {  Center, Loader, LoadingOverlay } from "@mantine/core";
import { fetchPrepareXHR } from "./store/reducers/settings/actionCreator";

type Props = {};

const App = (props: Props) => {

  // Hooks
  const dispatch = useAppDispatch()

  // Variables
  const { fetchPrepareStatus, database } = useAppSelector(state => state.settingsReducer)

  // Methods
  useEffect(() => {
    fetchPrepareXHR({
      queryParams: { db: database }
    }, dispatch)
  }, [])

  if(fetchPrepareStatus === "loading") {
    return (
      <Center w="100vw" h="100vh">
        <Loader />
      </Center>
    )
  }
  
  return <RouterProvider router={router} />
};

export default App;
