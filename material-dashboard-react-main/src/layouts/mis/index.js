import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

const API_BASE = "https://web-production-04c51.up.railway.app";
const NOIDATA_FIELDS = [
  { label: "Status", value: "status" },
  { label: "Aadhaar Number", value: "aadhaarNumber" },
  { label: "PAN Name", value: "panName" },
  { label: "PAN Number", value: "panNumber" },
  { label: "File Name", value: "fileName" },
  { label: "Upload Date", value: "uploadDate" },
  { label: "Sanction Date", value: "sanctionDate" },
  { label: "Applicant Name", value: "applicantName" },
  { label: "Application Number", value: "applicationNumber" },
  { label: "BSM Name", value: "bsmName" },
  { label: "BSM Id", value: "bsmId" },
  { label: "BSM Mobile Number", value: "bsmMobileNumber" },
  { label: "Balance Transfer", value: "balanceTransfer" },
  { label: "Terms Of Facility", value: "termsOfFacility" },
  { label: "Facility Amount", value: "facilityAmount" },
  { label: "EMI Amount", value: "emiAmount" },
  { label: "Administrative Fees", value: "administrativeFees" },
  { label: "CIBIL Fees", value: "cibilFees" },
  { label: "CERSAI Fees", value: "cersaiFees" },
  { label: "Mortgage Guarantee Fees", value: "mortgageGuaranteeFees" },
  { label: "Fee Paid", value: "feePaid" },
  { label: "Rate Of Interest", value: "rateOfInterest" },
  { label: "Interest Rate Type", value: "interestRateType" },
  { label: "Benchmark Rate", value: "benchmarkRate" },
  { label: "Margin", value: "margin" },
  { label: "Prepayment Charges", value: "prepaymentCharges" },
  { label: "Special Conditions", value: "specialConditions" },
  { label: "Raw QR Data", value: "rawQRData" },
  { label: "Submitter Type", value: "submitterType" },
  { label: "Submitter Id", value: "submitterId" },
  { label: "Submitter Phone", value: "submitterPhone" },
  { label: "Submitter Email", value: "submitterEmail" },
  { label: "Extracted At", value: "extractedAt" },
  { label: "Assigned To", value: "assignedTo" },
  { label: "Current Address", value: "currentAddress" },
  { label: "Aadhaar Name", value: "aadhaarName" },
  { label: "Aadhaar Address", value: "aadhaarAddress" },
  { label: "Borrower", value: "borrower" },
  { label: "Co-Borrower", value: "coBorrower" },
  { label: "Total Challan", value: "totalChallan" },
  { label: "Mod Date", value: "modDate" },
  { label: "Challan Names", value: "challanNames" },
  { label: "Total Payable", value: "totalPayable" },
  { label: "Created At", value: "createdAt" },
  { label: "Updated At", value: "updatedAt" },
];

function MIS() {
  const [selectedFields, setSelectedFields] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/noidata`)
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
    <DashboardLayout>
      <MDBox py={3} px={2}>
        <MDTypography variant="h4" fontWeight="bold" gutterBottom>
          MIS Page
        </MDTypography>
        <FormControl sx={{ minWidth: 300, mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            sx={{ mb: 1, mr: 1 }}
            onClick={() => setSelectedFields(NOIDATA_FIELDS.map(f => f.value))}
          >
            Select All
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
            onClick={() => setSelectedFields([])}
          >
            Deselect All
          </Button>
          <InputLabel id="select-fields-label">Select Fields</InputLabel>
          <Select
            labelId="select-fields-label"
            multiple
            value={selectedFields}
            onChange={handleFieldChange}
            renderValue={(selected) => (
              <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', width: 270 }}>
                {selected.map(f => (
                  <span key={f} style={{ marginRight: 8, background: '#e0e0e0', borderRadius: 4, padding: '2px 6px', fontSize: 13 }}>
                    {NOIDATA_FIELDS.find(field => field.value === f).label}
                  </span>
                ))}
              </div>
            )}
            sx={{ width: 300 }}
            MenuProps={{
              PaperProps: {
                style: {
                  width: 300,
                  maxHeight: 300,
                },
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
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
    </DashboardLayout>
  );
}

export default MIS;
