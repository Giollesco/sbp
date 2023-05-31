import React from "react";
import { Database, IAsset } from "../../../models";
import { IFormAsset } from "..";
import { ActionIcon, Box, Flex, Group, Image, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import api from "../../../services";
import { assetsSlice } from "../../../store/reducers/assets";
import { motion } from "framer-motion";

type Props = {
  asset: IFormAsset;
  onClick: (asset: IFormAsset) => void;
};

const Card = ({ asset, onClick }: Props) => {
  // Hooks
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();

  // Variables
  const { database } = useAppSelector((state) => state.settingsReducer);
  const { assets } = useAppSelector((state) => state.assetsReducer);

  // Methods
  function removeAsset() {
    const token = localStorage.getItem("token");
    api()
      .delete<string, string>(`/accounts/assets/${database === Database.mongo ? asset._id : asset.id}/`, {
        data: { db: database },
        headers: { Authorization: "Bearer " + token },
      })
      .then((res: any) => {
        let arr = [...assets];
        let index = -1;
        if (database === Database.mongo) {
          index = arr.findIndex((item) => item._id === asset._id);
        } else {
          index = arr.findIndex((item) => item.id === asset.id);
        }
        arr.splice(index, 1);
        dispatch(assetsSlice.actions.fetchAssetsSuccess(arr));
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  return (
    <motion.div
      whileTap={{ scale: 0.98  }}
      whileHover={{ backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1] }}
      style={{ borderRadius: 8, backgroundColor: 'transparent' }}
      transition={{ ease: 'anticipate' }}
    >
      <UnstyledButton
        w="100%"
        miw={200}
        h={260}
        style={{
          borderStyle: "solid",
          borderRadius: 8,
          borderWidth: 2,
          borderColor: theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[2],
        }}
      >
        <Group w="100%" h={200} bg="red.100" pos="relative" onClick={() => onClick(asset)}>
          <Box
            w="100%"
            h={200}
            pos="absolute"
            top={0}
            left={0}
            bg={theme.colorScheme === "dark" ? "gray.8" : "gray.2"}
          />
          <Image
            fit="cover"
            width="100%"
            height={200}
            src={
              asset.avatar || "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png"
            }
          />
        </Group>
        <Flex direction="row" align="center" justify="space-between" px="md" h={60}>
          <Text maw="60%" truncate>
            {asset.name || "-"}
          </Text>
          <Flex direction="row" align="center">
            <ActionIcon variant="transparent" mr="md" color="red" onClick={removeAsset}>
              <IconTrash size="1rem" />
            </ActionIcon>
            <ActionIcon variant="light" color="green" onClick={() => onClick(asset)}>
              <IconEdit size="1rem" />
            </ActionIcon>
          </Flex>
        </Flex>
      </UnstyledButton>
    </motion.div>
  );
};

export default Card;
