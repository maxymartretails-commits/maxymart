"use client"

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  children?: ReactNode;
  passThrough?: boolean;
}

const ModalPortal = ({ children, passThrough = false }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  let modalRoot;
  if (typeof window !== "undefined") {
    modalRoot = document.querySelector("#modalRoot");
  }

  if (passThrough) {
    return <>{children}</>;
  }

  if (mounted && modalRoot) {
    return createPortal(children, modalRoot);
  } else {
    return <></>;
  }
};

export default ModalPortal;
