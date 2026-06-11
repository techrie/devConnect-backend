const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;

//React component for reset password

// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// function ResetPassword() {
//   const { token } = useParams();

//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     await axios.post(`http://localhost:7777/auth/reset-password/${token}`, {
//       newPassword: password,
//     });

//     alert("Password reset successful");
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="New Password"
//       />

//       <button type="submit">Reset Password</button>
//     </form>
//   );
// }

// export default ResetPassword;
