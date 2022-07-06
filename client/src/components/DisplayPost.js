import { useEffect } from "react";
import sanitizeHtml from "sanitize-html";

export default function DisplayPost({ title, markdown }) {
  useEffect(() => {
    const p = document.getElementById("markdown");
    p.innerHTML = sanitizeHtml(markdown);
  }, [markdown]);

  return (
    <article className="post">
      <h2>{title}</h2>
      <div id="markdown" />
    </article>
  );
}
