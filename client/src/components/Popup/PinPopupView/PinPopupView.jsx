import React from 'react';
import styles from "./PinPopupView.module.css";

const PinPopupView = ({pin}) => {
  return (
    <div className={styles.pinPopupContainer}>
      <div className={styles.pinPopup}>
        <h4 className={styles.popupTitle}>{pin.title}</h4>
        <p>Description:{pin.description}</p>
        <p>Date of visit:{new Date(pin.visitedDate).toLocaleString()}</p>
        <p>Location:{pin.location.lat}, {pin.location.lng}</p>
        <p>Rating:⭐ {pin.rating}/5</p>
      </div>
    </div>
  )
}

export default PinPopupView