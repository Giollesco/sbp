export type Nullable<T> = T | null;

export enum Database {
    mongo = 'mongo',
    postgres = 'postgres'
}

export type IDatabase = 'mongo' | 'postgres'

export interface IDataToApi<Body, OkResponse> {
    body: Body;
    db: IDatabase,
    successCallback?: (data: OkResponse) => void;
    errorCallback: (error: any) => void;
    id: string | undefined | number;
    queryParams: Record<string, string | number | null | undefined | boolean>;
    loading?: string,
}

export interface IBaseModel {
    id: number | string,
    name: string
}

export interface IOrder {
    id: number,
    _id?: string;
    description: string,
    maintenance_type: IBaseModel,
    asset: IBaseModel,
    executors: Array<IBaseModel>
}

export interface IOrderPayload {
    _id?: string;
    id: number;
    description: string;
    asset: any;
    maintenance_type: any;
    executors: any[];
  }

export type IPrepare = {
    accounts: Array<IBaseModel & { email: string }>,
    maintenance_types: Array<IBaseModel & { color: string }>,
    assets: Array<IBaseModel>
}

export interface IAsset {
    name: string,
    avatar: string | null,
    id?: number | string,
    _id?: string,
}