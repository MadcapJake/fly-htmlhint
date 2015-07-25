const htmlhint = require("htmlhint").HTMLHint
const clor = require("clor")
const assign = require("object-assign")
// const util = require("fly-util")

const fmt = assign(clor, {
  pos: clor.underline.cyan("%d:%d"),
  message: clor.bold.white("%s"),
  rule: clor.bold.blue("%s")
})

module.exports = function () {

  /*eslint-disable no-unused-vars*/
  this.pass = function (...args) {
    // TODO: needs stamp exported to work
    // util.stamp.apply({ method: "log", color: "green" }, args)
  }
  /*eslint-enable*/


  this.filter("htmlhint", (source, options) => {
    let counts = {
      errors: 0,
      warnings: 0
    }
    try {
      htmlhint.verify(source, options).forEach(function (msg) {
        if (msg.type === "error") {
          counts.errors++
          this.error(`HTMLHint: ${fmt.pos} ${fmt.message} ${fmt.rule}`,
            msg.line, msg.col,
            msg.message, msg.rule.id)
        }
        else if (msg.type === "warning") {
          counts.warnings++
          this.warn(`HTMLHint: ${fmt.pos} ${fmt.message} ${fmt.rule}`,
            msg.line, msg.col,
            msg.message, msg.rule.id)
        }
        else if (msg.type === "info") {
          this.debug(`HTMLHint: ${fmt.pos} ${fmt.message} ${fmt.rule}`,
            msg.line, msg.col,
            msg.message, msg.rule.id)
        }
      }.bind(this))
    } catch (e) { throw e }
    const total = counts.errors + counts.warnings
    // TODO: change `log` to `pass` once stamp PR is merged
    const success = total >= 1 ? "error" : "log"
    this[success](`HTMLHint: %s %d problem%s (%d error%s, %d warning%s)`,
      total >= 1 ? "✖" : "✓",
      total, total > 1 || total === 0 ? "s" : "",
      counts.errors, counts.errors > 1 || counts.errors === 0 ? "s" : "",
      counts.warnings, counts.warnings > 1 || counts.warnings === 0 ? "s" : ""
    )
    return source
  }, { ext: ".html" })
}
