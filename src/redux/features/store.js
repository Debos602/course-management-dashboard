import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import authReducer from "../features/auth/authSlice";
import lessonReducer from "../features/lessons/lessonSlice";
import quizReducer from "../features/quize/quizSlice";
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "auth",
    storage,
    whitelist: ["token", "user"], // Specify what to persist
};

const lessonPersistConfig = {
    key: "lessons",
    storage,
   whitelist: ["currentLessonId", "progress", "isPlaying", "isCompleted"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedLessonReducer = persistReducer(lessonPersistConfig, lessonReducer);

export const store = configureStore({
    reducer: {
        // Changed from 'reducers' to 'reducer'
        [baseApi.reducerPath]: baseApi.reducer,
        auth: persistedAuthReducer,
        lessons: persistedLessonReducer,
        quizzes: quizReducer,
    },
    middleware: (getDefaultMiddlewares) =>
        getDefaultMiddlewares({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
