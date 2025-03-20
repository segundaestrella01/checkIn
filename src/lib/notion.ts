export async function isNotionConfigured(): Promise<boolean> {
  try {
    const response = await fetch('/api/notion/config');
    const data = await response.json();
    return data.isConfigured;
  } catch (error) {
    console.error('Error checking Notion configuration:', error);
    return false;
  }
}