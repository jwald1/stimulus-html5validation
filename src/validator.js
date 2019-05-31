import ErrorMessage from "./error"
const debounce = require("lodash.debounce")

export default class {
  constructor(form, callback, debounceMs = 150) {
    this.form = form
    this.callback = callback
    this.debounceMs = debounceMs

    this.allFields().forEach(this.registerField)
  }

  destroy() {
    this.allFields().forEach(this.deregisterField)
  }

  registerField = el => {
    this.registerDergisterField(el, true)
  }

  deregisterField = el => {
    this.registerDergisterField(el, false)
  }

  // private

  inputNeedToWaitForVisited(type) {
    return ["text", "email", "password", "search", "tel", "url"].includes(type)
  }

  registerDergisterField(el, bool) {
    const action = bool ? "addEventListener" : "removeEventListener"

    if (el.dataset.noValidate) {
      return
    }

    if (el.nodeName === "INPUT" && this.inputNeedToWaitForVisited(el.type)) {
      el[action]("blur", this.validateOnBlur)
    }

    el[action]("input", debounce(this.validate, this.debounceMs))
    el[action]("invalid", this.validate)
  }

  validateOnBlur = e => {
    e.target.dataset.visited = true

    this.validate(e)
  }

  validate = e => {
    e.preventDefault()

    this.callback(e, {
      error: this.errorMessage(e.target),
      processedValidation: this.shouldValidate(e),
    })
  }

  errorMessage(el) {
    return new ErrorMessage(el).message()
  }

  shouldValidate(e) {
    const { target } = e

    if (
      target.nodeName === "INPUT" &&
      this.inputNeedToWaitForVisited(target.type) &&
      target.dataset.visited !== "true" &&
      e.type !== "invalid" &&
      !target.validity.valid
    ) {
      return false
    }

    return true
  }

  inputFields() {
    return Array.from(this.form.querySelectorAll("input")).filter(
      el => el.type !== "hidden" && el.type !== "submit"
    )
  }

  allFields() {
    return Array.from(this.form.querySelectorAll("select, textarea")).concat(
      this.inputFields()
    )
  }
}
