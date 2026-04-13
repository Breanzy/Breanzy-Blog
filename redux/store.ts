import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";

/* Explicit localStorage adapter — avoids SSR issues in Next.js */
const storage =
    typeof window !== "undefined"
        ? {
              getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
              setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
              removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
          }
        : {
              getItem: () => Promise.resolve(null),
              setItem: () => Promise.resolve(),
              removeItem: () => Promise.resolve(),
          };

const rootReducer = combineReducers({ user: userReducer });

const persistConfig = {
    key: "root",
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
