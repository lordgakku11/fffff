export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. REST API Endpoint: POST /api/generate
    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const body = await request.json();
        const prompt = body.prompt;

        if (!prompt) {
          return new Response(JSON.stringify({ error: "Prompt required" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        // Cloudflare Workers AI call garne
        const response = await env.AI.run(
          "@cf/stabilityai/stable-diffusion-xl-base-1.0",
          { prompt: prompt }
        );

        // Raw PNG Image Binary response pathaune
        return new Response(response, {
          headers: {
            "content-type": "image/png",
            "access-control-allow-origin": "*", // CORS enable garera junai app bata chalauna milne
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }
    }

    // Default response for other paths
    return new Response("AI Text-to-Image API is running! Send a POST request to /api/generate", {
      headers: { "content-type": "text/plain" },
    });
  },
};
