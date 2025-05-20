import React from 'react';
import './Services.css';
import Footer from "../components/Footer";

const Services = () => {
  const services = [
    {
      title: 'Executive Car Rental',
      description:
        'Premium luxury vehicles available for self-drive rental. Perfect for business executives and special occasions.',
      features: [
        'Wide selection of premium vehicles',
        'Flexible rental periods',
        'Comprehensive insurance included',
        'Contactless vehicle delivery and collection',
        '24/7 roadside assistance',
      ],
      buttonText: 'Book This Service',
      imageAlt: 'Executive Car Rental',
      image: 'assests/images/excutive.png'
    },
    {
      title: 'Chauffeur Services',
      description:
        'Professional chauffeur services for business travel, airport transfers, and special events.',
      features: [
        'Professional, uniformed chauffeurs',
        'Airport meet & greet service',
        'Corporate road shows',
        'Point-to-point transfers',
        'Hourly charter services',
      ],
      buttonText: 'Book This Service',
      imageAlt: 'Chauffeur Services',
      image: 'assests/images/chauffeur-service.jpg'
    },
    {
      title: 'Corporate Fleet Management',
      description:
        'Comprehensive fleet management solutions for businesses of all sizes.',
      features: [
        'Custom corporate accounts',
        'Dedicated account manager',
        'Fleet optimization consulting',
        'Employee transportation solutions',
        'Integrated billing and reporting',
      ],
      buttonText: 'Book This Service',
      imageAlt: 'Corporate Fleet Management',
      image: 'assests/images/excutive.png'
    },
    {
      title: 'Special Event Transportation',
      description:
        'Luxury transportation solutions for weddings, galas, and other special occasions.',
      features: [
        'Wedding packages',
        'Red carpet service',
        'Group transportation coordination',
        'Customizable vehicle decoration',
        'Photography session arrangements',
      ],
      buttonText: 'Book This Service',
      imageAlt: 'Special Event Transportation',
      image: 'assests/images/chauffeur-service.jpg'
    },
  ];

  return (
    <div className="services-page">
      {/* Title Section */}
      <div className="services-header">
        <h1>Our Premium Services</h1>
        <p>
          From executive car rentals to chauffeur services, Shadow Drive offers
          a comprehensive range of luxury transportation solutions.
        </p>
      </div>

      {/* Services Section */}
      <div className="services-list">
        {services.map((service, index) => (
          <div
            className={`service-container ${
              index % 2 === 0 ? 'image-left' : 'image-right'
            }`}
            key={index}
          >
            {/* Image */}
            <div className="service-image-card">
              <div 
                className="service-image" 
                aria-label={service.imageAlt}
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL + service.image})` }}
              ></div>
            </div>

            {/* Info Card */}
            <div className="service-info-card">
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <ul>
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
              <button className="service-button">{service.buttonText}</button>
            </div>
          </div>
        ))}
      </div>
      {/* Footer Section */} 
      <Footer />  
    </div>
  );
};

export default Services;
