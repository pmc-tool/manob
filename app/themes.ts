import { theme, ThemeConfig } from "antd";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    display: "swap",
});

const COLORS = {
    primary: "#ea2725",
    // fillTertiary: "#f3ecea",
    // fillTertiary: "#f1eceb",
    fillTertiary: "#f5f4f3",
    border: "#ebdcdc"
};

export const PMCTheme: ThemeConfig = {
    algorithm: theme.darkAlgorithm,

    token: {
        fontFamily: `${dmSans.style.fontFamily}`,
        colorPrimary: COLORS.primary,
        // Filled variant colors
        colorFillTertiary: COLORS.fillTertiary,
        colorBorder: COLORS.border,
        // Control heights
        controlHeightSM: 28,
        borderRadiusSM: 6,
    },
    components: {
        Button: {
            fontWeight: 600,
        },
    },
};
