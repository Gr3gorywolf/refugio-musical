import { getFacebookUserInfo } from "@/api/endpoints/facebookAuth";
import { FacebookAuth } from "@/types/FacebookAuth";
import { StorageFacebookInfo } from "@/types/StorageFacebookInfo";

export async function verifyFacebookToken(token: string) {
    const url = `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        picture: data.picture?.data?.url || null
    };
}


export const authWithFacebook = () => {
    return new Promise<StorageFacebookInfo>((resolve, reject) => {
        window.FB.login(
            (response) => {
                if (response.authResponse) {
                    const authRes: FacebookAuth = response.authResponse
                    getFacebookUserInfo(authRes.accessToken).then((userRes) => {
                        const storageUser: StorageFacebookInfo = {
                            user: userRes.data,
                            auth: authRes
                        }
                        resolve(storageUser);
                    }).catch(() => {
                        reject("Failed to get Facebook user info");
                    });



                    // Guarda token en estado, úsalo para enviar mensajes y autenticarte
                }
            },
            { scope: "public_profile,email" }
        );
    });
}