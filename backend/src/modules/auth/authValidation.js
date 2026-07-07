export const validateEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateRegisterInput = (data) => {
  const { email, password, firstName, lastName } = data;
  if (!email || !validateEmail(email)) {
    return { isValid: false, message: "Invalid or missing email address" };
  }
  if (!password || password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }
  if (!firstName || firstName.trim() === "") {
    return { isValid: false, message: "First name is required" };
  }
  if (!lastName || lastName.trim() === "") {
    return { isValid: false, message: "Last name is required" };
  }
  return { isValid: true };
};

export const validateLoginInput = (data) => {
  const { email, password } = data;
  if (!email || !validateEmail(email)) {
    return { isValid: false, message: "Invalid or missing email address" };
  }
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  return { isValid: true };
};
