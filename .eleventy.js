module.exports = function(eleventyConfig) {

    // static passthroughs - remap to root
    eleventyConfig.addPassthroughCopy("assets/images");

    //add filters
    eleventyConfig.addFilter("findByName", (arr, findValue) => arr.find(a => a.name === findValue));
    eleventyConfig.addFilter("dateDisplay", require("./plugins/dates.js") );
    eleventyConfig.addFilter("contentTags", tags => tags.filter(t => !["post","draft"].includes(t)));
    
    // custom collections
    let builder = require("./plugins/builder.js")
    eleventyConfig.addCollection("authors", col => builder(col, "author", "name", "summary", "authors", "./authors/"));

    // configure syntax highlighting
    let md = require("./plugins/customize-markdown.js")()
    eleventyConfig.setLibrary("md", md);

    eleventyConfig.addPairedShortcode("markdown", (content, inline = null) => {
        return inline
          ? md.renderInline(content)
          : md.render(content);
      });

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