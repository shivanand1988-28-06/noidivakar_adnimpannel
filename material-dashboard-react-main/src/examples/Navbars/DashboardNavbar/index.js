/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [searchValue, setSearchValue] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [navbarType, setNavbarType] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [editData, setEditData] = useState({});
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Search handler for application number
  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    try {
      const API_BASE = "https://web-production-04c51.up.railway.app";
      const res = await fetch(`${API_BASE}/api/noidata/by-application-number/${encodeURIComponent(searchValue.trim())}`);
      if (!res.ok) throw new Error("Not found");
      const result = await res.json();
      let dataObj = result;
      if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
        dataObj = result.data[0];
      } else if (result && result.success && typeof result.data === 'object') {
        dataObj = result.data;
      }
      setFetchedData(dataObj);
      setEditData(dataObj);
      setDialogOpen(true);
    } catch (err) {
      setSnackbarMsg("No data found for: " + searchValue);
      setSnackbarOpen(true);
    }
  };
  const handleEditChange = (key, value) => {
    setEditData((prev) => ({ ...prev, [key]: value }));
  };

  const handleEdit = () => setEditMode(true);
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditData(fetchedData);
  };
  const handleSaveEdit = async () => {
    // TODO: Implement save logic (API call)
    setFetchedData(editData);
    setEditMode(false);
    setSnackbarMsg("Changes saved (not persisted)");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1} display="flex" alignItems="center">
              <MDInput
                label="Search here"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              />
              <IconButton
                size="small"
                color="primary"
                sx={{ ml: 1 }}
                onClick={handleSearch}
              >
                <Icon>search</Icon>
              </IconButton>
            </MDBox>
            {/* MIAS BUTTON - top right */}
            <MDBox pr={2} display="flex" alignItems="center">
              <MDButton
                variant="contained"
                color="info"
                size="small"
                sx={{ minWidth: 64, fontWeight: 'bold', textTransform: 'uppercase' }}
                onClick={() => { /* TODO: Add mias button action here */ }}
              >
                MIS
              </MDButton>
            </MDBox>
            <MDBox color={light ? "white" : "inherit"}>
              <Link to="/authentication/sign-in/basic">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              </Link>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton>
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Application Data</DialogTitle>
        <DialogContent>
          {fetchedData && Object.keys(fetchedData).map((key) => (
            <MDBox key={key} mb={2} display="flex" alignItems="center">
              <MDInput
                label={key}
                value={editData[key] ?? ""}
                onChange={e => handleEditChange(key, e.target.value)}
                fullWidth
                disabled={!editMode}
                sx={{ mr: 2 }}
              />
            </MDBox>
          ))}
        </DialogContent>
        <DialogActions>
          {!editMode ? (
            <Button onClick={handleEdit} color="primary">Edit</Button>
          ) : (
            <>
              <Button onClick={handleSaveEdit} color="primary">Save</Button>
              <Button onClick={handleCancelEdit} color="secondary">Cancel</Button>
            </>
          )}
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity="info" sx={{ width: "100%" }} elevation={6} variant="filled">
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
