const asyncHandler = require("../../utils/async_handler");
const puppeteer = require("puppeteer");
// const puppeteer = require("puppeteer-core");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const ApiError = require("../../utils/api_error");
const eta = require("eta");

// Configure Cloudinary (ensure your Cloudinary credentials are set in environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateInvoicePdf = asyncHandler(async (req, res) => {
  const { orderId, invoiceData } = req.body;
  const { print_type } = req.query;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required.");
  }
  if (!invoiceData) {
    throw new ApiError(400, "Invoice data is required.");
  }

  const templateMap = {
    receipt: "receipt.eta",
    short_receipt: "short_receipt.eta",
    summary: "summary.eta",
    summary_with_items: "summary_with_items.eta",
  };

  const pdfDimensionsMap = {
    receipt: { width: "3.5in" }, // Height will be dynamic
    short_receipt: { width: "3in" }, // Height will be dynamic
    summary: { width: "8.3in", height: "11.7in" }, // A4 size
    summary_with_items: { width: "8.3in", height: "11.7in" }, // A4 size
  };

  const templateName = templateMap[print_type] || "invoice.eta";
  const pdfDimensions = pdfDimensionsMap[print_type] || { width: "8.3in", height: "11.7in" }; // Default to A4

  console.log(`Using template: ${templateName} with PDF dimensions: ${pdfDimensions.width || 'auto'}x${pdfDimensions.height || 'auto'}`);

  eta.renderFile(
    path.join(__dirname, "../../templates", templateName),
    { invoiceData },
    async (err, htmlContent) => {
      if (err) {
        console.error("Error rendering Eta template:", err);
        return res
          .status(500)
          .json({ error: true, message: "Failed to render invoice template." });
      }

      // console.log("HTML Content for PDF:", htmlContent); // Log HTML content for debugging

      let browser;
      const pdfFileName = `invoice-${invoiceData.ownerName}-${orderId}.pdf`;
      const pdfFilePath = path.join(__dirname, "../../pdf", pdfFileName);
      console.log("PDF will be saved to:", pdfFilePath); // Debugging line

      try {
        browser = await puppeteer.launch({
          headless: true,
          // executablePath: '/usr/bin/chromium-browser',
          args: ["--no-sandbox"],
        });
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' }); // Wait for network to be idle

        let pdfOptions = {
          path: pdfFilePath,
          printBackground: true,
          width: pdfDimensions.width,
        };

        // If height is not explicitly defined in pdfDimensionsMap, calculate it dynamically
        if (!pdfDimensions.height) {
          const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
          pdfOptions.height = `${bodyHeight + 50}px`; // Add some padding
          console.log(`Dynamically calculated PDF height: ${pdfOptions.height}`);
        } else {
          pdfOptions.height = pdfDimensions.height;
        }

        await page.pdf(pdfOptions);

        await browser.close();
        browser = null; // Set to null after closing to avoid re-closing in finally block
        console.log("PDF generated successfully at:", pdfFilePath); // Debugging line

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(pdfFilePath, {
          folder: "invoices",
          resource_type: "raw",
          format: "pdf",
          public_id: pdfFileName,
        });
        console.log("Cloudinary upload result:", result); // Debugging line

        // Delete local PDF file
        fs.unlink(pdfFilePath, (err) => {
          if (err) console.error("Error deleting local PDF file:", err);
          else console.log("Local PDF file deleted:", pdfFilePath);
        });

        res.status(200).json({
          error: false,
          message: "Invoice generated and uploaded successfully",
          pdfUrl: result.secure_url,
        });
      } catch (error) {
        console.error("Error generating or uploading invoice:", error);
        res.status(500).json({
          error: true,
          message: "Failed to generate or upload invoice",
          details: error.message,
        });
      } finally {
        if (browser) {
          await browser.close();
          console.log("Puppeteer browser closed in finally block.");
        }
        // Ensure local PDF file is cleaned up even if Cloudinary upload fails
        if (fs.existsSync(pdfFilePath)) {
          fs.unlink(pdfFilePath, (err) => {
            if (err)
              console.error("Error deleting local PDF file in finally:", err);
            else console.log("Local PDF file deleted in finally:", pdfFilePath);
          });
        }
      }
    }
  );
});

module.exports = {
  generateInvoicePdf,
};
