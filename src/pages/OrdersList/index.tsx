import React, { useEffect } from "react";
import { OrdersTable } from "../OrdersList/components/Table";
import { Loader, Space, Stack, Text, Title } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchOrdersXHR } from "../../store/reducers/orders/actionCreator";
import { IOrder } from "../../models";
import AnimatedPageWrapper from "../../components/AnimatedPageWrapper";

type Props = {};

const OrdersList = (props: Props) => {

  // Hooks
  const dispatch = useAppDispatch();

  // Variables
  const { database } = useAppSelector(state => state.settingsReducer)
  const { orders, fetchOrdersStatus } = useAppSelector((state) => state.ordersReducer);

  // Methods
  useEffect(() => {
    fetchOrdersXHR({
      queryParams: { db: database }
    }, dispatch);
  }, [database]);

  return (
    <AnimatedPageWrapper _key="orders-list">
      {/* Header */}
      <Stack mb="xl">
        <Title>Popis radnih naloga</Title>
        <Text maw="75%" c="dimmed" fz="sm">
          Popis radnih naloga pruža pregled svih vaših trenutnih radnih naloga na jednom mjestu. Ovdje možete vidjeti
          osnovne informacije o radnim nalozima i lako pristupiti dodatnim detaljima. Istražite i upravljajte svojim
          radnim nalozima na učinkovit način.
        </Text>
      </Stack>

      {/* Spacing */}
      <Space h="sm" />

      {/* Table */}
      {fetchOrdersStatus === "loading" ? <Loader /> : <OrdersTable data={orders} />}
    </AnimatedPageWrapper>
  );
};

export default OrdersList;