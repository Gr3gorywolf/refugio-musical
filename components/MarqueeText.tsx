import { FC } from "react";
import classnames from "classnames";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface props {
    className?: string;
    children: React.ReactNode;
    mdTextSize?: number;
    smTextSize?: number;
    width: number;
}

export const MarqueeText: FC<props> = ({ mdTextSize = 87, smTextSize = 60, children, className, width }) => {
    const isTablet = useMediaQuery({ lessThan: 768, moreThan: 640 });
    const isMobile = useMediaQuery({ lessThan: 640 });
     const textContent = typeof children === "string" ? children : "";
    const mdTextSizeExeed = textContent.length > mdTextSize && isTablet;
    const smTextSizeExeed = textContent.length > smTextSize && isMobile;
    const hasMarquee = mdTextSizeExeed || smTextSizeExeed;
    return (
        <span
            style={{
                width: hasMarquee ? width + "px" : undefined,
            }}
            className={classnames(className, {
                "whitespace-nowrap": hasMarquee,
                "animate-marquee-fast": hasMarquee,
            })}
        >
            {children}
        </span>
    );
};
