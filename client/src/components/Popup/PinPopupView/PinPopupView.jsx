import React, { useState } from 'react';
import { MdOutlineEditLocationAlt } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { TbSlideshow } from "react-icons/tb";
import EditPinForm from '../EditPinForm/EditPinForm';
import OffCanvasImage from '../../OffCanvasImage/OffCanvasImage';
import styles from "./PinPopupView.module.css";

const PinPopupView = ({ pin, onEdit, onDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const handleEditSubmit = (updatedData) => {
    onEdit(updatedData, pin._id);
    setShowEditForm(false);
  };

  return (
    <div className={styles.pinPopupContainer}>
      {showEditForm ? (
        <EditPinForm
          initialData={pin}
          onSubmit={handleEditSubmit}
          onClose={() => setShowEditForm(false)}
        />
      ) : (
        <>
          <div className={styles.pinPopup}>
            <h4 className={styles.popupTitle}>{pin.title}</h4>
            <p>Description: {pin.description}</p>
            <p>Date of visit: {new Date(pin.visitedDate).toLocaleString()}</p>
            <p>Location: {pin.location.lat}, {pin.location.lng}</p>
            <p>Rating: ⭐ {pin.rating}/5</p>
          </div>
          <div className={styles.buttonGroup}>
            <MdOutlineEditLocationAlt
              className={styles.editButton}
              onClick={() => setShowEditForm(true)}
            />
            <MdDeleteForever
              className={styles.deleteButton}
              onClick={() => onDelete(pin._id)}
            />
            <TbSlideshow
              className={styles.showImages}
              onClick={() => setShowImage(!showImage)}
            />
            <OffCanvasImage show={showImage} onHide={() => setShowImage(false)} images={pin.images || []} />
          </div>
        </>
      )}
    </div>
  );
};

export default PinPopupView;
