import { assetsSlice } from ".";
import { AppDispatch } from "../..";
import { IAsset, IDataToApi } from "../../../models";
import { IFormAsset } from "../../../pages/Assets";
import api from "../../../services";

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: FETCHING ASSETS

export const fetchAssetsXHR = async (data: Partial<IDataToApi<null, IAsset[]>>, dispatch: AppDispatch) => {
  // Getting token
  const token = await localStorage.getItem("token");
  try {
    dispatch(assetsSlice.actions.fetchAssets());
    let response = await api().get<IAsset[]>(`accounts/assets/`, {
      params: data.queryParams,
      headers: { Authorization: "Bearer " + token },
    });
    if (data.successCallback) {
      data.successCallback(response.data);
    }
    dispatch(assetsSlice.actions.fetchAssetsSuccess(response.data));
  } catch (error: any) {
    //lkl
    if (data.errorCallback) {
      data.errorCallback(error);
    }

    dispatch(assetsSlice.actions.fetchAssetsFail(error.message));
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: CREATE ASSET

export const createAssetXHR = async (
  data: Partial<IDataToApi<FormData, IAsset>>,
  dispatch: AppDispatch
) => {
  // Getting token
  const token = await localStorage.getItem("token");
  try {
    dispatch(assetsSlice.actions.createAsset());
    let response = await api().post<IAsset>(
      `accounts/assets/`,
      data.body,
      { headers: { Authorization: "Bearer " + token } }
    );
    if (data.successCallback) {
      data.successCallback(response.data);
    }
    dispatch(assetsSlice.actions.createAssetSuccess(response.data));
  } catch (error: any) {
    if (data.errorCallback) {
      data.errorCallback(error);
    }

    dispatch(assetsSlice.actions.createAssetFail(error.message));
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: UPDATE ASSET

export const updateAssetXHR = async (
  data: Partial<IDataToApi<FormData, IAsset>>,
  dispatch: AppDispatch
) => {
  // Getting token
  const token = await localStorage.getItem("token");
  try {
    dispatch(assetsSlice.actions.updateAsset());
    let response = await api().put<IAsset>(
      `accounts/assets/${data.id}/`,
      data.body,
      { headers: { Authorization: "Bearer " + token } }
    );
    if (data.successCallback) {
      data.successCallback(response.data);
    }
    dispatch(assetsSlice.actions.updateAssetSuccess(response.data));
  } catch (error: any) {
    if (data.errorCallback) {
      data.errorCallback(error);
    }

    dispatch(assetsSlice.actions.updateAssetFail(error.message));
  }
};
