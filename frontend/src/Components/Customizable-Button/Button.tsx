import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  color?: string;
  hoverColor?: string;
  width?: string;
  height?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderRadius?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ children, color='#A30000', hoverColor='#FF5C5C', width='fit-content', height='40px', textColor='#ffffff', hoverTextColor='#000000', borderRadius='20px', onClick=()=>{} }) => {
  const buttonStyle = {
    backgroundColor: color,
    transition: '0.3s',
    width: width,
    height: height,
    color: textColor,
    borderRadius: borderRadius,
    border: 'none',
    cursor: 'pointer',
    padding: '10px 10px',
    fontSize: '15px'
  };

  function hoverEffect(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.backgroundColor = hoverColor; 
    e.currentTarget.style.color = hoverTextColor;
    e.currentTarget.style.paddingRight = '20px'; 
    e.currentTarget.style.paddingLeft = '20px'; 
  }

  function removeHoverEffect(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.backgroundColor = color; 
    e.currentTarget.style.color = textColor;
    e.currentTarget.style.paddingRight = '10px'; 
    e.currentTarget.style.paddingLeft = '10px'; 
  }

  return (
    <button
      onClick={onClick}
      className="custom-button"
      style={buttonStyle}
      onMouseOver={e => hoverEffect(e) }
      onMouseOut={e => removeHoverEffect(e)}
    >
      {children}
    </button>
  );
};

export default Button;
