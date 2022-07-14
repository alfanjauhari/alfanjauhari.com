import { useState } from 'react';

export function useToggle(initialState = false) {
  const [isToggled, setIsToggled] = useState<boolean>(initialState);

  const toggle = () => {
    setIsToggled((prevToggled) => !prevToggled);
  };

  return [isToggled, toggle] as const;
}
