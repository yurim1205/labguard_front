export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
  corePlugins: {
    preflight: true, // 기본값. false이면 예기치 않게 동작 가능
  }
}
