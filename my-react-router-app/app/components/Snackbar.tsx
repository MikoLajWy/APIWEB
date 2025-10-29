import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import Snackbar from "@mui/material/Snackbar";

interface AlertSnackBarProps {
  shouldBeOpen: boolean;
  text: string;
  handleClose: () => void;
}

const alertSnackBar = (props: AlertSnackBarProps) => {
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={props.handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={props.handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={props.shouldBeOpen}
      autoHideDuration={6000}
      onClose={props.handleClose}
      message={props.text}
      action={action}
    />
  );
};

export default alertSnackBar;
