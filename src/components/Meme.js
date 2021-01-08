import React from 'react';

export const Meme = ({ template, onClick }) => {
  return (
    <img
      className="template-image"
      key={template.id}
      src={template.url}
      alt={template.name}
      onClick={onClick}
    />
  );
};
