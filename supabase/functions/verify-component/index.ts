import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// HARDCODED FIX for user session
const GEMINI_API_KEY = "AIzaSyDY4sn5XIIvgiX-1sGtz5TpMXrS-I_A_o8";

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
        const { image, deviceName, expectedComponentName, mimeType = "image/jpeg" } = body;

        console.log(`[DEBUG] Attempting verification for: ${expectedComponentName} (${mimeType})`);

        if (!image) {
            throw new Error("No image data provided");
        }

        const prompt = `You are a specific purpose AI for a recycling app. 
The user claims to have removed a component: "${expectedComponentName}" from a device: "${deviceName}".
Analyze the uploaded image.
Task: Determine if the image plausibly shows the "${expectedComponentName}".

CRITICAL INSTRUCTIONS:
1. IGNORE specific model numbers, serial codes, or part IDs (e.g. if the expected part is "L15106-001 Battery", just verify if it looks like a "Battery").
2. Focus on the visual characteristics of the component CATEGORY (e.g. detailed PCB for motherboard, rectangular block for battery).
3. Be REASONABLE. Do not require professional photography, but the object must clearly resemble the expected component type.
4. REJECT if the image shows a completely different type of electronics (e.g. uploading a fan when asking for a battery).
5. REJECT if the image shows non-electronic objects.
6. If the image is blurry but identifiable as the correct category, return "verified".

Return specific JSON:
{
  "status": "verified" | "mismatch",
  "condition": "Mint" | "Good" | "Fair" | "Poor",
  "confidence": number (0.0 to 1.0),
  "reasoning": "Short explanation"
}`;

        // Try models in order of preference
        const models = ["gemini-flash-latest", "gemini-1.5-flash"];
        let lastError = null;
        let successfulResponse = null;

        for (const model of models) {
            let retries = 2;
            while (retries > 0) {
                try {
                    console.log(`[DEBUG] Trying model: ${model} (Retries left: ${retries - 1})`);
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [
                                    { text: prompt },
                                    {
                                        inline_data: {
                                            mime_type: mimeType,
                                            data: image
                                        }
                                    }
                                ]
                            }],
                            generationConfig: {
                                response_mime_type: "application/json",
                            }
                        })
                    });

                    const data = await response.json();

                    if (response.ok && !data.error) {
                        successfulResponse = data;
                        break;
                    } else {
                        console.warn(`[DEBUG] Model ${model} failed:`, data.error?.message || "Unknown error");
                        lastError = data.error || { message: "Unknown error" };

                        // If rate limited, wait and retry
                        if (data.error?.status === "RESOURCE_EXHAUSTED" || response.status === 429) {
                            console.log("[DEBUG] Quota hit, waiting 2 seconds...");
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            retries--;
                            continue;
                        }
                        break; // Other errors (400, etc) don't need retry on same model
                    }
                } catch (err: any) {
                    console.error(`[DEBUG] Request error for ${model}:`, err.message);
                    lastError = err;
                    break;
                }
            }
            if (successfulResponse) break;
        }

        if (!successfulResponse) {
            return new Response(JSON.stringify({
                error: (lastError as any)?.message || "All Gemini models failed",
                code: (lastError as any)?.status || "INTERNAL_ERROR",
                details: "This usually means your Gemini API key has exceeded its quota or is not configured for these models."
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 429,
            });
        }

        let aiResponseContent = successfulResponse.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponseContent) {
            throw new Error("Empty response from AI");
        }

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
