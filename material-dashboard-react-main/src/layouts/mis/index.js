import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function MIS() {
  return (
    <MDBox py={3} px={2}>
      <MDTypography variant="h4" fontWeight="bold" gutterBottom>
        MIS Page
      </MDTypography>
      <MDTypography variant="body1">
        This is the MIS page. Add your content here.
      </MDTypography>
    </MDBox>
  );
}

export default MIS;
