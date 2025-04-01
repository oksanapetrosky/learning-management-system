import { clerkClient } from "@clerk/express";

// Middleware ( Protect Educator Routes )
export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const response = await clerkClient.users.getUser(userId);
    if (response.publicMetadata.role !== "educator") {
      return res.json({ success: false, message: "Unauthorized Access" });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// Middleware: Protect any logged-in user route
export const protectRoute = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const response = await clerkClient.users.getUser(userId);

    req.user = {
      _id: userId,
      email: response.emailAddresses[0].emailAddress,
      fullName: response.firstName + " " + response.lastName,
      imageUrl: response.imageUrl,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized access" });
  }
};
