import { settingsSlice } from ".";
import { AppDispatch } from "../..";
import { IDataToApi, IPrepare } from "../../../models";
import api from "../../../services";

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: FETCHING PREPARE

export const fetchPrepareXHR = async (data: Partial<IDataToApi<null, IPrepare>>, dispatch: AppDispatch) => {
  // Getting token
  const token = await localStorage.getItem("token");
  try {
    dispatch(settingsSlice.actions.fetchPrepare());
    let response = await api().get<IPrepare>(`accounts/prepare/`, {
      params: data.queryParams,
      headers: { Authorization: "Bearer " + token },
    });
    if (data.successCallback) {
      data.successCallback(response.data);
    }
    dispatch(settingsSlice.actions.fetchPrepareSuccess(response.data));
  } catch (error: any) {
    //lkl
    if (data.errorCallback) {
      data.errorCallback(error);
    }

    dispatch(settingsSlice.actions.fetchPrepareFail(error.message));
  }
};
