import { Buffer } from 'buffer';

export function ArrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  return Buffer.from(arrayBuffer).toString('base64');
}

export function Base64ToArrayBuffer(base64: string): ArrayBuffer {
  return Buffer.from(base64, 'base64').buffer;
}
