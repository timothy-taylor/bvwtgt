import React from "react";

const DisplayPost = (props) => {
  React.useEffect(() => {
    const p = document.getElementById("markdown");
    p.innerHTML = props.markdown;
  },[props.markdown])

  return (
    <article class="post">
      <h2>{props.title}</h2>
      <p id="markdown" />
    </article>
  )
}

export default DisplayPost;
