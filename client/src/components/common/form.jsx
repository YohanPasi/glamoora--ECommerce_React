import PropTypes from "prop-types";
import { Button } from "../ui/button";
import React, { useState } from "react";

// Helper function to evaluate password strength
function evaluatePasswordStrength(password) {
  if (!password) return "Weak";

  let strength = 0;

  // Check for character variety
  if (/[a-z]/.test(password)) strength++; // Lowercase
  if (/[A-Z]/.test(password)) strength++; // Uppercase
  if (/[0-9]/.test(password)) strength++; // Numbers
  if (/[@$!%*?&#^+=_-]/.test(password)) strength++; // Special characters

  // Determine strength level
  if (strength <= 1) return "Weak";
  if (strength === 2) return "Moderate";
  if (strength >= 3) return "Strong";
}

function validateForm(formData, formControls) {
  const errors = {};
  formControls.forEach((control) => {
    if (control.required && !formData[control.name]) {
      errors[control.name] = `${control.label} is required`;
    }
  });
  return errors;
}

function isFormValid(formData, formControls) {
  return formControls.every(
    (control) =>
      !control.required || (control.required && formData[control.name])
  );
}

function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText }) {
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");

  const isValid = isFormValid(formData, formControls);

  function handleInputChange(event) {
    const { name, value } = event.target;

    // Ensure password length is limited to 10
    if (name === "password" && value.length > 10) return;

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Evaluate password strength
    if (name === "password") {
      setPasswordStrength(evaluatePasswordStrength(value));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateForm(formData, formControls);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      onSubmit(event, formData); // Pass event and formData correctly
    }
  }

  function handleClearAll() {
    const clearedFormData = {};
    formControls.forEach((control) => {
      clearedFormData[control.name] = ""; // Clear all fields
    });
    setFormData(clearedFormData);
    setPasswordStrength(""); // Reset password strength
    setErrors({}); // Clear errors
  }

  function renderInputsByComponentType(controlItem) {
    const value = formData[controlItem.name] || "";

    let element = null;
    switch (controlItem.componentType) { // Fix ComponentType to componentType
      case "input":
        element = (
          <input
            className={`bg-white text-gray-900 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white ${
              errors[controlItem.name]
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            // maxLength={10} // Limit to 10 characters
            onChange={handleInputChange}
          />
        );
        break;

      case "select":
        element = (
          <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            name={controlItem.name}
            id={controlItem.name}
            value={value}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              {controlItem.placeholder}
            </option>
            {controlItem.options?.map((optionItem) => (
              <option key={optionItem.id} value={optionItem.id}>
                {optionItem.label}
              </option>
            ))}
          </select>
        );
        break;

      case "textarea":
        element = (
          <textarea
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            value={value}
            onChange={handleInputChange}
          />
        );
        break;

      default:
        element = (
          <input
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            onChange={handleInputChange}
          />
        );
        break;
    }

    return element;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg mx-auto"
    >
      <div className="flex flex-col gap-4">
        {formControls.map((controlItem) => (
          <div className="flex flex-col gap-1" key={controlItem.name}>
            <label
              className="text-gray-800 font-semibold"
              htmlFor={controlItem.name}
            >
              {controlItem.label}
            </label>
            {renderInputsByComponentType(controlItem)}
            {controlItem.name === "password" &&
              formData["password"] && ( // Show only when the password field is not empty
                <>
                  <p className="text-gray-500 text-sm">
                    {formData["password"].length} / 10 characters
                  </p>
                  <p
                    className={`text-sm ${
                      passwordStrength === "Weak"
                        ? "text-red-500"
                        : passwordStrength === "Moderate"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    Password strength: {passwordStrength}
                  </p>
                </>
              )}
            {errors[controlItem.name] && (
              <p className="text-red-500 text-sm">{errors[controlItem.name]}</p>
            )}
          </div>
        ))}
      </div>
      <Button
        type="submit"
        disabled={!isValid}
        className={`mt-6 w-full py-3 rounded-lg transition duration-300 ${
          !isValid
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-500"
        }`}
      >
        {buttonText}
      </Button>
      <Button
        type="button"
        onClick={handleClearAll}
        className="mt-3 w-full py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200"
      >
        Clear All
      </Button>
    </form>
  );
}

CommonForm.propTypes = {
  formControls: PropTypes.array.isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default CommonForm;
