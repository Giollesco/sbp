import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchAssetsXHR } from "../../store/reducers/assets/actionCreator";
import { Button, Flex, Modal, SimpleGrid, Space, Stack, Text, Title } from "@mantine/core";
import AnimatedPageWrapper from "../../components/AnimatedPageWrapper";
import Card from "./components/Card";
import Form from "./components/Form";
import { useDisclosure } from "@mantine/hooks";
import { Nullable } from "../../models";

type Props = {};

export interface IFormAsset {
  name: Nullable<string>;
  avatar: Nullable<string>;
  id?: Nullable<number>
  _id?: Nullable<string>
}

const Assets = (props: Props) => {

  // Hooks
  const dispatch = useAppDispatch();

  // Variables
  const [selectedAsset, setSelectedAsset] = useState<IFormAsset>({ name: null, avatar: null, id: null, _id: null  })
  const [opened, { open, close }] = useDisclosure(false);
  const { database } = useAppSelector((state) => state.settingsReducer);
  const { assets, fetchAssetsStatus } = useAppSelector((state) => state.assetsReducer);

  // Methods
  useEffect(() => {
    fetchAssetsXHR(
      {
        queryParams: { db: database },
      },
      dispatch
    );
  }, [database]);

  function setAsset(asset: IFormAsset) {
    setSelectedAsset(asset);
    open();
  }

  if (fetchAssetsStatus === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <AnimatedPageWrapper _key="assets">
      {/* Header */}

      <Flex justify="space-between">
        {/* Header */}
        <Stack mb="xl">
          <Title>Popis imovine</Title>
          <Text maw="75%" c="dimmed" fz="sm">
            Popis imovine pruža pregled svih vaše trenutne imovine na jednom mjestu. 
            Ovdje možete vidjeti osnovne informacije o imovini i lako pristupiti dodatnim detaljima. 
            Istražite i upravljajte svojom imovinom na učinkovit način.
          </Text>
        </Stack>
        <Flex gap="md">
          <Button onClick={open}>Dodaj</Button>
        </Flex>
      </Flex>

      {/* Spacing */}
      <Space h="sm" />

      {/* Cards */}
      <SimpleGrid cols={3}>
        {assets.map((asset, index) => (
          <Card asset={asset as IFormAsset} key={index} onClick={setAsset} />
        ))}
      </SimpleGrid>

      {/* Form */}
      {/* Order form modal */}
      <Modal opened={opened} onClose={close} size="xl" withCloseButton={false}>
        <Flex p="sm" direction="column">
          <Title mb="sm" mt="lg">
            { selectedAsset.name ? `Ažuriranje imovine: ${selectedAsset.name}` : "Dodavanje nove imovine" }
          </Title>
          <Text c="dimmed" fz="sm" mb="xl" maw="90%">
            Ispunite obrazac s potrebnim informacijama za dodavanje nove imovine ili ažuriranje postojeće. 
            Pobrinite se da unesete sve bitne detalje kako biste osigurali pravilno vođenje imovine.
          </Text>
          <Space h={12} />
          <Form asset={selectedAsset} close={close} />
        </Flex>
      </Modal>
    </AnimatedPageWrapper>
  );
};

export default Assets;
