import React, { useEffect, useState } from "react"

export function useMediaQuery({lessThan, moreThan}:{moreThan?:number, lessThan?: number}) {
 const [isValid, setIsValid] = useState<boolean>(false);

  const getMediaProperty = () => {
    if (lessThan && moreThan) {
      return `(min-width: ${moreThan}px) and (max-width: ${lessThan - 1}px)`;
    }
    if (lessThan) {
      return `(max-width: ${lessThan - 1}px)`;
    }
    if (moreThan) {
      return `(min-width: ${moreThan}px)`;
    }
    return "";
  };

  useEffect(() => {
    const query = getMediaProperty();
    if (!query) return;

    const mql = window.matchMedia(query);
    const onChange = () => setIsValid(mql.matches);

    mql.addEventListener("change", onChange);
    setIsValid(mql.matches);

    return () => mql.removeEventListener("change", onChange);
  }, [lessThan, moreThan]);

  return isValid;
}
