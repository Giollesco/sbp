import { useEffect, useState } from "react";
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem,
  Anchor,
  SegmentedControl,
  Center,
  Box,
  Image,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DBMenu } from "../components/DBMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Database, IDatabase } from "../../models";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { settingsSlice } from "../../store/reducers/settings";

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    borderBottom: `${rem(1)} solid ${theme.colorScheme === "dark" ? "transparent" : theme.colors.gray[2]}`,
    marginBottom: rem(40),
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },

  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "0 !important",
  },

  tab: {
    fontWeight: 500,
    height: rem(38),
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
    },

    "&[data-active]": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      borderColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2],
    },
  },
}));

interface HeaderTabsProps {}

export function Header({}: HeaderTabsProps) {

  // Hooks
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Variables
  const { database } = useAppSelector((state) => state.settingsReducer);
  const [isOnOrderProfile, setIsOnOrderProfile] = useState<boolean>(
    location.pathname.startsWith("/orders") && location.pathname.split("/")[2] ? true : false
  );
  const { classes, theme, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  // Routes
  const routes = [
    { link: "/orders", label: "Radni nalozi" },
    { link: "/assets", label: "Imovina" } 
  ]

  // Methods
  useEffect(() => {
    setIsOnOrderProfile(location.pathname.startsWith("/orders") && location.pathname.split("/")[2] ? true : false);
  }, [location]);

  function toggleDatabase(database: IDatabase) {
    localStorage.setItem("database", database);
    dispatch(settingsSlice.actions.setDatabase(database));
  }

  // Tabs
  const items = routes.map((tab) => (
    <Tabs.Tab value={tab.link} key={tab.link} onClick={() => navigate(tab.link)}>
      {tab.label}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="xl">
        <Group position="apart" style={{ zIndex: 10 }}>
          <Group spacing={2} w={320} style={{ zIndex: 10 }}>
            <Text weight={500} size="sm" sx={{ lineHeight: 1, opacity: 0.75 }} mr={3}>
              Projekt za predmet
            </Text>
            <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3} fs="italic">
              Sustavi baza podataka
            </Text>

            {/* DB Menu */}
            {/* <DBMenu /> */}
          </Group>

          <AnimatePresence>
            {!isOnOrderProfile && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -40 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ ease: "anticipate", duration: 0.65 }}
              >
                <SegmentedControl
                  value={database}
                  bg={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1]}
                  color={theme.primaryColor}
                  onChange={(value: IDatabase) => toggleDatabase(value)}
                  data={[
                    {
                      value: Database.mongo,
                      label: (
                        <Center>
                          <Image radius={20} src={require("../../assets/icons/mongo.png")} width={24} height={24} />
                          <Box ml={10} pr="md">
                            MongoDB
                          </Box>
                        </Center>
                      ),
                    },
                    {
                      value: Database.postgres,
                      label: (
                        <Center>
                          <Image radius={20} src={require("../../assets/icons/postgre.png")} width={24} height={24} />
                          <Box ml={10} pr="md">
                            PostgreSQL
                          </Box>
                        </Center>
                      ),
                    },
                  ]}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Flex justify="flex-end" w={320}>
            <UnstyledButton
              style={{ zIndex: 10 }}
              className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
            >
              <Group spacing={7}>
                <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                  <Anchor href="https://github.com/Giollesco/sbp" target="_blank">
                    Link na github
                  </Anchor>
                </Text>
                {/* Github logo link */}
                <Avatar
                  src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  radius="xl"
                  size={28}
                />
              </Group>
            </UnstyledButton>
          </Flex>
        </Group>
      </Container>
      <Container size="lg">
        <AnimatePresence initial={false}>
          {!isOnOrderProfile && (
            <motion.div
              animate={{ opacity: 1, height: "auto" }}
              initial={{ opacity: 0, height: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ ease: "anticipate" }}
            >
              <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ delay: isOnOrderProfile ? 0 : 0.3 }}
              >
                <Tabs
                  defaultValue="/orders"
                  value={location.pathname}
                  variant="default"
                  classNames={{
                    tabsList: classes.tabsList,
                  }}
                >
                  <Tabs.List>{items}</Tabs.List>
                </Tabs>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}
