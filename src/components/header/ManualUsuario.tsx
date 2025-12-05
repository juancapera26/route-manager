import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.js?url";
import { useState, useRef, useEffect } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function ManualUsuario() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Cargar número de páginas
  function onLoadSuccess(pdf: PDFDocumentProxy) {
    setNumPages(pdf.numPages);
    setPageNumber(1);
  }

  // Ajuste responsivo
  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - 20); // margen interno
      }
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const prevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Manual de Usuario</h1>

      {/* Contenedor del PDF */}
      <div
        ref={containerRef}
        className="w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 overflow-auto p-4 flex justify-center"
      >
        {containerWidth > 0 && (
          <Document
            file="/manual/Manual_Usuario_Route-Manager.pdf"
            onLoadSuccess={onLoadSuccess}
            loading={<p className="text-center py-10">Cargando manual...</p>}
            error={
              <p className="text-center py-10 text-red-500">
                Error al cargar el PDF
              </p>
            }
          >
            <Page
              pageNumber={pageNumber}
              width={containerWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        )}
      </div>

      {/* Navegación */}
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={prevPage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={pageNumber === 1}
        >
          Anterior
        </button>
        <span>
          Página {pageNumber} de {numPages || 0}
        </span>
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={pageNumber === numPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
