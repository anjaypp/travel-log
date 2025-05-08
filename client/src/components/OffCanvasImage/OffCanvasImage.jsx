import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import styles from './OffCanvasImage.module.css';

const OffCanvasImage = ({ show, onHide, images }) => {
  return (
    <Offcanvas show={show} onHide={onHide} placement="end" className={styles.offcanvas}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Images</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {images && images.length > 0 ? (
          images.map((image, index) => (
            <img
              key={image.publicId || index}
              src={image.url}
              alt={`Log Image ${index + 1}`}
              className={styles.image}
              loading="lazy"
            />
          ))
        ) : (
          <p className={styles.noImages}>No images available</p>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffCanvasImage;
