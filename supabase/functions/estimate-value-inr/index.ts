import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = "AIzaSyDY4sn5XIIvgiX-1sGtz5TpMXrS-I_A_o8"; // Deno.env.get("GEMINI_API_KEY");

Deno.serve(async (req: Request) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { listings } = body;

        if (!listings || !Array.isArray(listings)) {
            throw new Error("No listings provided");
        }

        const prompt = `You are a currency and valuation expert for a recycling marketplace in India.
Convert the following list of electronic components with prices in USD to INR.
Use a reasonable current exchange rate (around 1 USD = 83-85 INR).
For each item, return the original ID and the new price in INR as an integer (round up).

Listings:
${listings.map(l => `- ID: ${l.id}, Name: ${l.name}, USD: ${l.price}`).join('\n')}

Return ONLY a JSON array of objects:
[
  { "id": "original-id", "price_inr": number },
  ...
]`;

        console.log(`[DEBUG] Estimating values for ${listings.length} items`);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    response_mime_type: "application/json",
                }
            })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error?.message || "Gemini API failed");
        }

        let aiResponseContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiResponseContent) {
            throw new Error("Empty response from AI");
        }

        // Clean potentially marked up JSON
        aiResponseContent = aiResponseContent.replace(/```json\n?/, '').replace(/\n?```/, '').trim();

        return new Response(aiResponseContent, {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        console.error("[DEBUG] Function Catch Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
