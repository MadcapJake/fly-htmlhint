const htmlhint = require("htmlhint").HTMLHint
const clor = require("clor")
const assign = require("object-assign")

const fmt = assign(clor, {
  line: clor.bold.blue("%d"),
  col: clor.bold.green("%d"),
  error: clor.bold.red("%s"),
  warn: clor.bold.yellow("%s"),
  debug: clor.bold.white("%s"),
  rule: clor.underline.cyan("%s")
})

module.exports = function () {
  this.filter("htmlhint", (source, options) => {
    let counts = {
      errors: 0,
      warnings: 0
    }
    try {
      htmlhint.verify(source, options).forEach(function (msg) {
        if (msg.type === "error") {
          counts.errors++
          this.error(`${fmt.line} : ${fmt.col} ${fmt.error} ${fmt.rule}`,
            msg.line, msg.col, msg.message, msg.rule.id)
        }
        else if (msg.type === "warning") {
          counts.warnings++
          this.warn(`${fmt.line} : ${fmt.col} ${fmt.warn} ${fmt.rule}`,
            msg.line, msg.col, msg.message, msg.rule.id)
        }
        else if (msg.type === "info") {
          this.debug(`${fmt.line} : ${fmt.col} ${fmt.debug} ${fmt.rule}`,
            msg.line, msg.col, msg.message, msg.rule.id)
        }
      }.bind(this))
    } catch (e) { throw e }
    const total = counts.errors + counts.warnings
    this.error(`%s %d problem%s (%d error%s, %d warning%s)`,
      total >= 1 ? "✖" : "✓",
      total, total > 1 || total === 0 ? "s" : "",
      counts.errors, counts.errors > 1 || counts.errors === 0 ? "s" : "",
      counts.warnings, counts.warnings > 1 || counts.warnings === 0 ? "s" : ""
    )
    return source
  }, { ext: ".html" })
}
