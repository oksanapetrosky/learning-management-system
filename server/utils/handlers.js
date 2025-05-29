// utils/handlers.js

// Extract user ID safely from auth object
export const getUserId = (req) => req.auth?.userId;

// Send a standard success response
export const sendSuccess = (res, data) => {
  res.json({ success: true, ...data });
};

// Send a standard error response
export const sendError = (res, message) => {
  res.json({ success: false, message });
};
