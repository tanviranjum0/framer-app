import React from "react";
import "../../styles/ptbutton.css";
const PTbutton = ({ progress }: { progress: string }) => {
  return <div className="ptbutton">{progress}</div>;
};

export default PTbutton;
