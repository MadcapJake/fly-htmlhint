const HTMLHint = require("htmlhint").HTMLHint

module.exports = function () {
  this.filter("htmlhint", (source, options) => {
    try {
      const messages = HTMLHint(source, options)
      console.log(messages)
      return source
     } catch (e) { throw e }
  }, { ext: ".html" })
}
