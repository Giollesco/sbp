import { ordersSlice } from ".";
import { AppDispatch } from "../..";
import { IDataToApi, IOrder, IOrderPayload } from "../../../models";
import api from "../../../services";

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: FETCHING ORDERS

export const fetchOrdersXHR = async (
  data: Partial<IDataToApi<null, IOrder[]>>,
  dispatch: AppDispatch
) => {
  // Getting token
  const token = await localStorage.getItem("token");
  try {
    dispatch(ordersSlice.actions.fetchOrders());
    let response = await api().get<IOrder[]>(`accounts/orders/`, {
      params: data.queryParams,
      headers: { Authorization: "Bearer " + token },
    });
    if (data.successCallback) {
      data.successCallback(response.data);
    }
    dispatch(ordersSlice.actions.fetchOrdersSuccess(response.data));
  } catch (error: any) {
    //lkl
    if (data.errorCallback) {
      data.errorCallback(error);
    }

    dispatch(ordersSlice.actions.fetchOrdersFail(error.message));
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: CREATE ORDER

export const createOrderXHR = async (
  data: Partial<IDataToApi<Omit<IOrderPayload, "id">, IOrder>>,
  dispatch: AppDispatch
) => {
  // Getting token
  const token = await localStorage.getItem("token");
  try {
    dispatch(ordersSlice.actions.createOrder());
    let response = await api().post<IOrder>(
      `accounts/orders/`,
      { ...data.body, db: data.db  },
      { headers: { Authorization: "Bearer " + token } }
    );
    if (data.successCallback) {
      data.successCallback(response.data);
    }
    dispatch(ordersSlice.actions.createOrderSuccess(response.data));
  } catch (error: any) {
    if (data.errorCallback) {
      data.errorCallback(error);
    }

    dispatch(ordersSlice.actions.createOrderFail(error.message));
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: UPDATEORDER

export const updateOrderXHR = async (
  data: Partial<IDataToApi<IOrderPayload, IOrder>>,
  dispatch: AppDispatch
) => {
  // Getting token
  const token = await localStorage.getItem("token");
  try {
    dispatch(ordersSlice.actions.updateOrder());
    let response = await api().put<IOrder>(
      `accounts/orders/${data.id}/`,
      { ...data.body, db: data.db  },
      { headers: { Authorization: "Bearer " + token } }
    );
    if (data.successCallback) {
      data.successCallback(response.data);
    }
    dispatch(ordersSlice.actions.updateOrderSuccess(response.data));
  } catch (error: any) {
    if (data.errorCallback) {
      data.errorCallback(error);
      console.log("🚀 ~ file: actionCreator.ts:84 ~ error:", error)
    }

    dispatch(ordersSlice.actions.updateOrderFail(error.message));
  }
};
