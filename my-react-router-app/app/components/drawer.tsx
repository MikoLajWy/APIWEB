import * as React from "react";
import {
  styled,
  useTheme,
  type Theme,
  type CSSObject,
  ThemeProvider,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Avatar from "@mui/material/Avatar";
import { Breadcrumbs, colors, Link, Skeleton } from "@mui/material";
import { BaseModal } from "./Modal";
import { useState } from "react";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
    console.log("true");
  };

  const handleDrawerClose = () => {
    setOpen(false);
    console.log("false");
  };

  const onclickhandler = () => {
    console.log("checker");
    open ? handleDrawerClose() : handleDrawerOpen();
  };

  //Functions for Login and Register button
  const [show, setShow] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const handleClick = (a: number) => {
    setShow(true);
    if (a == 0) {
      setIsLogin(true);
      console.log("a jest warte:" + a);
    } else if (a == 1) {
      setIsLogin(false);
      console.log(a);
    }
  };

  const handleClose = () => setShow(false);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline enableColorScheme />
        <AppBar position="fixed" open={open}></AppBar>
        <Drawer variant="permanent" open={open}>
          <List>
            {["Drawer"].map((text) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                  ]}
                  onClick={onclickhandler}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                      },
                    ]}
                  >
                    {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["Login ", "Register"].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleClick(index)}
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: "initial",
                        }
                      : {
                          justifyContent: "center",
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                      },
                      /*open
                      ? {
                          margin: 0,
                        }
                      : {
                          mr: 'auto',
                        },*/
                    ]}
                  >
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={[
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <IconButton>
            <Avatar>H</Avatar>
          </IconButton>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box
            sx={{
              flexGrow: 1,
              p: 0.5,
              marginTop: 1,
              marginBottom: 1,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                p: 1,
                m: 1,
                borderRadius: 3,
              }}
            >
              <Breadcrumbs maxItems={3} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="#">
                  Home
                </Link>
                <Link underline="hover" color="inherit" href="#">
                  Catalog
                </Link>
                <Link underline="hover" color="inherit" href="#">
                  Accessories
                </Link>
                <Link underline="hover" color="inherit" href="#">
                  New Collection
                </Link>
                <Typography sx={{ color: "text.primary" }}>Belts</Typography>
              </Breadcrumbs>
            </Box>
          </Box>
          <Box
            sx={{
              marginBottom: 1,
              m: 0.5,
            }}
          >
            <Skeleton variant="rectangular" height={60} />
          </Box>
          <Box
            sx={{
              marginBottom: 1,
              m: 0.5,
            }}
          >
            <Skeleton variant="rectangular" height={60} />
          </Box>
          <Box
            sx={{
              marginBottom: 1,
              m: 0.5,
            }}
          >
            <Skeleton variant="rectangular" height={60} />
          </Box>
        </Box>
      </Box>
      <BaseModal open2={show} handleClosin={handleClose} isLogin={isLogin} />
    </>
  );
}
