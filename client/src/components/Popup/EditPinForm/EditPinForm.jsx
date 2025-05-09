import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import styles from './EditPinForm.module.css';

const EditPinForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    visitedDate: '',
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        rating: initialData.rating || '',
        visitedDate: initialData.visitedDate
          ? new Date(initialData.visitedDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    const toastId = toast.loading('Updating pin...');
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('rating', formData.rating);
      data.append('visitedDate', formData.visitedDate);
      data.append('location', JSON.stringify(initialData.location));
      images.forEach((img) => data.append('images', img));

      await onSubmit(data);
      toast.dismiss(toastId);
      onClose();
    } catch (err) {
      toast.dismiss(toastId);
      throw err; // Propagate to MapPage for API toasts
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h4>Edit Travel Log</h4>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className={styles.input}
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className={styles.input}
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="visitedDate" className={styles.label}>
          Visited Date
        </label>
        <input
          type="date"
          id="visitedDate"
          name="visitedDate"
          className={styles.input}
          value={formData.visitedDate}
          onChange={handleChange}
          max={today}
          required
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="rating" className={styles.label}>
          Rating
        </label>
        <input
          type="number"
          id="rating"
          name="rating"
          className={styles.input}
          value={formData.rating}
          onChange={handleChange}
          min={0}
          max={5}
          disabled={isLoading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="images" className={styles.label}>
          Upload Images
        </label>
        <input
          type="file"
          id="images"
          name="images"
          className={styles.input}
          multiple
          accept="image/*"
          onChange={handleImageChange}
          disabled={isLoading}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.button}
          disabled={isLoading}
        >
          Save Changes
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditPinForm;