/**
 * Device-local biometric unlock built on the real WebAuthn platform-authenticator
 * API (Windows Hello / Face ID / Touch ID / Android biometrics show the OS prompt).
 *
 * The Server backend has no WebAuthn endpoints, so there is no server-side
 * challenge/verification round trip — the credential only gates a JWT that was
 * cached on this device at enrollment time. It is a fast local re-auth for a
 * device the user already logged into normally, not passwordless server auth.
 */

const CREDENTIAL_ID_KEY = 'medix_biometric_credential_id';
const CACHED_TOKEN_KEY = 'medix_biometric_token';
const CACHED_EMAIL_KEY = 'medix_biometric_email';
const CACHED_NAME_KEY = 'medix_biometric_name';

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  bytes.forEach((b) => {
    str += String.fromCharCode(b);
  });
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const str = atob(padded);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes.buffer;
}

export async function isBiometricSupported(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export function isBiometricEnabled(): boolean {
  return !!localStorage.getItem(CREDENTIAL_ID_KEY);
}

export async function enableBiometric(params: { email: string; fullName: string; token: string }): Promise<void> {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: 'Medix Admin' },
      user: { id: userId, name: params.email, displayName: params.fullName },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
      timeout: 60000,
      attestation: 'none',
    },
  });

  const publicKeyCredential = credential as PublicKeyCredential | null;
  if (!publicKeyCredential) throw new Error('Could not create a Face ID credential');

  localStorage.setItem(CREDENTIAL_ID_KEY, bufferToBase64url(publicKeyCredential.rawId));
  localStorage.setItem(CACHED_TOKEN_KEY, params.token);
  localStorage.setItem(CACHED_EMAIL_KEY, params.email);
  localStorage.setItem(CACHED_NAME_KEY, params.fullName);
}

export function disableBiometric(): void {
  localStorage.removeItem(CREDENTIAL_ID_KEY);
  localStorage.removeItem(CACHED_TOKEN_KEY);
  localStorage.removeItem(CACHED_EMAIL_KEY);
  localStorage.removeItem(CACHED_NAME_KEY);
}

export function getBiometricProfile(): { email: string; fullName: string } | null {
  const email = localStorage.getItem(CACHED_EMAIL_KEY);
  const fullName = localStorage.getItem(CACHED_NAME_KEY);
  if (!email || !fullName) return null;
  return { email, fullName };
}

export async function authenticateWithBiometric(): Promise<string> {
  const credentialId = localStorage.getItem(CREDENTIAL_ID_KEY);
  const token = localStorage.getItem(CACHED_TOKEN_KEY);
  if (!credentialId || !token) throw new Error('Face ID is not set up on this device');

  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: [{ id: base64urlToBuffer(credentialId), type: 'public-key' }],
      userVerification: 'required',
      timeout: 60000,
    },
  });

  if (!assertion) throw new Error('Face ID authentication failed');
  return token;
}
