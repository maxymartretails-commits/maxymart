// lib/ping-once.ts
let pinged = false;

export async function pingExternalServerOnce() {
  if (pinged) return;
  pinged = true;

  try {
    await fetch(`${process.env.NEXT_WEBSOCKET_URL}/api/ping`);
    console.log("✅ Render ping sent on first page load");
  } catch (err) {
    console.error("❌ Ping failed:", err);
  }
}
