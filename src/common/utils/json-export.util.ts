/**
 * Utility functions for exporting data as JSON files.
 */

/**
 * Exports a JSON-serializable object to a downloadable file.
 * @param data - The data to export (will be JSON.stringify'd)
 * @param filename - The name of the file (without extension)
 */
export function exportJsonToFile<T>(data: T, filename: string): void {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
