import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import companyLogo from "/LOGO.png"; // Your public logo

export const downloadBillingPDF = (billingData: any[]) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleString();

  // Logo
  doc.addImage(companyLogo, "PNG", 10, 10, 25, 25);

  // Header
  doc.setFontSize(18);
  doc.text("Billing & Revenue Report", 40, 20);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${date}`, 40, 28);

  const tableData = billingData.map((bill: any) => [
    bill.project_id?.name,
    bill.employee_id?.name,
    bill.story_points_completed,
    `₹${bill.billing_rate_per_point}`,
    `₹${bill.total_revenue}`,
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Project", "Employee", "Points", "Rate", "Revenue"]],
    body: tableData,
  });

  doc.setFontSize(13);
  doc.text(
    `Total Revenue: ₹${billingData.reduce(
      (sum, b) => sum + b.total_revenue,
      0
    )}`,
    14,
    doc.lastAutoTable.finalY + 10
  );

  doc.save("billing-report.pdf");
};