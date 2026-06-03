export async function onRequestPost({ request, env }) {
  const FEISHU_WEBHOOK_URL = env.FEISHU_WEBHOOK_URL || "https://open.feishu.cn/open-apis/bot/v2/hook/e4f71fb5-9d69-444b-9773-4b4769d4fae4";

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const { name, contact, description } = body || {};

  if (!description || !contact) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const message = {
    msg_type: "text",
    content: {
      text: `📩 读者提问\n\n👤 ${name || "匿名"}\n📱 ${contact}\n\n📝 困境：\n${description}`
    }
  };

  try {
    const feishuRes = await fetch(FEISHU_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });

    if (!feishuRes.ok) {
      console.error("Feishu error:", await feishuRes.text());
      return new Response(JSON.stringify({ error: "Failed to send to Feishu" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (e) {
    console.error("Fetch error:", e);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
