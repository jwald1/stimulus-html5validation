const defaultMessages = {
  badInput: "is invalid",
  patternMismatch: "doesn't match %{pattern}",
  rangeOverflow: "must be less than %{max}",
  rangeUnderflow: "must be greater than %{min}",
  stepMismatch: "number is not divisible by %{step}",
  tooLong: "is too long (maximum is %{maxLength} characters)",
  tooShort: "is too short (minimum is %{minLength} characters)",
  typeMismatch: "is not a valid %{type}",
  valueMissing: "can't be blank",
}

const customMessageAttribute = {
  badInput: "is invalid",
  patternMismatch: "patternValidationMessage",
  rangeOverflow: "maxValidationMessage",
  rangeUnderflow: "minValidationMessage",
  stepMismatch: "stepValidationMessage",
  tooLong: "maxlengthValidationMessage",
  tooShort: "minlengthValidationMessage",
  typeMismatch: "typeValidationMessage",
  valueMissing: "requiredValidationMessage",
}

export default class {
  constructor(el) {
    this.el = el
    this.errorType = this.errorType()
  }

  message() {
    if (this.el.validity.valid) {
      return
    }

    return this.customMessage() || this.defaultMessage()
  }

  // private

  customMessage() {
    const dataAttribute = customMessageAttribute[this.errorType]

    return this.el.dataset[dataAttribute]
  }

  errorType() {
    const errorTypes = Object.keys(defaultMessages)
    for (let index = 0; index < errorTypes.length; index++) {
      if (this.el.validity[errorTypes[index]]) {
        return errorTypes[index]
      }
    }
  }

  defaultMessage() {
    const message = defaultMessages[this.errorType]

    return message.replace(/\%\{(.*)}/, (_, match) => {
      return this.el[match]
    })
  }
}
