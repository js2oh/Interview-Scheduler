import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = (newMode, replace=false) => {
    if (replace) setHistory([...history].slice(0,-1).concat(newMode));
    else setHistory([...history].concat(newMode));
    setMode(newMode);
  };
  const back = () => {
    if (history.length > 1) {
      setHistory([...history].slice(0,-1));
      setMode([...history].slice(0,-1).pop());
    }
  };
  return { mode, transition, back };
}