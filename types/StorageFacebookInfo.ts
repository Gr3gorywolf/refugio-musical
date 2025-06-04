import { FacebookAuth } from "./FacebookAuth";
import { FacebookUser } from "./FacebookUser";

export interface StorageFacebookInfo {
    user: FacebookUser;
    auth: FacebookAuth;
}