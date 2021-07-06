/* eslint-disable consistent-return */
import { useEffect, useRef } from "react";

const useInterval = (callback, delay) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (ref !== undefined && ref.current() !== undefined) {
        ref.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
export default useInterval;
