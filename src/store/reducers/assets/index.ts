import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAsset } from "../../../models";

interface IOrderReducer {
  assets: IAsset[],
  fetchAssetsStatus: string;
  createAssetStatus: string;
  updateAssetStatus: string;
}

const initialState = {
  assets: [],
  fetchAssetsStatus: "",
  createAssetStatus: "",
  updateAssetStatus: ""
} as IOrderReducer;

export const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    resetState: (state) => {
      const newState = { ...initialState }; // Create a new object with properties from initialState
      Object.assign(state, newState); // Assign properties from newState to state
    },

    // Fetching prepare
    fetchAssets(state) {
      state.fetchAssetsStatus = "loading";
    },
    fetchAssetsSuccess(state, action: PayloadAction<IAsset[]>) {
      state.fetchAssetsStatus = "";
      if (action.payload) {
        state.assets = action.payload;
      }
    },
    fetchAssetsFail(state, action: PayloadAction<string>) {
      state.fetchAssetsStatus = action.payload;
    },

    // Creating asset
    createAsset(state) {
      state.createAssetStatus = "loading";
    },
    createAssetSuccess(state, action: PayloadAction<IAsset>) {
      state.createAssetStatus = "";
      if (action.payload) {
        let assets = [...state.assets];
        state.assets = [...assets, action.payload];
      }
    },
    createAssetFail(state, action: PayloadAction<string>) {
      state.createAssetStatus = action.payload;
    },

    // Updating asset
    updateAsset(state) {
      state.updateAssetStatus = "loading";
    },
    updateAssetSuccess(state, action: PayloadAction<IAsset>) {
      state.updateAssetStatus = "";
      if (action.payload) {
        let assets: IAsset[] = [...state.assets];
        const index = assets.findIndex(item => {
          if(item.hasOwnProperty('_id')) return item._id === action.payload._id!.toString();
          else return Number(item.id) === Number(action.payload.id);
        });
        assets[index] = action.payload;
        state.assets = assets;
      }
    },
    updateAssetFail(state, action: PayloadAction<string>) {
      state.updateAssetStatus = action.payload;
    }
  },
});

export default assetsSlice.reducer;
