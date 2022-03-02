import React from "react";

const DisplayPost = ({title, markdown}) => {
  React.useEffect(() => {
    const p = document.getElementById("markdown");
    p.innerHTML = markdown;
  },[markdown])

  return (
    <article className="post">
      <h2>{title}</h2>
      <div id="markdown" />
    </article>
  )
}

export default DisplayPost;
