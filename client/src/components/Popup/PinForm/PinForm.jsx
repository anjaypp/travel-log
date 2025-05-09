import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../api/axios";
import styles from "./PinForm.module.css";

function PinForm({ location, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visitedDate: "",
    rating: 0
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.visitedDate) {
      toast.error('Visited date is required');
      return;
    }
    if (formData.rating && (formData.rating < 1 || formData.rating > 5)) {
      toast.error('Rating must be between 1 and 5');
      return;
    }
    if (new Date(formData.visitedDate) > new Date()) {
      toast.error('Visited date cannot be in the future');
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading('Creating log...');

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("visitedDate", formData.visitedDate);
      data.append("rating", formData.rating);
      data.append("location[lat]", location.lat);
      data.append("location[lng]", location.lng);

      images.forEach((img) => data.append("images", img));

      const res = await axiosInstance.post("/logs", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.status >= 200 && res.status < 300) {
        toast.dismiss(toastId);
        toast.success("Log added successfully");
        onSuccess(res.data);
      }
      else{
        throw new Error("Failed to add log");
      }
    } catch (err) {
      toast.dismiss(toastId);
      const message = err.response?.data?.message || "Failed to add log";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h4>Add Travel Log</h4>
      <label htmlFor="title" className={styles.label}>Title</label>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        className={styles.input}
        onChange={handleChange}
        disabled={isLoading}
        required
      />

      <label htmlFor="description" className={styles.label}>Description</label>
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        className={styles.input}
        onChange={handleChange}
        disabled={isLoading}
        required
      />

      <label htmlFor="visitedDate" className={styles.label}>Visited Date</label>
      <input
        type="date"
        name="visitedDate"
        value={formData.visitedDate}
        className={styles.input}
        max={today}
        onChange={handleChange}
        disabled={isLoading}
        required
      />

      <label htmlFor="rating" className={styles.label}>Rating</label>
      <input
        type="number"
        name="rating"
        placeholder="Rating (1-5)"
        value={formData.rating}
        className={styles.input}
        onChange={handleChange}
        disabled={isLoading}
        min={0}
        max={5}
      />

      <label className={styles.label}>Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className={styles.input}
        disabled={isLoading}
      />

      <div className={styles.buttonGroup}>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}

export default PinForm;
