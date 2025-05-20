import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'James Wilson',
      role: 'CEO, Nexus Technologies',
      feedback:
        'Shadow Drive has transformed our executive transportation experience. Impeccable service, pristine vehicles, and always punctual. Highly recommended for business travel.',
      rating: 5,
      image: 'https://via.placeholder.com/50x50?text=James',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Event Coordinator',
      feedback:
        "I've used Shadow Drive for multiple corporate events and they've never disappointed. Their attention to detail and professional chauffeurs make all the difference.",
      rating: 5,
      image: 'https://via.placeholder.com/50x50?text=Sarah',
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Finance Director',
      feedback:
        'The level of service provided by Shadow Drive is exceptional. From the booking experience to the ride itself, everything is handled with utmost professionalism.',
      rating: 5,
      image: 'https://via.placeholder.com/50x50?text=Michael',
    },
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <h2>What Our Clients Say</h2>
        <p className="subtitle">
          Don't take our word for it – hear what our valued clients have to say about their Shadow Drive experience.
        </p>
        <div className="testimonial-cards">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="stars">
                  {'★'.repeat(testimonial.rating)}
                </div>
              </div>
              <p className="feedback">"{testimonial.feedback}"</p>
              <div className="testimonial-footer">
                <img src={"assests/images/test1.png"} alt={testimonial.name} className="client-avatar" />
                <div>
                  <p className="client-name">{testimonial.name}</p>
                  <p className="client-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;