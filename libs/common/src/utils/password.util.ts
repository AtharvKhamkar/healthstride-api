import * as argon2 from "argon2";

export class PasswordUtil {

    static async hash(password: string, pepper: string): Promise<string> {

        return argon2.hash(password + pepper);
    }

    static async verify(
        hash: string,
        password: string,
        pepper: string
    ): Promise<boolean> {

        return argon2.verify(hash, password + pepper);
    }
}