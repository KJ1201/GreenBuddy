export async function fetchGeminiPricing(prompt: string) {
    const keys = [
        import.meta.env.VITE_GEMINI_API_KEY
    ].filter((k): k is string => !!k); // Filter out undefined keys

    let lastError: any;

    for (const apiKey of keys) {
        try {
            console.log(`Attempting Gemini API with key ending in ...${apiKey.slice(-4)}`);
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        response_mime_type: "application/json",
                        temperature: 0.7
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.warn(`Gemini API error with key ...${apiKey.slice(-4)}:`, response.status, errorData);
                throw new Error(`API Error ${response.status}: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error('No content returned from Gemini');
            }

            // Clean markdown JSON if present
            const cleanJson = text.replace(/```json\n?/, '').replace(/\n?```/, '').trim();
            return JSON.parse(cleanJson);

        } catch (err) {
            console.error(`Gemini attempt failed with key ...${apiKey.slice(-4)}:`, err);
            lastError = err;
        }
    }

    throw lastError || new Error('All Gemini API keys failed');
}

export async function verifyComponentWithGemini(
    image: string, // base64
    deviceName: string,
    expectedComponentName: string,
    mimeType: string = "image/jpeg"
) {
    const prompt = `You are a HOSTILE, STRICT AUDITOR for an electronics recycling facility. 
Your job is to REJECT images that do not clearly show the specific component.

Context:
- Expected Component: "${expectedComponentName}"
- Source Device: "${deviceName}"

INSTRUCTIONS:
1. First, identify the MAIN SUBJECT of the image (e.g., "A person's face", "A cat", "A ceiling fan", "A circuit board").
2. If the main subject is a PERSON, SELFIE, ANIMAL, or FURNITURE -> REJECT IMMEDIATELY.
3. If the image is blurry, dark, or vague -> REJECT IMMEDIATELY.
4. Compare the identified subject to the visual traits of a "${expectedComponentName}".
   - A "${expectedComponentName}" looks like: (Draw upon your knowledge of electronic parts).
   - If the image shows a generic circuit board but the expected part is a "Power Supply" (bulky capacitors, transformers), and you don't see those -> REJECT.

You must be 95% confident to return "verified". When in doubt, return "mismatch".

Return JSON:
{
  "detected_objects": ["list", "of", "visible", "items"],
  "status": "verified" | "mismatch",
  "condition": "Mint" | "Good" | "Fair" | "Poor",
  "confidence": number (0.0 to 1.0),
  "reasoning": "I see [detected_objects]. This does not match the expected [component] because..."
}`;

    const keys = [
        import.meta.env.VITE_GEMINI_API_KEY
    ].filter((k): k is string => !!k);

    let lastError: any;

    for (const apiKey of keys) {
        try {
            console.log(`[Gemini] Attempting Vision API with key ...${apiKey.slice(-4)}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
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
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log(`[Gemini] Response status: ${response.status}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.warn(`[Gemini] API error with key ...${apiKey.slice(-4)}:`, response.status, errorData);
                throw new Error(`API Error ${response.status}: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('[Gemini] JSON parsed, extracting text...');
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error('No content returned from Gemini');
            }

            const cleanJson = text.replace(/```json\n?/, '').replace(/\n?```/, '').trim();
            console.log('[Gemini] Verification Result:', cleanJson);
            return JSON.parse(cleanJson);

        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.error(`[Gemini] Request timed out for key ...${apiKey.slice(-4)}`);
            } else {
                console.error(`[Gemini] Verification failed with key ...${apiKey.slice(-4)}:`, err);
            }
            lastError = err;
        }
    }

    throw lastError || new Error('All Gemini API keys failed for verification');
}

export async function estimateWasteDiverted(
    components: { name: string, device: string }[]
) {
    if (components.length === 0) return 0;

    const itemsList = components.map(c => `- ${c.name} from a ${c.device}`).join('\n');
    const prompt = `You are a sustainability expert for an electronics recycling project.
Calculate the total weight (in kilograms) of the following electronic parts that have been saved from a landfill.

Dismantled Components:
${itemsList}

INSTRUCTIONS:
1. Estimate the standard weight for each listed component based on the device type.
2. Sum them up to get the total weight diverted.
3. Be realistic (e.g., a laptop battery is ~0.3kg, a screen assembly ~0.5kg, a motherboard ~0.2kg).
4. Return ONLY a JSON object with the total and a brief breakdown.

Return JSON:
{
  "total_kg": number,
  "breakdown": "A short summary of what was calculated"
}`;

    try {
        const result = await fetchGeminiPricing(prompt);
        return result.total_kg || 0;
    } catch (err) {
        console.error('Waste estimation failed:', err);
        return 0;
    }
}
