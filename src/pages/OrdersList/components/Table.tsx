import { useEffect, useMemo, useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  Anchor,
  Chip,
  Badge,
  Avatar,
  Flex,
  Button,
  Modal,
  Title,
  Space,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from "@tabler/icons-react";
import { IOrder } from "../../../models";
import { sortOrders } from "../../../helpers";
import { Link } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import OrderForm from "../../../components/forms/OrderForm";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
    width: "100%",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },
}));

interface TableSortProps {
  data: IOrder[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

export function OrdersTable({ data }: TableSortProps) {

  // Variables
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof IOrder | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  // Methods
  useEffect(() => {
    setSortedData(sortOrders(data, { sortBy, reversed: reverseSortDirection, search }));
  }, [data]);

  const setSorting = (field: keyof IOrder) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortOrders(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortOrders(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  // Rows
  const rows = useMemo(
    () =>
      sortedData.map((row) => (
        <tr key={row.description}>
          <td>
            <Anchor component="button" fz="sm" ta="left">
              <Link to={`/orders/${row.id || row._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                {row.description}
              </Link>
            </Anchor>
          </td>
          <td>
            <Badge variant="dot" size="lg" fw="bold">
              {row.maintenance_type.name}
            </Badge>
          </td>
          <td>{row.executors.map((item) => item.name).join(", ")}</td>
          <td>
            <Badge bg="gray.4" color="dark.7" variant="light" size="lg" fw="bold" style={{ textTransform: "none" }}>
              {row.asset.name}
            </Badge>
          </td>
        </tr>
      )),
    [data, sortedData]
  );

  return (
    <>
      <ScrollArea>
        {/* Search */}
        <Flex justify="stretch" gap="md" mb="md">
          <TextInput
            placeholder="Pretražite radne naloge..."
            mb="md"
            style={{ flex: 1 }}
            icon={<IconSearch size="0.9rem" stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
          <Button onClick={open}>Novi radni nalog</Button>
        </Flex>

        {/* Table */}
        <ScrollArea h={520}>
          {
            data.length > 0 ? 
            <Table horizontalSpacing="md" verticalSpacing="xs" w="100%" miw="100%" sx={{ tableLayout: "fixed" }}>
              <thead>
                <tr>
                  <Th
                    sorted={sortBy === "description"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("description")}
                  >
                    Opis
                  </Th>
                  <Th
                    sorted={sortBy === "maintenance_type"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("maintenance_type")}
                  >
                    Tip održavanja
                  </Th>
                  <Th
                    sorted={sortBy === "executors"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("executors")}
                  >
                    Izvršitelji
                  </Th>
                  <Th
                    sorted={sortBy === "asset"}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting("asset")}
                  >
                    Kategorija održavanja
                  </Th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows
                ) : (
                  <tr>
                    <td colSpan={Object.keys(data[0]).length}>
                      <Text weight={500} align="center" c="dimmed" pt="lg">
                        Nisu pronađeni podaci
                      </Text>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            :
            <Text weight={500} align="center" c="dimmed" pt="lg">
              Nisu pronađeni podaci
            </Text>
          }
        </ScrollArea>
      </ScrollArea>
      {/* Order form modal */}
      <Modal opened={opened} onClose={close} size="xl" withCloseButton={false}>
        <Flex p="sm" direction="column">
          <Title mb="sm" mt="lg">Dodavanje novog radnog naloga</Title>
          <Text c="dimmed" fz="sm" mb="xl" maw="90%">
            Ispunite obrazac s potrebnim informacijama za novi radni nalog ili ažurirajte postojeći. Pobrinite se da
            unesete sve bitne detalje kako biste osigurali pravilno vođenje radnih naloga.
          </Text>
          <Space h={12} />
          <OrderForm close={close} />
        </Flex>
      </Modal>
    </>
  );
}
