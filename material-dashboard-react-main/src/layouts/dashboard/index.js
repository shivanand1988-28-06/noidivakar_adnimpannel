
import React from "react";
import Icon from "@mui/material/Icon";
import SimpleBlogCard from "examples/Cards/BlogCards/SimpleBlogCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
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

// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import useMediaQuery from "@mui/material/useMediaQuery";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";

function Dashboard() {
    // DataTable columns for assignedTasks
    const assignedTasksColumns = [
      { Header: "Applicant Name", accessor: "applicantName", width: "30%", align: "left" },
      { Header: "Application Number", accessor: "applicationNumber", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ];

    // DataTable rows for assignedTasks
    const assignedTasksRows = assignedTasks.map((task) => ({
      applicantName: (
        <MDTypography variant="button" fontWeight="medium">
          {task.applicantName}
        </MDTypography>
      ),
      applicationNumber: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {task.applicationNumber}
        </MDTypography>
      ),
      status: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={task.status || "-"} color={task.status === "online" ? "success" : "dark"} variant="gradient" size="sm" />
        </MDBox>
      ),
      action: (
        <MDTypography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
          onClick={() => handleEditClick(task)}
          style={{ cursor: "pointer" }}
        >
          Edit
        </MDTypography>
      ),
    }));
  const isMobile = useMediaQuery("(max-width:600px)");
  // Track expanded card and assigned admin per card
  const [expandedCard, setExpandedCard] = React.useState(null);
  const [assignedTo, setAssignedTo] = React.useState({});
  const API_BASE = "https://web-production-04c51.up.railway.app";
  const [loading, setLoading] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState("");
  const [adminData, setAdminData] = React.useState([]);
  const [assignedTasks, setAssignedTasks] = React.useState([]);
  const [userNotFound, setUserNotFound] = React.useState(false);
  const [taskData, setTaskData] = React.useState([]);
  const sales = [];
  const tasks = [];

  // Edit modal state and handlers (move outside useEffect)
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState({ id: "", applicantName: "", status: "" });

  const handleEditClick = (task) => {
    setEditForm({ id: task.id, applicantName: task.applicantName, status: task.status });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/noidata/by-application-number/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName: editForm.applicantName,
          status: editForm.status,
        }),
      });
      // Refetch assigned tasks after update
      fetch(`${API_BASE}/api/noidata?assignedTo=${encodeURIComponent(currentUser)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.data)) {
            const adminUserStr = String(currentUser).trim();
            const filtered = data.data
              .filter((item) => String(item.assignedTo).trim() === adminUserStr)
              .map((item) => ({
                id: item.id || item._id || item.documentId,
                applicantName: item.applicantName,
                applicationNumber: item.applicationNumber,
                status: item.status,
              }));
            setAssignedTasks(filtered);
          }
        });
      setEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update document:", err);
    }
  };

  React.useEffect(() => {
    async function loggedAdminData() {
      const adminUser = (localStorage.getItem("user") || "").replace(/^"|"$/g, "").trim();
      const token = localStorage.getItem("token");
      if (!adminUser) {
        setLoading(false);
        setCurrentUser("");
        setUserNotFound(true);
        console.error("Admin user not found in localStorage.");
        return;
      }
      setUserNotFound(false);
      if (adminUser === "Admin") {
        setLoading(true);
        setCurrentUser(adminUser);
        // Log adminUser directly for immediate value
        console.log("Setting Current User to:", adminUser);
        try {
          const [adminRes, summaryRes] = await Promise.all([
            fetch(`${API_BASE}/api/admin/all-names`, { method: "GET" }),
            fetch(`${API_BASE}/api/noidata/summary`, { method: "GET" }),
          ]);
          const adminDataJson = await adminRes.json().catch(() => null);
          const summaryDataJson = await summaryRes.json().catch(() => null);
          if (adminRes.ok) {
            setAdminData((adminDataJson && adminDataJson.adminNames) || []);
          } else {
            console.error("Error response (admin names):", adminRes.status, adminDataJson);
          }
          if (summaryRes.ok) {
            // Ensure each document has an id field
            let docs = (summaryDataJson && summaryDataJson.data) || [];
            if (Array.isArray(docs)) {
              docs = docs.map((doc) => ({ ...doc, id: doc.id || doc._id || doc.documentId || undefined }));
            }
            console.log("Setting taskData to:", docs);
            setTaskData(docs);
          } else {
            console.error("Error fetching task summary:", summaryRes.status, summaryDataJson);
          }
        } catch (error) {
          console.error("Error fetching admin data or task summary:", error);
        }
      } else {
        setLoading(true);
        setCurrentUser(adminUser);
        console.log("Current User:", adminUser);
        try {
          // Fetch assigned tasks as before
          

          // Fetch from /api/noidata where assignedTo = adminUser
          fetch(`${API_BASE}/api/noidata?assignedTo=${encodeURIComponent(adminUser)}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((data) => {
              // Handle API response: { success, count, data: [...] }
              if (data && Array.isArray(data.data)) {
                console.log(data.data);
                // Filter by assignedTo === adminUser (in case API does not filter)
                const adminUserStr = String(adminUser).trim();
                const filtered = data.data
                  .filter((item) => String(item.assignedTo).trim() === adminUserStr)
                  .map((item) => ({
                    id: item.id || item._id || item.documentId,
                    applicantName: item.applicantName,
                    applicationNumber: item.applicationNumber,
                    status: item.status,
                  }));
                setAssignedTasks(filtered);
                console.log(assignedTasks,filtered);
              } else {
                console.error("Unexpected /api/noidata response:", data);
              }
            })
            .catch((err) => console.error("/api/noidata request failed:", err));
        } catch (error) {
          console.error("Error fetching assigned tasks:", error);
        }
      }
    }
    loggedAdminData();
  }, []);

  if (userNotFound) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
          <Grid container justifyContent="center">
            <Grid item>
              <MDBox mb={2}>
                <ComplexStatisticsCard
                  color="error"
                  icon="error"
                  title="User Not Found"
                  count={0}
                  percentage={{ color: "error", amount: "", label: "Please log in to continue." }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {!isMobile && <Footer />}
      </DashboardLayout>
    );
  }

  // Main dashboard render
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {currentUser === "Admin" ? (
          <>
            {/* Debug: Show raw taskData */}
            <MDBox mb={2}>
            </MDBox>
            {/* ProfileInfoCard for each taskData item */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {Array.isArray(taskData) &&
                taskData.map((task, idx) => (
                    <Grid item xs={12} md={6} lg={4} key={idx} sx={{ mb: { xs: 6, sm: 6, md: 8, lg: 10 } }}>
                    <ProfileInfoCard
                      title={task.applicantName || `Task ${idx + 1}`}
                      description={
                        <span>
                          Application #: {task.applicationNumber || "N/A"}
                          {task.applicationNumber && (
                            <Icon
                              sx={{ cursor: "pointer", ml: 1, fontSize: 18, verticalAlign: "middle" }}
                              title="Copy Application Number"
                              onClick={() => {
                                if (navigator && navigator.clipboard) {
                                  navigator.clipboard.writeText(task.applicationNumber);
                                }
                              }}
                            >
                              content_copy
                            </Icon>
                          )}
                        </span>
                      }
                      info={{
                        ...(task.bsmName ? { BSM: task.bsmName } : {}),
                        ...(task.submitterPhone ? { "Submitter's Phone": task.submitterPhone } : {}),
                        ...(task.submitterEmail ? { Email: task.submitterEmail } : {}),
                        ...(task.assignedTo ? {
                          "Assigned To": (
                            <span style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                              <Icon sx={{ color: 'green', fontSize: 18, verticalAlign: 'middle', mr: 0.5 }}>check_circle</Icon>
                              {task.assignedTo}
                            </span>
                          )
                        } : {}),
                        ...(task.status ? { Status: task.status } : {}),
                      }}
                      action={{ route: "/profile", tooltip: "Edit Profile" }}
                      shadow
                    />
                    <div style={{ marginTop: 8, marginBottom: 8 }}>
                      <label htmlFor={`assign-to-${idx}`}>Assign to: </label>
                      <select
                        id={`assign-to-${idx}`}
                        value={task.assignedTo || ""}
                        onChange={async (e) => {
                          // Update assignedTo in backend and refresh taskData
                          try {
                            await fetch(`${API_BASE}/api/noidata/by-application-number/${task.applicationNumber}`, {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                applicationNumber: task.applicationNumber,
                                assignedTo: e.target.value,
                              }),
                            });
                            // Refetch summary to update UI
                            const summaryRes = await fetch(`${API_BASE}/api/noidata/summary`, { method: "GET" });
                            const summaryDataJson = await summaryRes.json().catch(() => null);
                            let docs = (summaryDataJson && summaryDataJson.data) || [];
                            if (Array.isArray(docs)) {
                              docs = docs.map((doc) => ({ ...doc, id: doc.id || doc._id || doc.documentId || undefined }));
                            }
                            setTaskData(docs);
                          } catch (err) {
                            console.error("Failed to update noidata:", err);
                          }
                        }}
                      >
                        <option value="">Select employee</option>

                        {adminData && adminData.length > 0 &&
                          adminData.map((name, i) => (
                            <option key={i} value={name}>
                              {name}
                            </option>
                          ))}
                      </select>
                    </div>
                    {/* <button
                      style={{ marginTop: 8, marginBottom: 8 }}
                      onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                    >
                      {expandedCard === idx ? "Hide Admin Names" : "Show Admin Names"}
                    </button> */}
                    {/* Removed show admins name block */}
                  </Grid>
                ))}
            </Grid>
          </>
        ) : (
          <>
            <MDBox mb={2}>
              <ComplexStatisticsCard
                color="info"
                icon="assignment"
                title="Assigned Tasks"
                count={assignedTasks.length}
                percentage={{
                  color: "info",
                  amount: "",
                  label: "Your assigned tasks",
                }}
              />
            </MDBox>
            {/* Authors Table for assignedTasks */}
            <MDBox mt={4.5}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Assigned Tasks Table
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: assignedTasksColumns, rows: assignedTasksRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
              {/* Edit Modal */}
              {editModalOpen && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 320 }}>
                    <h3>Edit Task</h3>
                    <form onSubmit={handleEditSubmit}>
                      <div style={{ marginBottom: 12 }}>
                        <label>Status:</label>
                        <input type="text" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label>Applicant Name:</label>
                        <input type="text" value={editForm.applicantName} onChange={e => setEditForm({ ...editForm, applicantName: e.target.value })} />
                      </div>
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setEditModalOpen(false)} style={{ marginLeft: 8 }}>Cancel</button>
                    </form>
                  </div>
                </div>
              )}
            </MDBox>
          </>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
