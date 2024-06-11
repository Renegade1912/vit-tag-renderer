import {
  Image,
  createCanvas,
  type Canvas,
  type CanvasRenderingContext2D,
} from "canvas";
import QRCode from "qrcode";

function setupCanvas(width: number, height: number, color: string): Canvas {
  // Build the canvas for rendering
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Disable antialiasing - tags cant handle it
  ctx.antialias = "none";

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  return canvas;
}

function renderHeader(
  ctx: CanvasRenderingContext2D,
  name: string,
  date: string
) {
  // Get the width of the canvas
  const width = ctx.canvas.width;
  // Calculate the line height based on the height of the tag
  const lineHeight = ctx.canvas.height / 10;
  // Calculate the font size based on the height of the tag
  const fontSize = lineHeight * 0.5;

  // Draw black header background
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, width, lineHeight);

  // Draw the header text in white
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.font = `bold ${fontSize}px Arial`;

  // Draw the name of the schedule at the beginning of the header
  let ypos = lineHeight;
  ctx.fillText(name, 10, ypos - (lineHeight - fontSize) / 2);

  // Draw the date at the end of the header
  const textWidth = ctx.measureText(date).width;
  ctx.fillText(
    date,
    width - textWidth - 10,
    ypos - (lineHeight - fontSize) / 2
  );
}

export async function renderSchedule(
  name: string,
  height: number,
  width: number,
  date: string,
  events: { desc: string; start: string; end: string }[]
) {
  // Build the canvas for rendering
  const canvas = setupCanvas(width, height, "rgba(255, 255, 255, 1)");
  const ctx = canvas.getContext("2d");

  // Calculate the line height based on the height of the tag
  const lineHeight = height / 10;
  // Calculate the font size based on the height of the tag
  const fontSize = lineHeight * 0.5;

  // Draw header
  renderHeader(ctx, name, date);

  let row = 1;
  let ypos;

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

export async function renderNotConfiguredTag(
  height: number,
  width: number,
  url: string
) {
  // Build the canvas for rendering
  const canvas = setupCanvas(width, height, "rgba(255, 255, 255, 1)");
  const ctx = canvas.getContext("2d");

  // Render the header
  renderHeader(ctx, "Kein Raum zugewiesen", "");

  // Calculate the line height based on the height of the tag
  const lineHeight = height / 10;
  // Calculate the font size based on the height of the tag
  const fontSize = lineHeight * 0.5;

  // Write "Jetzt konfigurieren" in the top center of the tag (after header)
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.font = `normal ${fontSize}px Arial`;
  ctx.fillText("Jetzt konfigurieren", width / 2, lineHeight * 2.5);

  // Generate the QR Code
  const qrCode = await QRCode.toDataURL(url);

  // Draw the QR Code under the text
  const qrCodeImage = new Image();
  qrCodeImage.src = qrCode;
  ctx.drawImage(
    qrCodeImage,
    width * 0.35,
    lineHeight * 3,
    width * 0.3,
    width * 0.3
  );

  // Return the buffer
  return canvas.toBuffer("image/jpeg", {
    quality: 1,
  });
}

export async function renderEmergencyTag(height: number, width: number) {
  // Build the canvas for rendering
  const canvas = setupCanvas(width, height, "rgba(255, 0, 0, 1)");
  const ctx = canvas.getContext("2d");

  // Draw Triangle with only borders inside into the center of the tag, leaving 20% on width and 20% on height
  ctx.beginPath();
  ctx.moveTo(width / 2, height * 0.2);
  ctx.lineTo(width * 0.8, height * 0.8);
  ctx.lineTo(width * 0.2, height * 0.8);
  ctx.closePath();
  ctx.strokeStyle = "rgba(255, 255, 255, 1)";
  ctx.lineWidth = width * 0.05 > 10 ? Math.min(width * 0.05, 10) : 5;
  ctx.stroke();

  // Draw exclamation mark line
  ctx.moveTo(width / 2, height * 0.4);
  ctx.lineTo(width / 2, height * 0.6);
  ctx.lineWidth = width * 0.05 > 10 ? Math.min(width * 0.05, 15) : 10;
  ctx.stroke();

  // Draw exclamation mark dot
  ctx.moveTo(width / 2, height * 0.7);
  ctx.arc(width / 2, height * 0.7, 5, 0, Math.PI * 2);
  ctx.lineWidth = width * 0.05 > 10 ? Math.min(width * 0.05, 10) : 5;
  ctx.stroke();

  // Move the context to the horizontal center and top of the tag
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
