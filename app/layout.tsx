import type { Metadata } from "next";
import "../styles/globals.css";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Radio Cabral",
    description: "La mejor música y entretenimiento en vivo",
    generator: "Next.js",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
                <Script async defer src="https://connect.facebook.net/en_US/sdk.js"></Script>
                <Script>
                    {` 
                    window.fbAsyncInit = function() {
                        FB.init({
                            appId      : ${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID},
                            cookie     : true,
                            xfbml      : true,
                            version    : 'v19.0'
                        });
                        };`}
                </Script>
            <body>{children}</body>
        </html>
    );
}
