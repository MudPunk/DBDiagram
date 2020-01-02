module.exports = function(eleventyConfig) {
    return {
        dir: {
            "data": "data",
            includes: "assets",
            layouts: "layouts"
        },

        // By default markdown files are pre-processing with liquid template engine
        // https://www.11ty.io/docs/config/#default-template-engine-for-markdown-files
        markdownTemplateEngine: "njk",
    };
};