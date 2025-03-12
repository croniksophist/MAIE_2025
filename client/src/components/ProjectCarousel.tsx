import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProjectCarousel: React.FC = () => {
  const projects = ["Project 1", "Project 2", "Project 3"]; // Replace with dynamic project data

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {projects.map((project, index) => (
        <div key={index}>
          <h3>{project}</h3>
          <p>Some description here...</p>
        </div>
      ))}
    </Slider>
  );
};

export default ProjectCarousel;
