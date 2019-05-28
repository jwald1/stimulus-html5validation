import ErrorMessage from "./error"

export default class {
  constructor(form, callback) {
    this.form = form
    this.callback = callback

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

  registerDergisterField(el, bool) {
    const action = bool ? "addEventListener" : "removeEventListener"

    if (el.dataset.noValidate) {
      return
    }

    if (el.nodeName === "INPUT") {
      el[action]("blur", this.validateOnBlur)
    }

    el[action]("input", this.validate)
    el[action]("invalid", this.validate)
  }

  validateOnBlur = e => {
    e.currentTarget.dataset.visited = true

    this.validate(e)
  }

  validate = e => {
    e.preventDefault()

    this.callback(e, {
      error: this.errorMessage(e.currentTarget),
      shouldDisplay: this.shouldValidate(e),
    })
  }

  errorMessage(el) {
    return new ErrorMessage(el).message()
  }

  shouldValidate(e) {
    const { currentTarget } = e

    if (
      currentTarget.nodeName === "INPUT" &&
      currentTarget.dataset.visited !== "true" &&
      e.type !== "invalid" &&
      !currentTarget.validity.valid
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
