import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap"; // For form components

const EditPinForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        rating: initialData.rating || "",
        imageUrl: initialData.imageUrl || "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Call the submit handler passed from the parent
    onClose(); // Close the form after submission
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Rating</Form.Label>
        <Form.Control
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          min="1"
          max="5"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Changes
      </Button>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
    </Form>
  );
};

export default EditPinForm;
