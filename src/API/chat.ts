import { API_BASE_URL } from './BaseUrl'

// In your API file (aimodel.ts)
export const Ava = async (input: { message: string }): Promise<{ reply: string }> => {
  const response = await fetch(`${API_BASE_URL}/ai/ava`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer YOUR_API_KEY',
    },
    body: JSON.stringify({
      role: 'patient',
      message: input.message,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from Ava API');
  }

  const data = await response.json();
  console.log('Ava API response:', data);
  return data;
};