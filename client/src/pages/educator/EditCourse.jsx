import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Quill from "quill";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, getToken } = useContext(AppContext);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  const fetchCourse = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (data.success) {
        const c = data.courseData;
        setCourse(c);
        setCourseTitle(c.courseTitle);
        setCoursePrice(c.coursePrice);
        setDiscount(c.discount);
  
        // Wait for quill to be initialized before setting content
        setTimeout(() => {
          if (quillRef.current) {
            quillRef.current.root.innerHTML = c.courseDescription;
          }
        }, 0);
      }
    } catch (error) {
      toast.error("Failed to load course data");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedCourse = {
        courseTitle,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseDescription: quillRef.current.root.innerHTML,
      };

      const token = await getToken();
      const { data } = await axios.put(`${backendUrl}/api/educator/edit-course/${id}`, updatedCourse, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Course updated successfully");
        navigate("/my-courses");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating course");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return course ? (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
      <form onSubmit={handleUpdate} className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1">Course Title</label>
          <input
            className="w-full border p-2 rounded"
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Course Price</label>
          <input
            className="w-full border p-2 rounded"
            type="number"
            value={coursePrice}
            onChange={(e) => setCoursePrice(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-1">Discount (%)</label>
          <input
            className="w-full border p-2 rounded"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-1">Course Description</label>
          <div ref={editorRef} className="bg-white border rounded h-40"></div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
          Update Course
        </button>
      </form>
    </div>
  ) : null;
};

export default EditCourse;
