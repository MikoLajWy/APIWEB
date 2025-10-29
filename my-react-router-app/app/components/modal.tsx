import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import Register from "./Register";
import Login from "./Login";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
interface BaseModalProp {
  open2: boolean;
  handleClosin: () => void;
  isLogin: boolean;
}

export function BaseModal(props: BaseModalProp) {
  return (
    <div>
      <Modal
        open={props.open2}
        onClose={props.handleClosin}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{props.isLogin ? <Login /> : <Register />}</Box>
      </Modal>
    </div>
  );
}
