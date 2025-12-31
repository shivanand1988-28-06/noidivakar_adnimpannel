import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

const API_BASE = "https://web-production-04c51.up.railway.app";
const NOIDATA_FIELDS = [
  { label: "Application Number", value: "applicationNumber" },
  { label: "Applicant Name", value: "applicantName" },
  { label: "Assigned To", value: "assignedTo" },
  { label: "Status", value: "status" },
  { label: "BSM", value: "bsmName" },
  { label: "Submitter's Phone", value: "submitterPhone" },
  { label: "Submitter's Email", value: "submitterEmail" },
];

function MIS() {
  const [selectedFields, setSelectedFields] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/noidata/summary`)
      .then((res) => res.json())
      .then((data) => {
        setTableData(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFieldChange = (event) => {
    setSelectedFields(event.target.value);
  };

  const handleExport = () => {
    if (!selectedFields.length || !tableData.length) return;
    const csvRows = [];
    // Header
    csvRows.push(selectedFields.map(f => NOIDATA_FIELDS.find(field => field.value === f).label).join(","));
    // Data
    tableData.forEach(row => {
      csvRows.push(selectedFields.map(f => JSON.stringify(row[f] ?? "")).join(","));
    });
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "noidata_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MDBox py={3} px={2}>
      <MDTypography variant="h4" fontWeight="bold" gutterBottom>
        MIS Page
      </MDTypography>
      <FormControl sx={{ minWidth: 300, mb: 2 }}>
        <InputLabel id="select-fields-label">Select Fields</InputLabel>
        <Select
          labelId="select-fields-label"
          multiple
          value={selectedFields}
          onChange={handleFieldChange}
          renderValue={(selected) => selected.map(f => NOIDATA_FIELDS.find(field => field.value === f).label).join(", ")}
        >
          {NOIDATA_FIELDS.map((field) => (
            <MenuItem key={field.value} value={field.value}>
              <Checkbox checked={selectedFields.indexOf(field.value) > -1} />
              <ListItemText primary={field.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleExport} disabled={!selectedFields.length || !tableData.length || loading}>
        Export Selected Fields
      </Button>
      {loading && <MDTypography variant="body2" color="text">Loading data...</MDTypography>}
    </MDBox>
  );
}

export default MIS;
