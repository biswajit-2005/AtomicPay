import * as authService from "./authService.js";

export const register = async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName } = req.body;
    const result = await authService.register({ email, phone, password, firstName, lastName });
    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.logout(refreshToken);
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const result = await authService.verifyEmail(token);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
