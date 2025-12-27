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
      const adminUser = (localStorage.getItem("user") || "").replace(/^"|"$/g, "");
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
            setAdminData(adminDataJson.adminNames || []);
          } else {
            console.error("Error response (admin names):", adminRes.status, adminDataJson);
          }
          if (summaryRes.ok) {
            // Log summaryDataJson immediately for debugging
            console.log("Setting taskData to:", summaryDataJson);
            setTaskData(summaryDataJson || []);
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
            {/* ProfileInfoCard for each taskData item */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {Array.isArray(taskData) &&
                taskData.map((task, idx) => (
                  <Grid item xs={12} md={6} lg={4} key={idx}>
                    <ProfileInfoCard
                      title={task.title || `Task ${idx + 1}`}
                      description={task.description || "No description"}
                      info={{
                        ...(task.fullName ? { fullName: task.fullName } : {}),
                        ...(task.email ? { email: task.email } : {}),
                        ...(task.status ? { status: task.status } : {}),
                      }}
                      social={[
                        {
                          link: "#",
                          icon: <Icon>facebook</Icon>,
                          color: "facebook",
                        },
                        {
                          link: "#",
                          icon: <Icon>twitter</Icon>,
                          color: "twitter",
                        },
                      ]}
                      action={{ route: "/profile", tooltip: "Edit Profile" }}
                      shadow
                    />
                  </Grid>
                ))}
            </Grid>
            {/* Showcase of all example cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6} lg={4}>
                <SimpleBlogCard
                  image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                  title="Simple Blog Card"
                  description="A short blog card description."
                  action={{ type: "internal", route: "/", color: "info", label: "Read More" }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <DefaultInfoCard
                  color="primary"
                  icon="info"
                  title="Info Card"
                  description="Some info card description."
                  value="123"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <ProfileInfoCard
                  title="Profile Info"
                  description="User profile description."
                  info={{ fullName: "John Doe", email: "john@example.com" }}
                  social={[
                    { link: "#", icon: <Icon>facebook</Icon>, color: "facebook" },
                    { link: "#", icon: <Icon>twitter</Icon>, color: "twitter" },
                  ]}
                  action={{ route: "/profile", tooltip: "Edit Profile" }}
                  shadow
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <DefaultProjectCard
                  image="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
                  label="Project"
                  title="Project Card"
                  description="A project card description."
                  action={{
                    type: "internal",
                    route: "/project",
                    color: "info",
                    label: "View Project",
                  }}
                  authors={[
                    { image: "https://randomuser.me/api/portraits/men/32.jpg", name: "Alice" },
                    { image: "https://randomuser.me/api/portraits/men/33.jpg", name: "Bob" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <ComplexStatisticsCard
                  color="success"
                  icon="leaderboard"
                  title="Statistics Card"
                  count={456}
                  percentage={{ color: "success", amount: "+20%", label: "since last month" }}
                />
              </Grid>
            </Grid>
            {/* Admin summary card */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="info"
                    icon="person"
                    title="Sample Card"
                    count={42}
                    percentage={{
                      color: "success",
                      amount: "+10%",
                      label: "since last week",
                    }}
                  />
                </MDBox>
              </Grid>
              {adminData.map((name, idx) => (
                <Grid item xs={12} md={6} lg={3} key={idx}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      color="dark"
                      icon="person"
                      title={name}
                      count={1}
                      percentage={{
                        color: "success",
                        amount: "",
                        label: "Admin User",
                      }}
                    />
                  </MDBox>
                </Grid>
              ))}
            </Grid>
            {/* Charts and other widgets */}
            <MDBox mt={4.5}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsBarChart
                      color="info"
                      title="website views"
                      description="Last Campaign Performance"
                      date="campaign sent 2 days ago"
                      chart={reportsBarChartData}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsLineChart
                      color="success"
                      title="daily sales"
                      description={
                        <>
                          (<strong>+15%</strong>) increase in today sales.
                        </>
                      }
                      date="updated 4 min ago"
                      chart={sales}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsLineChart
                      color="dark"
                      title="completed tasks"
                      description="Last Campaign Performance"
                      date="just updated"
                      chart={tasks}
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
            <MDBox>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={8}>
                  <Projects />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <OrdersOverview />
                </Grid>
              </Grid>
            </MDBox>
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
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
