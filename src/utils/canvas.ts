import { createCanvas } from "canvas";

export async function renderSchedule(
  name: string,
  height: number,
  width: number,
  date: string,
  events: { desc: string; start: string; end: string }[]
) {
  // Build the canvas for rendering
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Disable antialiasing - tags cant handle it
  ctx.antialias = "none";

  // Set the background color to white
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillRect(0, 0, width, height);

  // Header
  // Calculate the line height based on the height of the tag
  const lineHeight = height / 10;
  // Calculate the font size based on the height of the tag
  const fontSize = lineHeight * 0.5;

  // Draw black header background
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, width, lineHeight);

  // Draw the header text in white
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.font = `bold ${fontSize}px Arial`;

  // Draw the name of the schedule at the beginning of the header
  let row = 1;
  let ypos = row * lineHeight;
  ctx.fillText(name, 10, ypos - (lineHeight - fontSize) / 2);

  // Draw the date at the end of the header
  const textWidth = ctx.measureText(date).width;
  ctx.fillText(
    date,
    width - textWidth - 10,
    ypos - (lineHeight - fontSize) / 2
  );

  // Draw the events
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.font = `normal ${fontSize}px Arial`;
  for (const event of events) {
    ypos = ++row * lineHeight;
    const textWidth = ctx.measureText(`${event.start}-${event.end}`).width;

    // Text
    ctx.fillText(
      `${event.start}-${event.end}`,
      10,
      ypos - (lineHeight - fontSize) / 2
    );
    const seperatorWidth =
      width * 0.025 > 25 ? Math.min(width * 0.025, 50) : 25;
    ctx.fillText(
      event.desc,
      textWidth + seperatorWidth,
      ypos - (lineHeight - fontSize) / 2
    );

    // Line
    ctx.beginPath();
    ctx.moveTo(0, ypos);
    ctx.lineTo(width, ypos);
    ctx.stroke();
  }

  // Return the buffer
  return canvas.toBuffer("image/jpeg", {
    quality: 1,
  });
}

export async function renderEmergencyTag(height: number, width: number) {
  // Build the canvas for rendering
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Disable antialiasing - tags cant handle it
  ctx.antialias = "none";

  // Set the background color to red
  ctx.fillStyle = "rgba(255, 0, 0, 1)";
  ctx.fillRect(0, 0, width, height);

  // Draw Triangle with only borders inside into the center of the tag, leaving 20% on width and 20% on height
  ctx.beginPath();
  ctx.moveTo(width / 2, height * 0.2);
  ctx.lineTo(width * 0.8, height * 0.8);
  ctx.lineTo(width * 0.2, height * 0.8);
  ctx.closePath();
  ctx.strokeStyle = "rgba(255, 255, 255, 1)";
  ctx.lineWidth = width * 0.05 > 10 ? Math.min(width * 0.05, 10) : 5;
  ctx.stroke();

  // Draw a exclamtion mark in the center of the triangle
  ctx.moveTo(width / 2, height * 0.4);
  ctx.lineTo(width / 2, height * 0.6);
  ctx.moveTo(width / 2, height * 0.7);
  ctx.lineWidth = width * 0.05 > 10 ? Math.min(width * 0.05, 15) : 10;
  ctx.stroke();
  ctx.arc(width / 2, height * 0.7, 5, 0, Math.PI * 2);

  // calc line width based on the width of the tag
  ctx.lineWidth = width * 0.05 > 10 ? Math.min(width * 0.05, 10) : 5;
  ctx.stroke();

  // Move the context to the horizontal center and 5% from the top of the tag
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255, 255, 255, 1)";

  // Calc font size to fit text on screen width
  const text = "NOTFALL - GEBÄUDE VERLASSEN";
  let fontSize = 1;
  do {
    ctx.font = `bold ${fontSize}px Arial`;
    fontSize++;
  } while (ctx.measureText(text).width < width * 0.9);

  // Draw the text
  ctx.fillText(text, width / 2, height * 0.05);

  // Return the buffer
  return canvas.toBuffer("image/jpeg", {
    quality: 1,
  });
}
