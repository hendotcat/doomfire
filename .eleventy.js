const chokidar = require("chokidar")
const fs = require("fs-extra")
const htmlmin = require("html-minifier")
const sass = require("sass")
const version = require("./_data/version")

function compile() {
  const target = `_site/doomfire-${version}.css`
  const hrstart = process.hrtime()
  const result = sass.renderSync({ file: "doomfire.scss" })
  const hrend = process.hrtime()
  console.log(`✨ doomfire.css ${Math.floor(hrend[1] / 1000000)}ms`)
  fs.ensureDirSync("_site")
  fs.writeFileSync(target, result.css)
}

function monkeypatch(cls, fn) {
  const orig = cls.prototype[fn.name][`_PS_original`] || cls.prototype[fn.name]
  function wrapped() {
    return fn.bind(this, orig).apply(this, arguments)
  }
  wrapped[`_PS_original`] = orig
  cls.prototype[fn.name] = wrapped
}

module.exports = function(eleventyConfig) {
  compile()

  setImmediate(function() {
    let initialized = false
    const Eleventy = require("@11ty/eleventy/src/Eleventy.js")
    if (Eleventy.prototype) {
      function watch(original) {
        if (!initialized) {
          const watcher = chokidar.watch(["doomfire.scss"], {
            persistent: true
          })
          const compileAndReload = eleventyInstance => () => {
            compile()
            this.eleventyServe.reload()
          }
          watcher.on("add", compileAndReload(this))
          watcher.on("change", compileAndReload(this))
          initialized = true
        }
        return original.apply(this)
      }
      monkeypatch(Eleventy, watch)
    }
  })

  eleventyConfig.addPassthroughCopy("images")
  eleventyConfig.addPassthroughCopy("videos")

  eleventyConfig.addTransform(
    "htmlmin",
    function(content, outputPath) {
      if (outputPath && outputPath.endsWith(".html")) {
        return htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true
        })
      }
      return content
    }
  )
}

