import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IGlobalState } from "../store/reducers";

import {
  IObjectBody,
  clearBoard,
  drawObject,
  generateRandomPosition,
  hasSnakeCollided,
} from "../utilities";

import {
  INCREMENT_SCORE,
  increaseSnake,
  scoreUpdates,
  stopGame,
  makeMove,
  MOVE_RIGHT,
  MOVE_LEFT,
  MOVE_UP,
  MOVE_DOWN,
  resetGame,
  RESET_SCORE,
} from "../store/actions";

import Instruction from "./Instruction";

export interface ICanvasBoard {
  height: number;
  width: number;
}

const CanvasBoard = ({ height, width }: ICanvasBoard) => {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const snake1 = useSelector((state: IGlobalState) => state.snake);
  const [pos, setPos] = useState<IObjectBody>(
    generateRandomPosition(width - 20, height - 20)
  );
  const [isConsumed, setIsConsumed] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const disallowedDirection = useSelector(
    (state: IGlobalState) => state.disallowedDirection
  );

  const moveSnake = useCallback(
    (dx = 0, dy = 0, ds: string) => {
      if (dx > 0 && dy === 0 && ds !== "RIGHT") {
        dispatch(makeMove(dx, dy, MOVE_RIGHT));
      }

      if (dx < 0 && dy === 0 && ds !== "LEFT") {
        dispatch(makeMove(dx, dy, MOVE_LEFT));
      }

      if (dy < 0 && dx === 0 && ds !== "UP") {
        dispatch(makeMove(dx, dy, MOVE_UP));
      }

      if (dy > 0 && dx === 0 && ds !== "DOWN") {
        dispatch(makeMove(dx, dy, MOVE_DOWN));
      }
    },
    [dispatch]
  );

  const handleKeyEvents = useCallback(
    (event: KeyboardEvent) => {
      if (disallowedDirection) {
        switch (event.key) {
          case "w":
            moveSnake(0, -20, disallowedDirection);
            break;
          case "s":
            moveSnake(0, 20, disallowedDirection);
            break;
          case "a":
            moveSnake(-20, 0, disallowedDirection);
            break;
          case "d":
            event.preventDefault();
            moveSnake(20, 0, disallowedDirection);
            break;
        }
      } else {
        if (
          disallowedDirection !== "LEFT" &&
          disallowedDirection !== "UP" &&
          disallowedDirection !== "DOWN" &&
          event.key === "d"
        )
          moveSnake(20, 0, disallowedDirection); //Moving Snake Right at the start
      }
    },
    [disallowedDirection, moveSnake]
  );

  useEffect(() => {
    //Generates a new fruit
    if (isConsumed) {
      const posi = generateRandomPosition(width - 20, height - 20);
      setPos(posi);
      setIsConsumed(false);

      //Increase Snake Size when fruit is eaten
      dispatch(increaseSnake());

      //Increase the score
      dispatch(scoreUpdates(INCREMENT_SCORE));
    }
  }, [isConsumed, pos, height, width, dispatch]);

  useEffect(() => {
    //Draws on canvas every time
    setContext(canvasRef.current && canvasRef.current.getContext("2d"));
    clearBoard(context);
    drawObject(context, snake1, "#91C483"); //Draws snake at required position
    console.log("X: " + snake1[0].x);
    drawObject(context, [pos], "#676FA3"); //Draws a random fruit

    //When fruit is consumed
    if (snake1[0].x === pos?.x && snake1[0].y === pos?.y) {
      setIsConsumed(true);
    }
    if (
      //Checking if snake has collided with itself
      hasSnakeCollided(snake1, snake1[0]) ||
      //Checking for when snake out of bounds
      snake1[0].x > width ||
      snake1[0].x < 0 ||
      snake1[0].y > height ||
      snake1[0].y < 0
    ) {
      console.log(snake1[0].x);
      setGameEnded(true);
      dispatch(stopGame());
      window.removeEventListener("keypress", handleKeyEvents);
    } else setGameEnded(false);
  }, [context, pos, snake1, height, width, dispatch, handleKeyEvents]);

  useEffect(
    //Handles user movement input
    () => {
      window.addEventListener("keypress", handleKeyEvents);

      return () => {
        window.removeEventListener("keypress", handleKeyEvents);
      };
    },
    [disallowedDirection, handleKeyEvents]
  );

  const resetBoard = useCallback(() => {
    //When resetting the game
    window.removeEventListener("keypress", handleKeyEvents);
    dispatch(resetGame());
    dispatch(scoreUpdates(RESET_SCORE));
    clearBoard(context);
    drawObject(context, snake1, "#91C483");
    drawObject(context, [pos], "#676FA3");

    window.addEventListener("keypress", handleKeyEvents);
  }, [context, dispatch, handleKeyEvents, snake1, pos, height, width]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ border: `3px solid ${gameEnded ? "red" : "black"}` }}
        height={height}
        width={width}
      />
      <Instruction resetBoard={resetBoard} />
    </>
  );
};

export default CanvasBoard;
