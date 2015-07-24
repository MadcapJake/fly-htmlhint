"use strict";

var _Object$assign = require("babel-runtime/core-js/object/assign")["default"];

var htmlhint = require("htmlhint").HTMLHint;
var clor = require("clor");

var fmt = _Object$assign(clor, {
  line: clor.bold.blue("%s"),
  col: clor.bold.green("%s"),
  error: clor.bold.red("%s"),
  warn: clor.bold.orange("%s"),
  debug: clor.bold.yellow("%s"),
  rule: clor.underline.cyan("%s")
});

module.exports = function () {
  var _this = this;

  this.filter("htmlhint", function (source, options) {
    var counts = {
      errors: 0,
      warnings: 0
    };
    try {
      htmlhint.verify(source, options).forEach((function (msg) {
        if (msg.type === "error") {
          counts.errors++;
          this.error("HTMLHint: " + fmt.line + ":" + fmt.col + " " + fmt.error + " " + fmt.rule, msg.line, msg.col, msg.message, msg.rule.id);
        } else if (msg.type === "warning") {
          counts.warnings++;
          this.warn("HTMLHint: " + fmt.line + ":" + fmt.col + " " + fmt.warn + " " + fmt.rule, msg.line, msg.col, msg.message, msg.rule.id);
        } else if (msg.type === "info") {
          this.debug("HTMLHint: " + fmt.line + ":" + fmt.col + " " + fmt.debug + " " + fmt.rule, msg.line, msg.col, msg.message, msg.rule.id);
        }
      }).bind(_this));
    } catch (e) {
      throw e;
    }
    if (counts.errors + counts.warnings >= 1) {
      var total = counts.errors + counts.warnings;
      _this.error("✖ %d problem%s (%d error, %d warnings)", total, total > 1 ? "s" : "", counts.errors, counts.warnings);
    }
    return source;
  }, { ext: ".html" });
};