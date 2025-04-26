import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownPortfolio = ({ markdown, portfolioSitePath, onEdit, onDelete }) => {
  return (
    <div className="min-h-screen bg-base-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          {portfolioSitePath && (
            <a 
              href={`/generated-portfolios${portfolioSitePath}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-success"
            >
              View Generated Portfolio
            </a>
          )}
          <div className="flex gap-2">
            <button onClick={onEdit} className="btn btn-primary">
              Edit Portfolio
            </button>
            <button onClick={onDelete} className="btn btn-error">
              Delete Portfolio
            </button>
          </div>
        </div>
        <div className="prose prose-lg max-w-none bg-base-100 p-8 rounded-lg shadow-xl">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-8" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-8 mb-4" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-3" {...props} />,
              p: ({node, ...props}) => <p className="mb-4" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
              li: ({node, ...props}) => <li className="mb-2" {...props} />,
              a: ({node, ...props}) => (
                <a
                  className="text-primary hover:text-primary-focus underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownPortfolio;
