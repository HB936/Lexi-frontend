import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useRef } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Try these CDN URLs in order - they should have the correct version
const workerUrls = [
  `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.js`,
  `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.3.31/build/pdf.worker.min.js`,
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
];

// Use the first URL - it should match your exact version
pdfjs.GlobalWorkerOptions.workerSrc = workerUrls[0];

export default function Pdf({ pdfData, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef(null);
  const pageRefs = useRef({});

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Auto-scroll to the specified page when PDF loads
  useEffect(() => {
    if (numPages && pdfData?.page && pageRefs.current[pdfData.page]) {
      // Small delay to ensure the page is rendered
      setTimeout(() => {
        pageRefs.current[pdfData.page]?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [numPages, pdfData?.page]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div 
        ref={containerRef}
        className="relative w-[90%] h-[90%] bg-white overflow-y-auto rounded-xl shadow-lg p-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-500 px-3 py-1 rounded z-10"
        >
          Close
        </button>

        <Document file={pdfData?.url} onLoadSuccess={onLoadSuccess}>
          {Array.from({ length: numPages }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <div 
                key={`page_${pageNumber}`}
                ref={el => pageRefs.current[pageNumber] = el}
                className={`mb-4 ${pageNumber === pdfData?.page ? 'bg-yellow-100 p-2 rounded' : ''}`}
              >
                <Page
                  pageNumber={pageNumber}
                  width={800}
                  className="mx-auto"
                />
              </div>
            );
          })}
        </Document>
      </div>
    </div>
  );
}