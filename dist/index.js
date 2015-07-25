"use strict";

var htmlhint = require("htmlhint").HTMLHint;
var clor = require("clor");
var assign = require("object-assign");
// const util = require("fly-util")

var fmt = assign(clor, {
  pos: clor.underline.cyan("%d:%d"),
  message: clor.bold.white("%s"),
  rule: clor.bold.blue("%s")
});

module.exports = function () {
  var _this = this;

  /*eslint-disable no-unused-vars*/
  this.pass = function () {}
  // TODO: needs stamp exported to work
  // util.stamp.apply({ method: "log", color: "green" }, args)

  /*eslint-enable*/

  ;this.filter("htmlhint", function (source, options) {
    var counts = {
      errors: 0,
      warnings: 0
    };
    try {
      htmlhint.verify(source, options).forEach((function (msg) {
        if (msg.type === "error") {
          counts.errors++;
          this.error("HTMLHint: " + fmt.pos + " " + fmt.message + " " + fmt.rule, msg.line, msg.col, msg.message, msg.rule.id);
        } else if (msg.type === "warning") {
          counts.warnings++;
          this.warn("HTMLHint: " + fmt.pos + " " + fmt.message + " " + fmt.rule, msg.line, msg.col, msg.message, msg.rule.id);
        } else if (msg.type === "info") {
          this.debug("HTMLHint: " + fmt.pos + " " + fmt.message + " " + fmt.rule, msg.line, msg.col, msg.message, msg.rule.id);
        }
      }).bind(_this));
    } catch (e) {
      throw e;
    }
    var total = counts.errors + counts.warnings;
    // TODO: change `log` to `pass` once stamp PR is merged
    var success = total >= 1 ? "error" : "log";
    _this[success]("HTMLHint: %s %d problem%s (%d error%s, %d warning%s)", total >= 1 ? "✖" : "✓", total, total > 1 || total === 0 ? "s" : "", counts.errors, counts.errors > 1 || counts.errors === 0 ? "s" : "", counts.warnings, counts.warnings > 1 || counts.warnings === 0 ? "s" : "");
    return source;
  }, { ext: ".html" });
};