// import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '../../context/AppContext'
// import Loading from '../../components/student/Loading';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const MyCourses = () => {

//   const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
//   const [courses, setCourses] = useState(null);

//   const fetchEducatorCourses = async () => {
//     try {
//       const token = await getToken()
//       const {data} = await axios.get(backendUrl + '/api/educator/courses', {headers: {Authorization: `Bearer ${token}`}})

//       data.success && setCourses(data.courses)
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(()=> {
//     if(isEducator){
//       fetchEducatorCourses();
//     }
//   }, [isEducator])

//   return courses ? (
//     <div className='h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pb-0'>
//        <div className='w-full'>
//         <h2 className='pb-4 text-lg font-medium'>My Courses</h2>
//           <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
//             <table className='md:table-auto table-fixed w-full overflow-hidden'>
//               <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
//                  <tr>
//                  <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
//                  <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
//                  <th className='px-4 py-3 font-semibold truncate'>Students</th>
//                  <th className='px-4 py-3 font-semibold truncate'>Published on</th>
//                  </tr>

//               </thead>
//               <tbody className='text-sm text-gray-500'>
//                  {courses.map((course)=> (
//                   <tr key={course._id} className='border-b border-gray-500/20'>
//                     <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
//                       <img src={course.courseThumbnail} alt="course_image" className='w-16'/>
//                     <span className='truncate hidden md:block'>{course.courseTitle}</span>
//                     </td>
//                     <td className='px-4 py-3'>{currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice /100))}</td>
//                   <td className='px-4 py-3'>{course.enrolledStudents.length}</td>
//                   <td>{new Date(course.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                  ))}
//               </tbody>
//             </table>
//           </div>
//        </div>
//     </div>
//   ) : <Loading />
// }

// export default MyCourses

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      data.success && setCourses(data.courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete Course Logic
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this course?")) return;

  //   try {
  //     const token = await getToken();
  //     const { data } = await axios.delete(`${backendUrl}/api/educator/delete-course/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (data.success) {
  //       toast.success("Course deleted successfully");
  //       setCourses((prevCourses) => prevCourses.filter((c) => c._id !== id));
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error("Failed to delete course");
  //     console.error("❌ Delete error:", error);
  //   }
  // };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the course!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const token = await getToken();
        const { data } = await axios.delete(
          `${backendUrl}/api/educator/delete-course/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          Swal.fire("Deleted!", "The course has been deleted.", "success");
          setCourses((prevCourses) => prevCourses.filter((c) => c._id !== id));
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        console.error("❌ Delete error:", error);
        Swal.fire(
          "Error",
          "Something went wrong while deleting the course.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  return courses ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">
                  All Courses
                </th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">
                  Published on
                </th>
                <th className="px-4 py-3 font-semibold truncate">Edit</th>
                <th className="px-4 py-3 font-semibold truncate">Delete</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img
                      src={course.courseThumbnail}
                      alt="course_image"
                      className="w-16"
                    />
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {currency}{" "}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/educator/edit-course/${course._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      <MdOutlineEdit size={20}
                       className="text-gray-400 text-2xl ml-3 cursor-pointer hover:scale-110 transition hover:text-blue-500"/>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <MdDelete
                      size={20}
                      className="text-gray-400 text-2xl cursor-pointer hover:scale-110 transition hover:text-red-500"
                      onClick={() => handleDelete(course._id)}
                    />
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
