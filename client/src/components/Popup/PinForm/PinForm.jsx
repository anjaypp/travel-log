import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      onSuccess(res.data);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Error uploading log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="popup-form" onSubmit={handleSubmit}>
      <h3>Add Travel Log</h3>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        className={styles.input}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        className={styles.input}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="visitedDate"
        value={formData.visitedDate}
        className={styles.input}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="rating"
        placeholder="Rating (1-5)"
        value={formData.rating}
        className={styles.input}
        onChange={handleChange}
        min={1}
        max={5}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className={styles.input}
      />
      <div className={styles.buttonGroup}>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}

export default PinForm;
