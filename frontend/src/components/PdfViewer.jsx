import React from 'react';

const PdfViewer = ({ fileUrl, width = "100%", height = "600px" }) => {
  if (!fileUrl) return <div>No file to display</div>;

  const isPdf = fileUrl.endsWith(".pdf");

  return (
    <div className="flex justify-center items-center">
      {isPdf ? (
        <iframe
          src={fileUrl}
          title="PDF Preview"
          style={{ width, height, border: "none" }}
        />
      ) : (
        <img
          src={fileUrl}
          alt="Image Preview"
          style={{ width, height, objectFit: "contain" }}
        />
      )}
    </div>
  );
};

export default PdfViewer;
