import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();
  const { fetchUserData, fetchUserEnrolledCourses } = useContext(AppContext);

  useEffect(() => {
    if (path) {
      // Refresh user data after Stripe payment
      fetchUserData();
      fetchUserEnrolledCourses();

      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [path]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4
        border-t-blue-400 rounded-full animate-spin"
      ></div>
    </div>
  );
};

export default Loading;

