import { Database, IBaseModel, IDatabase, IOrder, IOrderPayload, IPrepare } from "../models";

/**
 * Sorts and filters an array of IOrder objects based on the provided payload options.
 * @param data The array of IOrder objects to be sorted and filtered.
 * @param payload The payload object containing the sorting and filtering options.
 * @returns The sorted and filtered array of IOrder objects.
 */
export function sortOrders(
  data: IOrder[],
  payload: { sortBy: keyof IOrder | null; reversed: boolean; search: string }
) {
  const { sortBy, reversed, search } = payload;

  let sortedData = [...data];

  if (sortBy) {
    sortedData.sort((a, b) => {
      const propA = getProperty(a, sortBy);
      const propB = getProperty(b, sortBy);

      if (typeof propA === "string" && typeof propB === "string") {
        return propA.localeCompare(propB);
      }

      if (typeof propA === "number" && typeof propB === "number") {
        return propA - propB;
      }

      return 0;
    });
  }

  if (reversed) {
    sortedData.reverse();
  }

  if (search) {
    sortedData = sortedData.filter((item) => {
      const searchableFields = [
        item.description,
        item.maintenance_type.name,
        item.asset.name,
        ...item.executors.map((executor) => executor.name),
      ];

      return searchableFields.some((field) => field.toLowerCase().includes(search.toLowerCase()));
    });
  }

  return sortedData;
}

/**
 * Retrieves a nested property value from an object based on a dot-separated path.
 * @param obj The object from which to retrieve the property value.
 * @param path The dot-separated path of the nested property.
 * @returns The value of the nested property, or undefined if it doesn't exist.
 */
function getProperty(obj: any, path: string): any {
  const keys = path.split(".");
  let value = obj;

  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      break;
    }
  }

  return value;
}

/**
 * Retrieves an array of IBaseModel objects from an array of IBaseModel objects.
 * @param data The array of IBaseModel objects to be parsed.
 * @returns An array of IBaseModel objects.
 */
export function createSelectDataFromBaseModel(data: IBaseModel[]): { value: string; label: string }[]{
  let parsedData:  { value: string; label: string }[] = [];
  if(data && data.length > 0){
    data.forEach(element => {
      parsedData.push({
        value: element.id.toString(),
        label: element.name
      })
    })
  }
  return parsedData
}

/**
 * Returns the initials of a given name.
 * @param name The name to be parsed.
 * @returns The initials of the given name.
 */
export function getInitals(name: string): string{
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
}


/**
 * Parses the order object based on the given database type.
 * @param order - The order object to parse.
 * @param db - The database type (e.g., "mongo" or "postgres").
 * @returns The parsed order object.
 */
export function parseOrder(order: IOrderPayload, db: IDatabase): IOrderPayload {
  let parsed: IOrderPayload = { ...order };
  if (db === Database.postgres) {
    parsed.asset = order.asset.id;
    parsed.maintenance_type = order.maintenance_type.id;
    parsed.executors = order.executors.map((executor) => executor.id);
  }
  return parsed;
}