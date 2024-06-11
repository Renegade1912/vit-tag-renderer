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
    ctx.fillText(
      event.desc,
      textWidth + 25,
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
