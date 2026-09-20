import * as argon2 from 'argon2';

export class OtpUtil {
  /**
   * Generate numeric OTP
   */
  static generate(length = 6): string {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return otp;
  }

  /**
   * Hash OTP using Argon2
   */
  static async hash(
    otp: string,
    pepper = '',
  ): Promise<string> {
    return argon2.hash(otp + pepper, {
      type: argon2.argon2id,
      memoryCost: 2 ** 14, // 16 MB (OTP optimized)
      timeCost: 2,
      parallelism: 1,
    });
  }

  /**
   * Verify OTP
   */
  static async verify(
    plainOtp: string,
    hashedOtp: string,
    pepper = '',
  ): Promise<boolean> {
    try {
      return await argon2.verify(
        hashedOtp,
        plainOtp + pepper,
      );
    } catch {
      return false;
    }
  }
}
