import { Group, Image, Stack, Text, Textarea, rem, useMantineTheme, Space, Button } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Database, IAsset } from "../../../models";
import { createAssetXHR, updateAssetXHR } from "../../../store/reducers/assets/actionCreator";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { IFormAsset } from "..";

type Props = {
  asset: IFormAsset;
  close: () => void;
};

const Form = ({ asset, close }: Props) => {

  // Hooks
  const dispatch = useAppDispatch()
  const theme = useMantineTheme();

  // Variables
  const { database } = useAppSelector(state => state.settingsReducer);
  const [image, setImage] = useState<FileWithPath | null>((asset.avatar as unknown as FileWithPath) || null);
  const [name, setName] = useState<string | null>(asset.name || null);

  // Methods
  function onFinish() {

    let _image: FileWithPath | string | null  = image;
    let avatar: FileWithPath | string | null = _image
    if(typeof _image === "string"){
      avatar = _image
    }
    else{
      avatar = _image ?  URL.createObjectURL(_image) : ""
    }

    // Creating form data
    let formData = new FormData();
    formData.append("avatar", image!)
    formData.append("name", name || "")
    formData.append("db", database)
    if (asset.name) {
      // Updating asset
      updateAssetXHR(
        {
          body: formData,
          db: database,
          id: database === Database.mongo ? asset._id as string : asset.id as number,
          successCallback: () => {
            setImage(null)
            setName(null)
            close()
          },
          errorCallback: () => console.log("Error"),
        },
        dispatch
      );
      return;
    }
    // Creating asset
    createAssetXHR(
      {
        body: formData,
        db: database,
        successCallback: () => {
          setImage(null)
          setName(null)
          close()
        },
        errorCallback: () => console.log("Error"),
      },
      dispatch
    );
  }

  useEffect(() => {
    setName(asset.name || null)
    setImage((asset.avatar as unknown as FileWithPath) || null)
    return () => {
      setImage(null)
      setName(null)
    }
  }, [])

  return (
    <Stack spacing="xl">
      <AnimatePresence mode="wait" initial={false}>
        {image ? (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "anticipate" }}
          >
            <Image
              width="100%"
              height={rem(256)}
              radius="md"
              style={{ objectFit: "cover", borderRadius: 8 }}
              src={asset.avatar ? 
                `${process.env.REACT_APP_HOST_BACKEND}${asset.avatar}` 
                :
                URL.createObjectURL(image)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="no-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ ease: "anticipate" }}
          >
            <Dropzone
              onDrop={(files) => setImage(files[0])}
              maxFiles={1}
              maxSize={3 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
            >
              <Group position="center" spacing="xl" style={{ height: rem(220), pointerEvents: "none" }}>
                <Dropzone.Accept>
                  <IconUpload
                    size="3.2rem"
                    stroke={1.5}
                    color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size="3.2rem" stroke={1.5} color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size="3.2rem" stroke={1.5} />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline>
                    Kliknite da biste učitali fotografiju
                  </Text>
                  <Text size="sm" color="dimmed" inline mt={7}>
                    Maksimalna veličina fotografije iznosi 5mb
                  </Text>
                </div>
              </Group>
            </Dropzone>
          </motion.div>
        )}
      </AnimatePresence>

      <Textarea
        value={name || ""}
        onChange={(e) => setName(e.target.value)}
        placeholder="Unesite naziv imovine..."
        label="Naziv imovine"
        minRows={1}
      />

      {/* Spacing */}
      <Space h={12} />

      {/* CTA */}
      <Button onClick={onFinish}>{asset.name ? "Ažuriraj imovinu" : "Kreiraj novu imovinu"}</Button>
    </Stack>
  );
};

export default Form;
