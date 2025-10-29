import { useState } from "react";
import { Button } from "@mui/material";
import { BaseModal } from "./modal";

export function Main2() {
  const [show, setShow] = useState(false);
  const handleClick = () => {
    setShow(true);
  };
  const handleClose = () => setShow(false);

  return (
    <div>
      <Button onClick={handleClick}>Open modal</Button>

      <BaseModal open2={show} handleClosin={handleClose}></BaseModal>
    </div>
  );
}
