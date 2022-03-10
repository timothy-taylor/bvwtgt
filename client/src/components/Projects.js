import Layout from "./Layout";
import { list } from "../assets/Project_list";

const Projects = () => {
  return (
    <Layout active="Projects">
      <main className="section" id="projects">
        <h2 className="section__h2">Projects</h2>
        <div id="project-parent">
          <p>
            <em>
              A short list of projects that I found interesting enough to add
              some additional documentation to. Click each project for more
              details.
            </em>
          </p>
          <ol>
            {list.map((e, i) => (
              <li key={"project" + i} className="project-container">
                <details key={"details" + i}>
                  <summary key={"project_name" + i} className="project-name">
                    {e.name}
                  </summary>
                  <p key={"project_description" + i}>{e.description}</p>
                  <p key={"project_how" + i}>{e.how}</p>
                  <p key={"project_features" + i}>{e.feature}</p>
                  <ul key={"project_links" + i}>
                    {Object.entries(e.address).map(([k, v]) => (
                      <li key={"project_address" + k} className="project-link">
                        <a href={v} key={"project_address_link" + k}>
                          {k}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </Layout>
  );
};

export default Projects;
