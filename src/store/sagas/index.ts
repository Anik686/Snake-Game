import {
  ISnakeCoord,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  MOVE_RIGHT,
  MOVE_LEFT,
  MOVE_DOWN,
  MOVE_UP,
  setDisDirection,
  STOP_GAME,
  RESET,
} from "../actions";

import {
  CallEffect,
  PutEffect,
  put,
  delay,
  takeLatest,
} from "redux-saga/effects";

function* watcherSagas() {
  //watcher saga
  yield takeLatest(
    [MOVE_RIGHT, MOVE_LEFT, MOVE_UP, MOVE_DOWN, RESET, STOP_GAME],
    moveSaga
  );
}

export function* moveSaga(params: {
  //worker saga
  type: string;
  payload: ISnakeCoord;
}): Generator<
  | PutEffect<{ type: string; payload: ISnakeCoord }>
  | PutEffect<{ type: string; payload: string }>
  | CallEffect<true>
> {
  while (params.type !== STOP_GAME && params.type !== RESET) {
    //dispatches movement actions
    yield put({
      type: params.type.split("_")[1],
      payload: params.payload,
    });

    //Dispatches SET_DIS_DIRECTION action
    switch (params.type.split("_")[1]) {
      case RIGHT:
        yield put(setDisDirection(LEFT));
        break;

      case LEFT:
        yield put(setDisDirection(RIGHT));
        break;

      case UP:
        yield put(setDisDirection(DOWN));
        break;
      case DOWN:
        yield put(setDisDirection(UP));
        break;
    }
    yield delay(100);
  }
}

export default watcherSagas;
