import {HexString, Types} from "aptos";
import pako from "pako";

/**
 * Helper function for exhaustiveness checks.
 *
 * Hint: If this function is causing a type error, check to make sure that your
 * switch statement covers all cases!
 */
export function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

/*
If the transaction doesn't have a version property, 
that means it's a pending transaction (and thus it's expected version will be higher than any existing versions). 
We can consider the version to be Infinity for this case.
*/
export function sortTransactions(
  a: Types.Transaction,
  b: Types.Transaction,
): number {
  const first = "version" in a ? parseInt(a.version) : Infinity;
  const second = "version" in b ? parseInt(b.version) : Infinity;
  return first < second ? 1 : -1;
}

/*
Converts a utf8 string encoded as hex back to string
if hex starts with 0x - ignore this part and start from the 3rd char (at index 2).
*/
export function hex_to_string(hex: string): string {
  const hexString = hex.toString();
  let str = "";
  let n = hex.startsWith("0x") ? 2 : 0;
  for (n; n < hexString.length; n += 2) {
    str += String.fromCharCode(parseInt(hexString.substring(n, n + 2), 16));
  }
  return str;
}

/* set localStorage with Expiry */
export function setLocalStorageWithExpiry(
  key: string,
  value: string,
  ttl: number,
) {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

/* get localStorage with Expiry */
export function getLocalStorageWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}

export async function fetchJsonResponse(url: string) {
  const response = await fetch(url);
  return await response.json();
}

/**
 * Convert a module source code in gzipped hex string to plain text
 * @param source module source code in gzipped hex string
 * @returns original source code in plain text
 */
export function transformCode(source: string): string {
  return pako.ungzip(new HexString(source).toUint8Array(), {to: "string"});
}

export function getBytecodeSizeInKB(bytecodeHex: string): number {
  // Convert the hex string to a byte array
  const textEncoder = new TextEncoder();
  const byteArray = new Uint8Array(textEncoder.encode(bytecodeHex));

  // Compute the size of the byte array in kilobytes (KB)
  const sizeInKB = byteArray.length / 1024;

  // Return the size in KB with two decimal places
  return parseFloat(sizeInKB.toFixed(2));
}
