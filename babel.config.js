module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          extensions: [
            ".ios.ts",
            ".android.ts",
            ".ts",
            ".ios.tsx",
            ".android.tsx",
            ".tsx",
            ".jsx",
            ".js",
            ".json",
            ".ios.js",
            ".android.js",
            ".js",
            ".ts",
            ".tsx",
            ".json",
          ],
          alias: {
            "@": ".",
            "@app": "./app",
            "@components": "./app/src/components",
            "@hooks": "./app/src/hooks",
            "@assets": "./assets",
            "@widgets": "./app/src/@widgets",
            "@ui": "./app/src/@ui",
            "@utils": "./app/src/@utils",
            "@theme": "./app/src/@theme",
            "@contexts": "./app/src/@contexts",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
