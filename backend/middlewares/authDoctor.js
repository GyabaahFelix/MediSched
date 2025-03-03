import jwt from "jsonwebtoken";

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in again." });
    }

    // Verify the dtoken
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

    // Attach the user ID from the token to the request object
    req.body.docId = token_decode.id;  

    // Optional: Check if the user is an admin (for admin routes)
    if (token_decode.email === process.env.ADMIN_EMAIL) {
      req.body.isAdmin = true; // Add an admin flag if necessary
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
};

export default authDoctor;
