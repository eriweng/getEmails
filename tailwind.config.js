// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts}"],
  theme: {
    // 自訂三段尺寸（使用 raw，讓每段是「區間」而非最小寬）
    screens: {
      s: { raw: "(min-width:320px) and (max-width:685px)" }, // 320–685
      m: { raw: "(min-width:686px) and (max-width:1024px)" }, // 686–1024
      l: { raw: "(min-width:1025px) and (max-width:1440px)" }, // 1025–1440
      // 有需要可額外補一個超過 1512 的 max-free 區段：
    },

    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },

      // 常用品牌色／功能色（可依需求調整）
      colors: {
        brand: {
          DEFAULT: "#006FEF",
          50: "#EEF4FF",
          100: "#DBE7FF",
          200: "#B7CFFF",
          300: "#93B7FF",
          400: "#6F9FFF",
          500: "#4B88FF",
          600: "#1E63FF",
          700: "#174BBD",
          800: "#10347E",
          900: "#0A224F",
        },
        accent: {
          DEFAULT: "#00C2A8",
          600: "#00A892",
          700: "#008F7D",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#06B6D4",
        muted: "#6B7280", // gray-500
        ink: "#111827", // gray-900
        bg: "#0B0C0F",
      },

      // 文字尺寸：提供 10px 起跳與 14px base 的語義別名
      // 注意：實際 rem 轉換取決於 :root font-size（我們會設為 14px）
      fontSize: {
        // 快捷別名：10/12/14/16/18/20/24/28/32
        xxs: ["0.714rem", { lineHeight: "1.2" }], // ≈10px
        xs: ["0.857rem", { lineHeight: "1.3" }], // ≈12px
        base14: ["1rem", { lineHeight: "1.5" }], // 14px
        sm14: ["0.928rem", { lineHeight: "1.45" }], // 13px(給細字)
        sm: ["1.143rem", { lineHeight: "1.5" }], // ≈16px
        md: ["1.286rem", { lineHeight: "1.5" }], // ≈18px
        lg: ["1.429rem", { lineHeight: "1.45" }], // ≈20px
        xl: ["1.714rem", { lineHeight: "1.35" }], // ≈24px
        "2xl": ["2rem", { lineHeight: "1.25" }], // 32px
        "3xl": ["2.286rem", { lineHeight: "1.25" }], // ≈36px
      },

      borderRadius: {
        xl2: "1rem",
        xl3: "1.25rem",
      },

      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.08)",
        card: "0 12px 28px rgba(0,0,0,0.10)",
      },

      // Container 可選
      container: {
        center: true,
        padding: "0",
        screens: {
          s: "100%", // 320–685
          m: "1024px", // 686–1024
          l: "1440px", // 1025–1440
        },
      },
    },
  },
  plugins: [
    // 可選：表單/排版套件
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
