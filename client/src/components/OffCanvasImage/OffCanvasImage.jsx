import React from 'react';
import { Offcanvas } from 'react-bootstrap';

const OffCanvasImage = ({ show, onHide, url }) => {
  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Images</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <img src={url} alt="Log Image" style={{ width: '100%' }} />
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffCanvasImage;
