// API configuration - update this to match your backend
export const API_BASE_URL = "https://impostergame-adcjgcafg3b0hpct.germanywestcentral-01.azurewebsites.net"; // Change this to your actual API URL

export async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
