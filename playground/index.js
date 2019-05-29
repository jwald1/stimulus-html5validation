import { Application } from "stimulus"
import Html5ValidationController from "../src/index"

class ValidationController extends Html5ValidationController {
  display({ el, error }) {
    const errorField = el.closest(".field").querySelector(".error")

    if (error) {
      errorField.textContent = error
    } else {
      errorField.textContent = ""
    }
  }
}

const application = Application.start()
application.register("validation", ValidationController)
