import type { DocumentRecord } from '../types';

export const ACCEPTED_DOCUMENT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
export const MAX_DEMO_FILE_SIZE = 10 * 1024 * 1024;

export function validateDemoFile(file: File): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ACCEPTED_DOCUMENT_EXTENSIONS.includes(extension)) return 'Unsupported file type. Select PDF, JPG, JPEG or PNG.';
  if (file.size > MAX_DEMO_FILE_SIZE) return 'File exceeds the 10 MB demo limit.';
  return null;
}
export async function listDemoDocuments(items: DocumentRecord[]): Promise<DocumentRecord[]> {
  return Promise.resolve(items.map(item => ({ ...item })));
}
