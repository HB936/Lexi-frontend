import { useState } from "react";

export default function Pdf({ pdfData, onClose }) {
  const [currentPage, setCurrentPage] = useState(pdfData?.page || 1);
  const [viewerType, setViewerType] = useState('native'); // 'native', 'pdfjs', 'google'
  const [error, setError] = useState(null);

  const getAbsoluteUrl = (url) => {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }
    if (url.startsWith('http')) return url;
    return `${window.location.origin}${url}`;
  };

  if (!pdfData || !pdfData.url || typeof pdfData.url !== 'string') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-2">
        <div className="relative w-full max-w-4xl h-[90%] bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
          <div className="text-center p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading PDF</h2>
            <p className="text-gray-600 mb-4">No PDF data or URL provided</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleViewerError = () => {
    if (viewerType === 'native') {
      setViewerType('pdfjs');
    } else if (viewerType === 'pdfjs') {
      setViewerType('google');
    } else {
      setError('Unable to load PDF in any viewer');
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-2">
        <div className="relative w-full max-w-4xl h-[90%] bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
          <div className="text-center p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading PDF</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  let pdfUrl;
  try {
    const absoluteUrl = getAbsoluteUrl(pdfData.url);

    if (viewerType === 'native') {
      pdfUrl = `${absoluteUrl}#page=${currentPage}&zoom=FitH&toolbar=1`;
    } else if (viewerType === 'pdfjs') {
      pdfUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(absoluteUrl)}#page=${currentPage}&zoom=page-fit`;
    } else {
      pdfUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;
    }
  } catch (err) {
    setError(err.message);
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-2">
      <div className="relative w-full max-w-[95%] h-[95%] bg-white rounded-xl shadow-lg flex flex-col">
        
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center p-4 border-b bg-gray-100 rounded-t-xl gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold">PDF Viewer</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Viewer:</span>
              <select
                value={viewerType}
                onChange={(e) => setViewerType(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="native">Native</option>
                <option value="pdfjs">PDF.js</option>
                <option value="google">Google Docs</option>
              </select>
            </div>

            {viewerType !== 'google' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  ← Prev
                </button>
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page > 0) setCurrentPage(page);
                  }}
                  className="w-16 px-2 py-1 border rounded text-center text-sm"
                  min="1"
                />
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Next →
                </button>
              </div>
            )}

            {viewerType === 'google' && (
              <span className="text-sm text-gray-600">
                Target Page: {pdfData?.page || 1} (Use viewer controls to navigate)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleViewerError}
              className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
            >
              Try Different Viewer
            </button>
            <button
              onClick={onClose}
              className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* Viewer */}
        <div className="flex-1 overflow-hidden">
          {viewerType === 'native' ? (
            <object
              data={pdfUrl}
              type="application/pdf"
              className="w-full h-full"
              onError={handleViewerError}
            >
              <embed
                src={pdfUrl}
                type="application/pdf"
                className="w-full h-full"
                onError={handleViewerError}
              />
            </object>
          ) : (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-none"
              title="PDF Viewer"
              onError={handleViewerError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
