const API_KEY = "AIzaSyC1uve-hBuP_s8c2q0vinUZM5S6OZzJFK4";

async function listModels() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await res.json();
    console.log("AVAILABLE MODELS:");
    data.models.forEach(m => {
      console.log(`- ${m.name} (${m.supportedGenerationMethods.join(", ")})`);
    });
  } catch (err) {
    console.error("Error listing models:", err.message);
  }
}

listModels();
