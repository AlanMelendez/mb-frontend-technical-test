import { Error } from "./IUserRegisterResponse";

export interface SetPasswordResponse {
    isValid: boolean;
    errors:  Error[];
}
