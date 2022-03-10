import React from "react";
import sanitizeHtml from "sanitize-html";

const DisplayPost = ({title, markdown}) => {
  React.useEffect(() => {
    const p = document.getElementById("markdown");
    p.innerHTML = sanitizeHtml(markdown);
  },[markdown])

  return (
    <article className="post">
      <h2>{title}</h2>
      <div id="markdown" />
    </article>
  )
}

export default DisplayPost;
