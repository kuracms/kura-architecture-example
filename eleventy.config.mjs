export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ public: "/" });

  // Render simple markdown-ish text from the kura `body` field.
  // We keep this deliberately minimal: paragraphs split on blank lines,
  // **bold** runs, and *italic*. Anything fancier (lists, headings) isn't
  // used by the seeded content for this demo.
  eleventyConfig.addFilter("renderBody", (text) => {
    if (!text) return "";
    const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const inline = (s) =>
      escapeHtml(s)
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
    const paragraphs = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    return paragraphs.map((p) => `<p>${inline(p).replace(/\n/g, "<br>")}</p>`).join("\n");
  });

  eleventyConfig.addFilter("pageBySlug", (pages, slug) => {
    if (!pages) return null;
    return pages.find((p) => p.slug === slug) || null;
  });

  eleventyConfig.addFilter("recentProjects", (projects, n) => {
    if (!projects) return [];
    return [...projects].sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, n);
  });

  eleventyConfig.addFilter("bySortOrder", (projects) => {
    if (!projects) return [];
    return [...projects].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  });

  eleventyConfig.addFilter("typologyLabel", (t) => {
    const labels = {
      house: "House",
      extension: "Extension",
      interior: "Interior",
      public: "Public",
      commercial: "Commercial",
    };
    return labels[t] || t;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "../_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
