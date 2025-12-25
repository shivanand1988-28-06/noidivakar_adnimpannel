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

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useState, useEffect } from "react";
import { AirlineSeatLegroomExtraOutlined } from "@mui/icons-material";

function Dashboard() {
  const API_BASE = "https://web-production-04c51.up.railway.app";
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [adminData, setAdminData] = useState([]);
  const { sales, tasks } = reportsLineChartData;
  const [assignedTasks, setAssignedTasks] = useState([]);
  useEffect(() => {
    async function loggedAdminData() {
      const adminUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (adminUser === "Admin") {
        setLoading(true);
        setCurrentUser(adminUser);
        console.log(currentUser, adminUser);
        try {
          const response = await fetch(`${API_BASE}/api/admin/all-names`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          const data = await response.json().catch(() => null);
          if (response.ok) {
            setAdminData(data.adminNames || []);
            console.log(adminData);
          } else {
            console.error("Error response:", response.status, data);
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      } else if (adminUser !== "Admin") {
        setLoading(true);
        setCurrentUser(adminUser);
        console.log("Fetching tasks for user:", currentUser,adminUser);
        try {
          fetch(`${API_BASE}/api/admin/assigned-tasks/${encodeURIComponent(currentUser)}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                setAssignedTasks(data.assignedTask || []);
                console.log("Assigned tasks:", data.assignedTask);
              } else {
                console.error("Error:", data.message);
              }
            })
            .catch((err) => console.error("Request failed:", err));
        } catch (error) {
          console.error("Error fetching assigned tasks:", error);
        }
      } else {
        console.log("No admin user found in localStorage.");
      }
    }
    loggedAdminData();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {currentUser === "Admin" ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon="weekend"
                    title="admin-employess"
                    count={adminData.length}
                    percentage={{
                      color: "success",
                      amount: "+55%",
                      label: "than lask week",
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>
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
