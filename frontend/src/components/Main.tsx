import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FolderIcon from "@mui/icons-material/Folder";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import clsx from "clsx";
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import theme from "../theme";
import FileList from "./FileList";
import PrintStatus from "./PrintStatus";
import Image from "material-ui-image";



declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}



// FIXME checkout https://mui.com/components/use-media-query/#migrating-from-withwidth
const withWidth = () => (WrappedComponent) => (props) => <WrappedComponent {...props} width="xs" />;


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


// import { clearConfigCache } from "prettier";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

function Main({ width }: WithWidth): React.ReactElement {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const isSmallScreen = /xs|sm/.test(width);
  const drawerVariant = isSmallScreen ? "temporary" : "permanent";
  const handleDrawerItemClick = () => {
    if (isSmallScreen) {
      setOpen(false);
    }
  };
  const port = window.location.port ? `:${parseInt(window.location.port) + 1}` : "";
  const video_url = new URL("/stream.mjpg", window.location.protocol + '//' + window.location.hostname + port).toString()
  const [video_enabled, setVideoEnabled] = React.useState(false)

  React.useEffect(() => {
    fetch(`/api/video`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Unexpected response: ${response.status}`
          );
        }
        return response.json();
      })
      .then((response_body) => {
        setVideoEnabled(response_body.enabled);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  function VideoImage(): React.ReactElement {
    if (video_enabled) {
      return <Image src={video_url} />
    }
    return <></>
  }

  // fetch /api/video
  // parse response
  // return true if enabled



  return (
    <div className={classes.root}>
      <CssBaseline />
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <AppBar
            position="absolute"
            className={clsx(classes.appBar, open && classes.appBarShift)}
          >
            <Toolbar className={classes.toolbar}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                className={clsx(
                  classes.menuButton,
                  open && classes.menuButtonHidden
                )}
                size="large">
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                mariner3d
              </Typography>
            </Toolbar>
          </AppBar>
          <SwipeableDrawer
            variant={drawerVariant}
            classes={{
              paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
            onOpen={handleDrawerOpen}
            onClose={handleDrawerClose}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={handleDrawerClose} size="large">
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItem
                button
                key="home"
                component={Link}
                to="/"
                onClick={handleDrawerItemClick}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem
                button
                key="files"
                component={Link}
                to="/files"
                onClick={handleDrawerItemClick}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText primary="Files" />
              </ListItem>
            </List>
          </SwipeableDrawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="sm" className={classes.container}>
              {VideoImage()}
              <Routes>
                <Route path="/" element={<PrintStatus />} />
                <Route path="/files" element={<FileList />} />
              </Routes>
            </Container>
          </main>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}

export default withWidth()(Main);
