import React from 'react';
import '../css/TestimonialsCarousel.css'
const TestimonialsCarousel = () => {
  const testimonials = [
    { id: 1, quote: 'Great selection of books!', name: 'John Doe' },
    { id: 2, quote: 'Fast shipping and excellent service!', name: 'Jane Smith' },
    // Add more testimonials
  ];

  return (
    <div className="testimonials-carousel">
      {testimonials.map(testimonial => (
        <div key={testimonial.id} className="testimonial-item">
          <p>"{testimonial.quote}"</p>
          <h4>- {testimonial.name}</h4>
        </div>
      ))}
    </div>
  );
};

export default TestimonialsCarousel;
