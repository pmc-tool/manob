export function validateBillingAddress(billingAddress) {
  const requiredFields = [
      "id",
      "first_name",
      "last_name",
      "address_one",
      "city",
      "country",
      "zip_code",
      "email", 
  ];

  // Check if all required fields are present and not empty
  for (const field of requiredFields) {
      if (!billingAddress[field]) {
          return false; // Validation fails
      }
  }

  // Optional field check for notes (no validation if not provided)
  // if (billingAddress.notes && typeof billingAddress.notes !== "string") {
  //     return false; // Validation fails if notes is not a string
  // }

  return true; // Validation passes
}