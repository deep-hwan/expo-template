// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 절대 경로 설정 추가
config.resolver.sourceExts = ["jsx", "js", "ts", "tsx", "cjs", "json"];
config.resolver.assetExts = ["png", "jpg", "jpeg", "gif", "svg", "webp"];

module.exports = config;
