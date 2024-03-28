const stylelintConfig = {
  extends: ["@asl-19/stylelint-config"],
  rules: {
    // This causes some false positives — might be able to re-enable once
    // Stylelint’s Emotion/CSS-in-JS support is improved
    "property-no-unknown": null,
  },
};

module.exports = stylelintConfig;
