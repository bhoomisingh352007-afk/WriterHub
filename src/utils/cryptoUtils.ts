import { DRMConfig } from "../types";

/**
 * Encrypts raw text into a simulated AES-256 ciphertext representation
 */
export function simulateEncryptContent(plainText: string, keyHash: string): string {
  const header = `[AES-256-GCM-ENCRYPTED::HASH_${keyHash.slice(0, 8)}]`;
  // Simple Base64 + Scramble to look like true ciphertext in inspect view
  const encoded = btoa(encodeURIComponent(plainText.slice(0, 1500)));
  const chunkedCipher = encoded.match(/.{1,64}/g)?.join("\n") || encoded;
  return `${header}\n${chunkedCipher}\n[END-CIPHERTEXT-BLOCK]`;
}

/**
 * Generates a SHA-256 style hex string for DRM fingerprinting
 */
export function generateSHA256Hash(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `0x${hex}7f8e9a2b4c1d6e3f5a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d`.slice(0, 32);
}

/**
 * Generates dynamic dynamic DRM watermark overlay lines for secure reader
 */
export function generateWatermarkLines(
  publisherName: string,
  publisherCompany: string,
  customWatermarkText: string,
  userIp: string = "192.168.1.104"
): string {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  return `${customWatermarkText || "RESTRICTED PREVIEW"} • ${publisherName} (${publisherCompany}) • IP: ${userIp} • ${timestamp} • DO NOT COPY OR DISTRIBUTE`;
}

/**
 * Format currency in Indian Rupees or USD
 */
export function formatCurrency(amount: number, currency: "INR" | "USD" = "INR"): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
