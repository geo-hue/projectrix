// app/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storageSystem from 'redux-persist/lib/storage';
import userReducer from './features/userSlice';
import generateReducer from './features/generateSlice';

// Create a custom storage object
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const customStorage = typeof window !== 'undefined'
  ? storageSystem
  : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage: customStorage,
  whitelist: ['user', 'generate']
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedGenerateReducer = persistReducer(
  {
    ...persistConfig,
    key: 'generate',
    whitelist: ['projects', 'currentProject']
  }, 
  generateReducer
);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    generate: persistedGenerateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;