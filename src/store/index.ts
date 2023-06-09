import { configureStore } from "@reduxjs/toolkit";

// Reducers
import ordersReducer from "./reducers/orders";
import settingsReducer from "./reducers/settings";
import assetsReducer from "./reducers/assets"

export let store = configureStore({
  reducer: {
    ordersReducer,
    settingsReducer,
    assetsReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
