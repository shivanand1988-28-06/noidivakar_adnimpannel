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
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";

function Dashboard() {
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
            // Log summaryDataJson immediately for debugging
            console.log("Setting taskData to:", summaryDataJson && summaryDataJson.data);
            setTaskData((summaryDataJson && summaryDataJson.data) || []);
          } else {
            console.error("Error fetching task summary:", summaryRes.status, summaryDataJson);
          }
        } catch (error) {
          console.error("Error fetching admin data or task summary:", error);
        }
      } else {
        setLoading(true);
        setCurrentUser(adminUser);
        console.log("Current User:", currentUser);
        try {
          fetch(`${API_BASE}/api/admin/assigned-tasks/${encodeURIComponent(adminUser)}`, {
            method: "GET",
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                setAssignedTasks(data.assignedTask || []);
              } else {
                console.error("Error:", data.message);
              }
            })
            .catch((err) => console.error("Request failed:", err));
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
        <Footer />
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
                  <Grid item xs={12} md={6} lg={4} key={idx}>
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
                        ...(assignedTo[idx] ? { "Assigned To": assignedTo[idx] } : {}),
                        ...(task.status ? { Status: task.status } : {}),
                      }}
                      action={{ route: "/profile", tooltip: "Edit Profile" }}
                      shadow
                    />
                    <div style={{ marginTop: 8, marginBottom: 8 }}>
                      <label htmlFor={`assign-to-${idx}`}>Assign to: </label>
                      <select
                        id={`assign-to-${idx}`}
                        value={assignedTo[idx] || ""}
                        onChange={async (e) => {
                          const newAssignedTo = { ...assignedTo, [idx]: e.target.value };
                          setAssignedTo(newAssignedTo);
                          // Call update noidata route
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
                          } catch (err) {
                            console.error("Failed to update noidata:", err);
                          }
                        }}
                      >
                        <option value="">Select admin</option>

                        {adminData && adminData.length > 0 &&
                          adminData.map((name, i) => (
                            <option key={i} value={name}>
                              {name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <button
                      style={{ marginTop: 8, marginBottom: 8 }}
                      onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                    >
                      {expandedCard === idx ? "Hide Admin Names" : "Show Admin Names"}
                    </button>
                    {/* Removed show admins name block */}
                  </Grid>
                ))}
            </Grid>
          </>
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MDBox mb={1.5}>
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
              </Grid>
            </Grid>
            <MDBox mt={4.5}>
              <Grid container spacing={3}>
                {assignedTasks.map((task, idx) => (
                  <Grid item xs={12} md={6} lg={4} key={idx}>
                    <MDBox mb={3}>
                      <ReportsLineChart
                        color="info"
                        title={task.title || "Task"}
                        description={task.description || "No description"}
                        date={task.dueDate ? `Due: ${task.dueDate}` : "No due date"}
                        chart={tasks}
                      />
                    </MDBox>
                  </Grid>
                ))}
              </Grid>
            </MDBox>
          </>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
