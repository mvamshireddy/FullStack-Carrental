import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({
  title,
  description,
  features,
  buttonText,
  imageAlt,
}) => {
  return (
    <div className="service-card">
      {/* Image Placeholder */}
      <div className="service-image" aria-label={imageAlt}></div>

      {/* Service Details */}
      <div className="service-details">
        <h2>{title}</h2>
        <p>{description}</p>
        <ul>
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <button className="service-button">{buttonText}</button>
      </div>
    </div>
  );
};

export default ServiceCard;