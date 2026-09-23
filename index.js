export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Image API Endpoint (/generate-image?prompt=...)
    if (url.pathname === "/generate-image") {
      const prompt = url.searchParams.get("prompt") || "a futuristic city";

      try {
        const response = await env.AI.run(
          "@cf/stabilityai/stable-diffusion-xl-base-1.0",
          { prompt: prompt }
        );

        return new Response(response, {
          headers: {
            "content-type": "image/png",
            "cache-control": "no-cache",
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }
    }

    // 2. HTML Frontend UI (Browser ma direct kholna)
    const html = `
    <!DOCTYPE html>
    <html lang="ne">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AI Text to Image Generator</title>
      <style>
        body { font-family: sans-serif; background: #0f172a; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        h1 { margin-bottom: 20px; font-size: 2rem; }
        .box { width: 100%; max-width: 500px; background: #1e293b; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        input { width: 100%; padding: 12px; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: white; font-size: 1rem; margin-bottom: 12px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; border-radius: 6px; border: none; background: #2563eb; color: white; font-size: 1rem; cursor: pointer; font-weight: bold; }
        button:hover { background: #1d4ed8; }
        .result { margin-top: 20px; text-align: center; }
        img { max-width: 100%; border-radius: 8px; margin-top: 15px; display: none; }
        .loading { display: none; color: #94a3b8; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>Text to Image AI</h1>
        <input type="text" id="prompt" placeholder="E.g., A cute cat sitting on Mars..." />
        <button onclick="generateImage()">Generate Image</button>
        
        <div class="result">
          <div id="loading" class="loading">Image banisakna kehi second lagchha, kurnuhos...</div>
          <img id="output" alt="Generated AI Image" />
        </div>
      </div>

      <script>
        async function generateImage() {
          const prompt = document.getElementById('prompt').value;
          if (!prompt) return alert('Kripaya prompt type garnuhos!');
          
          const img = document.getElementById('output');
          const loading = document.getElementById('loading');
          
          img.style.display = 'none';
          loading.style.display = 'block';

          img.src = '/generate-image?prompt=' + encodeURIComponent(prompt) + '&t=' + Date.now();
          
          img.onload = () => {
            loading.style.display = 'none';
            img.style.display = 'block';
          };
        }
      </script>
    </body>
    </html>
    `;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  },
};
