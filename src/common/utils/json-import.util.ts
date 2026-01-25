/**
 * Utility functions for importing JSON files.
 */

/**
 * Reads a JSON file and parses it.
 * @param file - The file to read
 * @returns A promise that resolves to the parsed JSON data
 * @throws If the file cannot be read or parsed
 */
export function importJsonFromFile<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target?.result as string) as T;
        resolve(imported);
      } catch (error) {
        reject(new Error(`Failed to import config: Invalid JSON: ${error}`));
        console.error(error);
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
}
