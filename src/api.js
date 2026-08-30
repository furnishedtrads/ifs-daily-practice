export async function callClaude(messages, systemPrompt, maxTokens = 800) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_KEY;

  if (!apiKey || apiKey === 'placeholder') {
    throw new Error('API key not configured. Add VITE_ANTHROPIC_KEY to your .env file.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  return data.content?.find(b => b.type === 'text')?.text || '';
}
