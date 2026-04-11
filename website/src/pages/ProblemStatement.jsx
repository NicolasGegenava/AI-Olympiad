import React, { Suspense, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import contests from '../data/contests';
import 'katex/dist/katex.min.css';
import './ProblemStatement.css';

const mdxModules = import.meta.glob('../content/tasks/*.mdx');

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5 0-1.4-.5-2.5-1.5-3.4.1-.3.6-1.6-.1-3.4 0 0-1.2-.4-3.8 1.4a12.8 12.8 0 0 0-7 0C6 1.6 4.8 2 4.8 2c-.7 1.8-.2 3.1-.1 3.4-1 .9-1.5 2-1.5 3.4 0 5 3 6.2 6 6.5-1 .8-1.3 2-1.4 2.8-.8.4-2.8 1-4-1.2 0 0-.7-1.3-2-1.4 0 0-1.4 0-.1 1.6.8.8 1.4 2.4 1.4 2.4 1 2.8 3.5 2.5 4.5 2.4v3.1"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const ProblemStatement = () => {
  const { slug, taskId } = useParams();
  const navigate = useNavigate();

  const contest = useMemo(() => contests.find((c) => c.slug === slug), [slug]);
  const task = useMemo(() => contest?.tasks?.find((t) => t.id === taskId), [contest, taskId]);

  const MdxContent = useMemo(() => {
    if (!task) return null;
    const modulePath = `../content/tasks/${taskId}.mdx`;
    const loadMdx = mdxModules[modulePath];
    if (!loadMdx) return null;
    return React.lazy(loadMdx);
  }, [task, taskId]);

  if (!contest || !task) {
    return (
      <div className="page-wrapper container ps-not-found">
        <h1>Task not found</h1>
        <button className="cd-back-btn" onClick={() => navigate(`/contests/${slug}`)}>
          <ArrowLeftIcon /> Back to Contest
        </button>
      </div>
    );
  }

  return (
    <div className="page-wrapper container ps-container">
      <button className="cd-back-btn" onClick={() => navigate(`/contests/${slug}`)}>
        <ArrowLeftIcon /> Back to Contest
      </button>

      <div className="ps-header">
        <div className="ps-header__main">
          <span className="ps-category-pill">{task.category}</span>
          <h1 className="ps-title">{task.name}</h1>
        </div>
        {task.githubLink && (
          <a
            href={task.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ps-github-btn"
          >
            <GithubIcon />
            GitHub Solution
          </a>
        )}
      </div>

      <div className="ps-content markdown-pro">
        <Suspense fallback={<div className="ps-loading">Loading problem statement...</div>}>
          {MdxContent ? <MdxContent /> : <p>Problem statement content could not be found.</p>}
        </Suspense>
      </div>
    </div>
  );
};

export default ProblemStatement;
