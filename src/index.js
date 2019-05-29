import { Controller } from "stimulus"
import Validator from "./validator"

export default class extends Controller {
  static targets = ["submitButton"]

  connect() {
    this.toggleDisableOnSubmitButton(true)
    this.submitButtonTarget.addEventListener("click", this.removeNoValidate)
    this.validator = new Validator(
      this.form,
      this.validationCallback,
      this.data.get("debounce")
    )
  }

  disconnect() {
    this.submitButtonTarget.removeEventListener("click", this.removeNoValidate)
    this.validator.destroy()
  }

  get form() {
    if (this.element.nodeName === "FORM") {
      return this.element
    } else {
      return this.element.querySelector("form")
    }
  }

  isValid() {
    this.data.set("noValidate", true)
    return this.form.checkValidity()
  }

  registerField = el => this.validator.registerField(el)
  deregisterField = el => this.validator.deregisterField(el)

  display(object) {
    // overwrite
  }

  // private

  removeNoValidate = () => {
    this.data.delete("noValidate")
  }

  focusFirstInput(e) {
    if (this.data.get("focusOnError") === "false" || e.type !== "invalid") {
      return
    }

    const firstInputSelector = [
      "text",
      "email",
      "password",
      "search",
      "tel",
      "url",
    ].map(type => `input[type="${type}"]:invalid`)

    this.form.querySelector(firstInputSelector.join(",")).focus()
  }

  toggleDisableOnSubmitButton(error) {
    if (this.data.get("disableSubmit") === "false") {
      return
    }

    if (error) {
      this.submitButtonTarget.disabled = true
    } else if (this.isValid()) {
      this.submitButtonTarget.disabled = false
    }
  }

  validationCallback = (event, { error, shouldDisplay }) => {
    if (event.type === "invalid" && this.data.has("noValidate")) {
      return
    }

    this.focusFirstInput(event)
    this.toggleDisableOnSubmitButton(error)

    if (shouldDisplay) {
      this.display({ el: event.target, error })
    }
  }
}
