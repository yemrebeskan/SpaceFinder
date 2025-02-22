import { randomUUID } from "crypto";
import { JSONError } from "./Validator";

export function createRandomId() {
  return randomUUID();
}

export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (error) {
    throw new JSONError((error as Error).message);
  }
}
