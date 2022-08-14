import { Buffer } from 'buffer';

function base64UrlToBase64(base64Url: string): string {
  return base64Url.replace(/\-/g, '+').replace(/_/g, '/');
}

function base64ToBase64Url(base64: string): string {
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function ArrayBufferToBase64Url(arrayBuffer: ArrayBuffer): string {
  return base64ToBase64Url(Buffer.from(arrayBuffer).toString('base64'));
}

export function Base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
  return Buffer.from(base64UrlToBase64(base64Url), 'base64').buffer;
}
