exports.tripToFile = async (req, res) => {
  try {
    // Fetch the trip data from the collection
    const tripId = req.params.id;
    const tripData = await Trip.findById(tripId)
      .populate({
        path: "itineraries",
        populate: {
          path: "mapPoints",
        },
      })
      .lean();
    if (!tripData) {
      console.error("Trip not found");
      res.status(404).send("Trip not found");
      return;
    }

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      let pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          "Content-Length": Buffer.byteLength(pdfData),
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment;filename=TripDetails.pdf",
        })
        .end(pdfData);
    });

    // Register font and add trip title
    doc.registerFont("Poppins", "./Poppins-Regular.ttf");
    doc
      .fontSize(24)
      .font("Poppins")
      .text(`Name's Trip To ${tripData.city || "-"}!`, {
        align: "center",
        underline: true,
      });
    doc.moveDown(1);

    // Headers and Values (Without Description)
    const headers = ["State", "Capital", "City", "Currency", "Currency Name"];
    const values = [
      tripData.state || "-",
      tripData.capital || "-",
      tripData.city || "-",
      tripData.currency || "-",
      tripData.currency_name || "-",
    ];

    const columnCount = headers.length;
    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidth = Math.floor(pageWidth / columnCount);
    const startX = doc.page.margins.left - 20;
    let startY = doc.y;

    // Utility function to center text within each column
    const drawText = (text, x, y, width, offset = 0, fontSize = 12) => {
      doc
        .fontSize(fontSize) // Set font size here
        .text(text, x + offset, y, {
          width,
          align: "center",
        });
    };

    // Draw Headers
    headers.forEach((header, index) => {
      const x = startX + index * columnWidth;
      const offset = header === "Currency Name" ? 20 : 0; // Add margin for "Currency Name"
      drawText(header, x, startY, columnWidth, offset, 12);
    });

    // Draw Values Directly Under Headers
    startY += 20; // Move down to place values below headers
    values.forEach((value, index) => {
      const x = startX + index * columnWidth;
      const offset = headers[index] === "Currency Name" ? 20 : 0; // Add margin for "Currency Name"
      drawText(value, x, startY, columnWidth, offset, 12);
    });

    // Move to the next line for the Description section
    // Increase the margin before the description
    startY += 50; // Adjust this value to control the margin (e.g., 50 for more spacing)

    const markerRadius = 12; // Marker size
    const markerSpacing = 160; // Space between markers
    const initialXPosition = 60; // Starting X position for the timeline
    const lineOffsetY = 50; // Vertical offset for the timeline horizontal line

    // Iterate through each day's itinerary
    for (const itinerary of tripData.itineraries) {
      const itineraryDate = itinerary.date
        ? new Date(itinerary.date)
        : new Date();
      const dateText = itineraryDate.toLocaleDateString();
      const dayText = `Day ${tripData.itineraries.indexOf(itinerary) + 1}`;

      // Check remaining vertical space before adding a new day's content
      const remainingHeight = doc.page.height - doc.y - (lineOffsetY + 150); // Removed imageHeight dependency
      if (remainingHeight < 0) {
        doc.addPage(); // Add a new page if there's not enough space
      }

      // Add date on the left and day number on the right (same row)
      const yPositionForDate = doc.y; // Ensure consistent vertical position
      doc.font("Poppins").fontSize(14).text(dateText, 50, yPositionForDate); // Left-aligned date
      doc
        .font("Poppins")
        .fontSize(14)
        .text(dayText, doc.page.width - 100, yPositionForDate, {
          align: "right",
        });

      // Move down to start the timeline
      doc.moveDown(2);

      // Draw the timeline
      let startX = initialXPosition;
      const lineY = doc.y + lineOffsetY;

      // Draw horizontal line for the day
      const endX = startX + markerSpacing * (itinerary.mapPoints.length - 1); // End at the center of the last marker
      doc
        .moveTo(startX, lineY) // Start at the center of the first marker
        .lineTo(endX, lineY) // End at the center of the last marker
        .stroke();

      // Draw each stop with name, address, and marker
      for (const point of itinerary.mapPoints) {
        const label = String.fromCharCode(
          65 + itinerary.mapPoints.indexOf(point)
        ); // A, B, C, etc.

        // Draw circular marker
        doc
          .circle(startX, lineY, markerRadius)
          .fillAndStroke("#000000", "#000000"); // Black filled marker
        doc
          .fill("#FFFFFF") // White text inside the marker
          .fontSize(14)
          .text(label, startX - 5, lineY - 8);

        // Add stop name and address
        const name = point.pointData?.name || "Unknown";
        const address =
          point.pointData?.formatted_address || "Address not available";

        // Adjust the Y position for name and address text without including image space
        doc
          .font("Poppins")
          .fontSize(12)
          .text(name, startX - 40, lineY + 20, {
            width: 80,
            align: "center",
          });
        doc
          .font("Poppins")
          .fontSize(10)
          .fill("#666666")
          .text(address, startX - 40, lineY + 35, {
            width: 80,
            align: "center",
          });

        // Move startX for the next marker
        startX += markerSpacing;
      }

      // Move down to properly space out the next day's itinerary
      doc.y = lineY + 150; // Adjust vertical spacing for next section, without image space
    }

    doc.end();
  } catch (error) {
    console.error("Error fetching trips from database", error);
    res.status(500).send("Error fetching trips");
  }
};