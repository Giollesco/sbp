import { Box, Button, Container, useMantineTheme } from "@mantine/core";
import React from "react";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

type Props = {
};

const Layout = ({ }: Props) => {

  // Hooks
  const theme = useMantineTheme()

  return (
    <Box bg={theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]} mih="100vh">
      <Header />
      <Container size="lg" px="xs" mih="100%" style={{ zIndex: 10 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
