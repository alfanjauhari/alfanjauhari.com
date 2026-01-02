import { type PropsWithChildren, useEffect } from "react";
import { Observer } from "tailwindcss-intersect";

export default function ObserverProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    Observer.start();
  }, []);

  return children;
}
