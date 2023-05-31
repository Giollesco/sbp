import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Database, IOrder } from "../../models";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Flex,
  Group,
  Loader,
  Modal,
  Space,
  Stack,
  Tabs,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import OrderForm from "../../components/forms/OrderForm";
import { getInitals } from "../../helpers";
import { IconArrowLeft } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchOrdersXHR } from "../../store/reducers/orders/actionCreator";
import api from "../../services";

type Props = {};

const OrderProfile = (props: Props) => {
  
  // Hooks
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useMantineTheme()

  // Variables
  const stateOrder = useAppSelector((state) => state.ordersReducer.order);
  const { orders, fetchOrdersStatus } = useAppSelector((state) => state.ordersReducer);
  const { database } = useAppSelector((state) => state.settingsReducer);
  const [opened, { open, close }] = useDisclosure(false);
  const [order, setOrder] = useState<IOrder | null>(null);

  // Methods
  useEffect(() => {
    if (orders.length === 0) {
      fetchOrdersXHR(
        {
          queryParams: { db: database },
          successCallback(data: IOrder[]) {
            if (database === Database.mongo) {
              setOrder(data.find((order) => order._id === id)!);
            } else {
              setOrder(data.find((order) => Number(order.id) === Number(id))!);
            }
          },
        },
        dispatch
      );
    } else {
      if (database === Database.mongo) {
        setOrder(orders.find((order) => order._id === id)!);
      } else {
        setOrder(orders.find((order) => Number(order.id) === Number(id))!);
      }
    }
  }, [stateOrder]);


  function deleteOrder() {
    const token = localStorage.getItem("token");
    api()
      .delete<string, string>(`/accounts/orders/${id}/`, {
        data: { db: database },
        headers: { Authorization: "Bearer " + token },
      })
      .then((res: any) => {
        navigate("/orders");
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  if (!order || fetchOrdersStatus === "loading") {
    return <Loader />;
  }

  return (
    <div style={{ zIndex: 10 }}>
      <UnstyledButton onClick={() => navigate(-1)}>
        <Flex align="center" mb="md">
          <ActionIcon>
            <IconArrowLeft size="1.125rem" />
          </ActionIcon>
          <Text c="dimmed">Natrag</Text>
        </Flex>
      </UnstyledButton>
      <Flex justify="space-between">
        {/* Header */}
        <Stack mb="xl" style={{ zIndex: 10 }}>
          <Title>{order.description}</Title>
          <Text c="dimmed" fz="sm">
            Radni nalog #{id}
          </Text>
        </Stack>
        <Flex gap="md">
          <Button onClick={deleteOrder} variant="light" color="red">
            Izbriši
          </Button>
          <Button onClick={open}>Ažuriraj</Button>
        </Flex>
      </Flex>

      <Flex gap="md">
        <Badge variant="dot" size="lg" fw="bold">
          {order.maintenance_type.name}
        </Badge>

        <Badge 
          bg={theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}
          color={theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[8]} 
          variant="light" size="lg" fw="bold" style={{ textTransform: "none" }}>
          {order.asset.name}
        </Badge>
      </Flex>

      <Tabs mt="xl" defaultValue="executors" variant="default">
        <Tabs.List>
          <Tabs.Tab value="executors" key="executors">
            Izvršitelji
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="executors" pt="xl">
          {order.executors.map((executor, index) => (
            <Group noWrap key={index} mb="lg">
              <Avatar radius="xl">{getInitals(executor.name || "")}</Avatar>

              <div>
                <Text>{executor.name}</Text>
                <Text size="xs" color="dimmed">
                  {/* @ts-ignore */}
                  {`ID korisnika: ${executor.id || ""}`}
                </Text>
              </div>
            </Group>
          ))}
        </Tabs.Panel>
      </Tabs>

      {/* Order form modal */}
      <Modal opened={opened} onClose={close} size="xl" withCloseButton={false}>
        <Flex p="sm" direction="column">
          <Title mb="sm" mt="lg">
            Ažuriranje radnog naloga #{id}
          </Title>
          <Text c="dimmed" fz="sm" mb="xl" maw="90%">
            Ispunite obrazac s potrebnim informacijama za novi radni nalog ili ažurirajte postojeći. Pobrinite se da
            unesete sve bitne detalje kako biste osigurali pravilno vođenje radnih naloga.
          </Text>
          <Space h={12} />
          <OrderForm order={order} close={close} />
        </Flex>
      </Modal>
    </div>
  );
};

export default OrderProfile;
