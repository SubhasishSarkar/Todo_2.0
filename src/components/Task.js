import React from "react";
import parse from "html-react-parser";

export default function Task(props) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (e.target.className === "keyword") {
      console.log(e.target.dataset.key);
      props.onKeySearch(e.target.dataset.key);
    } else if(props.onComplete) {

      props.onComplete(props.id);
    }
  };
  const keywordMaker = () => {
    const r = /#\w*/g;
    return props.title.replace(r, (keyword) =>`<button class="keyword" data-key="${keyword}">${keyword}</button>`);   
  }
  return (
    <div className="task_item_container">
      <div
        onClick={(e) => {
          handleClick(e);
        }}
      >
        <div
          className={
            props.completed === "true" ? "circle_green" : "circle_grey"
          }
        ></div>
        <div>{parse(keywordMaker())}</div>
      </div>
    </div>
  );
}
