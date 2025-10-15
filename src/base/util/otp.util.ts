// utils/otp.ts

import * as crypto from 'crypto';

// Helper: ép về 6 chữ số (000000–999999)
const to6 = (n: number) => n.toString().padStart(6, '0');

/** 1) crypto.randomInt (mạnh, đơn giản) */
export function otp1() {
  return to6(crypto.randomInt(0, 1_000_000));
}

/** 2) randomBytes -> số 24-bit (mạnh) */
export function otp2() {
  const buf = crypto.randomBytes(3); // 24-bit
  const num = (buf[0] << 16) | (buf[1] << 8) | buf[2];
  return to6(num % 1_000_000);
}

/** 3) randomBytes(4) -> uint32 (mạnh) */
export function otp3() {
  const n = crypto.randomBytes(4).readUInt32BE(0);
  return to6(n % 1_000_000);
}

/** 4) WebCrypto (Node >= 19: globalThis.crypto) (mạnh) */
export function otp4() {
  const a = new Uint32Array(1);
  globalThis.crypto.getRandomValues(a);
  return to6(a[0] % 1_000_000);
}

/** 5) HMAC(time-based) với key bí mật (mạnh, gần TOTP nhưng tối giản) */
export function otp5(secret: Buffer | string = crypto.randomBytes(32)) {
  const step = 30; // giây
  const counter = Math.floor(Date.now() / 1000 / step);
  const h = crypto
    .createHmac('sha256', secret)
    .update(Buffer.from(counter.toString()))
    .digest();
  // Dynamic truncation kiểu HOTP/TOTP
  const offset = h[h.length - 1] & 0x0f;
  const bin =
    ((h[offset] & 0x7f) << 24) |
    ((h[offset + 1] & 0xff) << 16) |
    ((h[offset + 2] & 0xff) << 8) |
    (h[offset + 3] & 0xff);
  return to6(bin % 1_000_000);
}

/** 6) HMAC(counter) (mạnh, giống HOTP tối giản) */
export function otp6(
  secret: Buffer | string = crypto.randomBytes(32),
  counter = 1n,
) {
  const ctrBuf = Buffer.alloc(8);
  ctrBuf.writeBigUInt64BE(counter);
  const h = crypto.createHmac('sha256', secret).update(ctrBuf).digest();
  const offset = h[h.length - 1] & 0x0f;
  const bin =
    ((h[offset] & 0x7f) << 24) |
    ((h[offset + 1] & 0xff) << 16) |
    ((h[offset + 2] & 0xff) << 8) |
    (h[offset + 3] & 0xff);
  return to6(bin % 1_000_000);
}

/** 7) UUID v4 + hash (ổn nếu randomBytes bên dưới, nhưng dài dòng) */
export function otp7() {
  const id = crypto.randomUUID(); // dùng CSPRNG
  const h = crypto.createHash('sha256').update(id).digest();
  // Lấy 4 byte đầu thành uint32
  const n = h.readUInt32BE(0);
  return to6(n % 1_000_000);
}

/** 8) randomBytes -> BigInt (mạnh, minh hoạ khác) */
export function otp8() {
  const b = crypto.randomBytes(8);
  const n = b.readBigUInt64BE(0);
  return to6(Number(n % 1_000_000n));
}

/** 9) crypto.randomFillSync vào Buffer rồi đọc (mạnh) */
export function otp9() {
  const b = Buffer.alloc(4);
  crypto.randomFillSync(b);
  const n = b.readUInt32BE(0);
  return to6(n % 1_000_000);
}

/** 10) Math.random + time (KHÔNG khuyến nghị cho bảo mật) */
export function otp10() {
  const n = Math.floor((Math.random() * 1e9) ^ Date.now());
  return to6(Math.abs(n) % 1_000_000);
}

/** 11) Pseudorandom seed từ time & pid (KHÔNG khuyến nghị) */
export function otp11() {
  let seed = (Date.now() ^ process.pid) >>> 0;
  // xorshift32
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return to6(seed % 1_000_000);
}
