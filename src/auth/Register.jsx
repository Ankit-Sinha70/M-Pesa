/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const roles = [
  "contractor",
  "broker",
  "investor",
  "sourcing-agent",
  "client",
  "admin",
];

const Register = () => {
  // At the top of your component
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "contractor",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
      role: Yup.string()
        .oneOf(roles, "Invalid role")
        .required("Role is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // 1. Register the user
        const userCred = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCred.user;
        // 2. Force token refresh to ensure Firestore has context
        await user.getIdToken(true);
        // 3. Now write to Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: values.email,
          role: values.role,
          kycVerified: false,
          createdAt: new Date(),
        });
    
        toast.success("Registration successful!");
        setTimeout(() => {
          navigate("/")
        },1500)
        navigate("/");
      } catch (error) {
        toast.error(error.message);
        console.error("Registration error:", error);
      } finally {
        setSubmitting(false);
      }
    }
    
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
      <ToastContainer />

      {/* Floating blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-pink-300 rounded-full opacity-30 animate-blob" />
        <div className="absolute bottom-[-120px] right-[-100px] w-96 h-96 bg-yellow-300 rounded-full opacity-20 animate-blob animation-delay-2000" />
      </div>

      <motion.form
        onSubmit={formik.handleSubmit}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Create an Account 🚀
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="block text-sm font-semibold mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-600 focus:outline-none"
          >
            {showPassword ? (
              <IoIosEye />
            ) : (
              <IoIosEyeOff className="w-8 h-8 cursor-pointer" />
            )}
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4 relative">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-600 focus:outline-none"
          >
            {showConfirmPassword ? (
             <IoIosEye />
            ) : (
              <IoIosEyeOff className="w-8 h-8 cursor-pointer" />
            )}
          </button>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="mb-6">
          <label htmlFor="role" className="block text-sm font-semibold mb-1">
            Select Role
          </label>
          <select
            id="role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.role}</p>
          )}
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold"
        >
          {formik.isSubmitting ? "Registering..." : "Sign Up"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default Register;
