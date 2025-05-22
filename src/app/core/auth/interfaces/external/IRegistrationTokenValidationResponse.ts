import { Error } from "./IUserRegisterResponse";

export interface RegistrationTokenValidationResponse {
    isValid:         boolean;
    phoneNumberEnds: string;
    errors:          Error[];
}

