import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Database, IDatabase, IOrder, IPrepare } from "../../../models";

interface IOrderReducer {
  fetchPrepareStatus: string;
  prepare: IPrepare | null;
  database: IDatabase
}

const initialState = {
  fetchPrepareStatus: "",
  prepare: null,
  database: localStorage.getItem("database") as IDatabase || Database.mongo,
} as IOrderReducer;

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetState: (state) => {
      const newState = { ...initialState }; // Create a new object with properties from initialState
      Object.assign(state, newState); // Assign properties from newState to state
    },

    // Fetching prepare
    fetchPrepare(state) {
      state.fetchPrepareStatus = "loading";
    },
    fetchPrepareSuccess(state, action: PayloadAction<IPrepare>) {
      state.fetchPrepareStatus = "";
      if (action.payload) {
        state.prepare = action.payload;
      }
    },
    fetchPrepareFail(state, action: PayloadAction<string>) {
      state.fetchPrepareStatus = action.payload;
    },

    // Setting database
    setDatabase(state, action: PayloadAction<IDatabase>) {
      state.database = action.payload
    },
  },
});

export default settingsSlice.reducer;
