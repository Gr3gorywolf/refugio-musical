import { FacebookUser } from "@/types/FacebookUser";
import axios from "axios";

export const getFacebookUserInfo = async (accessToken: string) => {
    const url = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`;
    return axios.get<FacebookUser>(url)
}