import { useState } from "react";
import { Button } from "@mui/material";
import { BaseModal } from "./Modal";

export function Main2() {
  const [show, setShow] = useState(false);
  const handleClick = () => {
    setShow(true);
  };
  const handleClose = () => setShow(false);

  return (
    <div>
      <Button onClick={handleClick}>Register</Button>

      <BaseModal
        open2={show}
        handleClosin={handleClose}
        isLogin={false}
      ></BaseModal>
    </div>
  );
}
