import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrder } from "../../../models";

interface IOrderReducer {
  fetchOrdersStatus: string;
  orders: IOrder[];
  createOrderStatus: string;
  order: IOrder;
  updateOrderStatus: string;
}

const initialState = {
  fetchOrdersStatus: "",
  orders: [],
  createOrderStatus: "",
  order: {
    id: -1,
    description: "",
    asset: { id: "", name: "" },
    maintenance_type: { id: "", name: "" },
    executors: []
  },
  updateOrderStatus: ""
} as IOrderReducer;

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetState: (state) => {
      const newState = { ...initialState }; // Create a new object with properties from initialState
      Object.assign(state, newState); // Assign properties from newState to state
    },

    // Fetching orders
    fetchOrders(state) {
      state.fetchOrdersStatus = "loading";
    },
    fetchOrdersSuccess(state, action: PayloadAction<IOrder[]>) {
      state.fetchOrdersStatus = "";
      if (action.payload) {
        state.orders = action.payload;
      }
    },
    fetchOrdersFail(state, action: PayloadAction<string>) {
      state.fetchOrdersStatus = action.payload;
    },

    // Creating order
    createOrder(state) {
      state.createOrderStatus = "loading";
    },
    createOrderSuccess(state, action: PayloadAction<IOrder>) {
      state.createOrderStatus = "";
      if (action.payload) {
        state.order = action.payload;
        state.orders = [...state.orders, action.payload]
      }
    },
    createOrderFail(state, action: PayloadAction<string>) {
      state.createOrderStatus = action.payload;
    },

    // Creating order
    updateOrder(state) {
      state.updateOrderStatus = "loading";
    },
    updateOrderSuccess(state, action: PayloadAction<IOrder>) {
      state.updateOrderStatus = "";
      if (action.payload) {
        state.order = action.payload;
        let orders: IOrder[] = [...state.orders];
        const index = orders.findIndex(item => {
          if(item.hasOwnProperty('_id')) return item._id === action.payload.id.toString();
          else return Number(item.id) === Number(action.payload.id);
        });
        orders[index] = action.payload;
        state.orders = orders;
      }
    },
    updateOrderFail(state, action: PayloadAction<string>) {
      state.updateOrderStatus = action.payload;
    }
  },
});

export default ordersSlice.reducer;
