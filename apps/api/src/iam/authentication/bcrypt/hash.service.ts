import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class HashService {
  /**
   * abstract method that will hash the passwords that come in
   * @param data a string to hash
   * @returns hashed data
   */
  abstract hash(data: string): Promise<string>

  /**
   * Get a plain data string and compare it with hashed string
   * @param plainData
   * @param hashedData
   * @returns If comparison matches or fails
   */

  abstract compare(plainData: string, hashedData: string): Promise<boolean>
}
