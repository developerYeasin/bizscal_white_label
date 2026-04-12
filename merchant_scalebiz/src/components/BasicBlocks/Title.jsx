import React from "react";

const Title = ({ data }) => {
  const {
    text = "",
    tag = "h2",
    textAlign = "left",
    color = "inherit",
    fontSize = "",
    fontWeight = "bold",
    margin = { top: 0, right: 0, bottom: 16, left: 0 },
    className = "",
  } = data || {};

  const Tag = tag;

  const style = {
    textAlign,
    color,
    fontSize: fontSize ? `${fontSize}px` : undefined,
    fontWeight,
    marginTop: `${margin.top}px`,
    marginRight: `${margin.right}px`,
    marginBottom: `${margin.bottom}px`,
    marginLeft: `${margin.left}px`,
  };

  return (
    <Tag className={className} style={style}>
      {text}
    </Tag>
  );
};

export default Title;
