import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

//#1 - Create App Context

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // Fetch all courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Fetch UserData
  const fetchUserData = async () => {
    // if (user.publicMetadata.role === "educator") {
     if (user && user.publicMetadata?.role === "educator") {
      setIsEducator(true);
    }
    try {
      const token = await getToken();
      console.log("🔐 Token:", token);
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to calculate average rating of course - either one version works great!!!
  // const calculateRating = (course) => {
  //   if(!course.courseRatings || course.courseRatings.length === 0) {
  //     return 0;
  //   }
  //   let totalRating = 0;
  //   course.courseRatings.forEach(rating => {
  //     if(typeof rating.rating === 'number') {
  //     totalRating += rating.rating
  //     }
  //   })
  //   return totalRating / course.courseRatings.length;
  // }
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }

    const totalRating = course.courseRatings.reduce((acc, rating) => {
      return acc + (typeof rating.rating === "number" ? rating.rating : 0);
    }, 0);

    // return totalRating / course.courseRatings.length;
    return Math.floor(totalRating / course.courseRatings.length);
  };

  // Function to calculate Course Chapter's time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function calculate course duration - check what is better to use here map() or forEach()
  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => {
        // time += <lecture className="lectureDuration"></lecture>;
        time += lecture.lectureDuration;
      })
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // function calculate to No of lectures in the course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  // Fetch user enrolled courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/user/enrolled-courses",
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllCourses();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const logToken = async () => {
  //   console.log(await getToken());
  // };
  //   const logToken = async () => {
  //     console.log("logToken() function is running..."); // Debugging message
  //     const token = await getToken();
  //     if (token) {
  //         console.log("Retrieved Token:", token);
  //     } else {
  //         console.log("No token found!");
  //     }
  // };

 
  useEffect(() => {
    if (user) {
      // logToken();
      fetchUserData();
      fetchUserEnrolledCourses();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
    fetchUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
