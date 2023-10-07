import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import gameReducer from "./reducers";
import watcherSagas from "./sagas";
const SagaMiddleware = createSagaMiddleware();

const store = createStore(gameReducer, applyMiddleware(SagaMiddleware));

SagaMiddleware.run(watcherSagas);
export default store;
