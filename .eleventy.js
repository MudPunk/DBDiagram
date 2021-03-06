module.exports = function(eleventyConfig) {

    // static passthroughs - remap to root
    eleventyConfig.addPassthroughCopy("assets/images");
    eleventyConfig.addPassthroughCopy("assets/scripts");
    eleventyConfig.addPassthroughCopy("assets/styles");

    //add filters
    eleventyConfig.addFilter("cssmin", require("./plugins/clean-css.js") );
    eleventyConfig.addFilter("findByName", (arr, findValue) => arr.find(a => a.name === findValue));
    eleventyConfig.addFilter("dateDisplay", require("./plugins/dates.js") );
    eleventyConfig.addFilter("contentTags", tags => tags.filter(t => !["post","draft"].includes(t)));
    eleventyConfig.addFilter("isPostType", tags => tags && tags.some(t => ["post","draft"].includes(t)));
    eleventyConfig.addFilter("jsmin", require("./plugins/clean-js.js") );
    eleventyConfig.addFilter("sortByPostCount", arr => arr.sort((a,b) => (a.posts.length < b.posts.length ? 1 : -1)));
    eleventyConfig.addFilter("take", (array, n) => array.slice(0,n));
    
    // custom collections
    let builder = require("./plugins/builder.js")
    eleventyConfig.addCollection("authors", col => builder(col, "author", "name", "summary", "authors", "./pages/authors/"));

    // bundle collection
    eleventyConfig.addCollection("bundles", col => {
        let script = col.getFilteredByGlob("**/meta/bundle-scripts.js.njk")[0]
        let style = col.getFilteredByGlob("**/meta/bundle-styles.css.njk")[0]
        return { script, style }
    });

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