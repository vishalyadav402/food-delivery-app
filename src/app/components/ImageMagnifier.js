"use client"
import React, { useState } from 'react';
import style from '@/app/style/ImageMagnifier.module.css';

const ImageMagnifier = ({ src }) => {
  const [magnifierStyle, setMagnifierStyle] = useState({});

  const handleMouseMove = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { width, height } = target.getBoundingClientRect();
    const x = (offsetX / width) * 100;
    const y = (offsetY / height) * 100;

    setMagnifierStyle({
      backgroundImage: `url(${src})`,
      backgroundSize: `${width * 2}px ${height * 2}px`,
      backgroundPosition: `${x}% ${y}%`,
      display: 'block',
      top: offsetY - 100 + 'px',
      left: offsetX - 100 + 'px',
    });
  };

  const handleMouseLeave = () => {
    setMagnifierStyle({
      display: 'none',
    });
  };

  return (
    <>
        <div className={style.image_magnifier_container}>
            <img
                src={src}
                alt="Product"
                className={style.product_image}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            />
         <div className={style.magnifier} style={magnifierStyle}></div>
    </div>


{/* image slider */}


    </>
  );
};

export default ImageMagnifier;
