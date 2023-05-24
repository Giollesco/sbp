import React, { useState } from "react";
import { Button, SegmentedControl, Select, Space, Stack, Textarea } from "@mantine/core";
import { forwardRef } from "react";
import { MultiSelect, Avatar, Group, Text } from "@mantine/core";
import { Database, IBaseModel, IOrder, IOrderPayload, Nullable } from "../../models";
import { createSelectDataFromBaseModel, getInitals, parseOrder } from "../../helpers";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { createOrderXHR, updateOrderXHR } from "../../store/reducers/orders/actionCreator";

export interface IOrderForm {
  id: Nullable<number>;
  description: Nullable<string>;
  maintenance_type: Nullable<IBaseModel>;
  asset: Nullable<IBaseModel>;
  executors: Nullable<IBaseModel[]>;
}

type Props = {
  order?: IOrder;
  close?: () => void
};

const OrderForm = ({ order, close }: Props) => {

  // Hooks
  const dispatch = useAppDispatch()

  // Variables
  const { database, prepare } = useAppSelector(state => state.settingsReducer)
  const [form, setForm] = useState<IOrderForm | Omit<IOrderForm, "id">>(
    order || {
      id: null,
      description: null,
      maintenance_type: null,
      asset: null,
      executors: null,
    }
  );

  // Methods
  function updateForm(key: keyof IOrderForm, value: any) {
    setForm({ ...form, [key]: value });
  }

  function onFinish(){
    if(order){
      // Updating order
      updateOrderXHR({
        body: parseOrder(form as IOrderPayload, database),
        db: database,
        id: database === Database.mongo ? order._id : order.id,
        successCallback: close,
        errorCallback: () => console.log("Error"),
      }, dispatch)
      return
    }
    // Creating order
    createOrderXHR({
      body: parseOrder(form as IOrderPayload, database),
      db: database,
      successCallback: close,
      errorCallback: () => console.log("Error"),
    }, dispatch)
  }

  return (
    <Stack spacing="xl">
      {/* Description */}
      <Textarea
        value={form.description || ""}
        onChange={(e) => updateForm("description", e.target.value)}
        placeholder="Unesite opis radnog naloga..."
        label="Opis radnog naloga"
        minRows={6}
      />

      {/* Type */}
      <SegmentedControl
        value={form.maintenance_type?.id.toString() || ""}
        onChange={(value) =>
          updateForm(
            "maintenance_type",
            prepare?.maintenance_types.find((x) => x.id.toString() === value)
          )
        }
        data={createSelectDataFromBaseModel(prepare?.maintenance_types as IBaseModel[])}
      />

      {/* Category */}
      <Select
        value={form.asset?.id.toString() || null}
        onChange={(value) =>
            updateForm(
                "asset",
                prepare?.assets.find((x) => x.id.toString() === value)
            )
        }
        label="Imovina"
        placeholder="Izaberite imovinu radnog naloga"
        data={createSelectDataFromBaseModel(prepare?.assets as IBaseModel[])}
      />

      {/* Executors */}
      <MultiSelect
        value={form.executors?.map((x) => x.id.toString()) || []}
        onChange={(value) =>
            updateForm(
                "executors",
                prepare?.accounts.filter((x) => value.includes(x.id.toString()))
            )
        }
        label="Izvršitelji"
        placeholder="Izaberite izvršitelje"
        itemComponent={SelectItem}
        data={createSelectDataFromBaseModel(prepare?.accounts as IBaseModel[])}
        searchable
        nothingFound="Nije pronađen nijedan rezultat"
        maxDropdownHeight={400}
        filter={(value, selected, item) =>
          !selected &&
          (item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
            item.description.toLowerCase().includes(value.toLowerCase().trim()))
        }
      />

      {/* Spacing */}
      <Space h={12} />

      {/* CTA */}
      <Button onClick={onFinish}>
        { order ? "Ažuriraj radni nalog" : "Kreiraj novi radni nalog" }
      </Button>
    </Stack>
  );
};

export default OrderForm;

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ image, label, description, ...others }: ItemProps, ref) => {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar radius="xl">{getInitals(label)}</Avatar>

        <div>
          <Text>{label}</Text>
          <Text size="xs" color="dimmed">
            {/* @ts-ignore */}
            {`ID korisnika: ${others.value || ""}`}
          </Text>
        </div>
      </Group>
    </div>
  );
});
