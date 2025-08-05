import React, { useEffect, useState } from 'react';
import { Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const TwilioPdfDownloader = ({ 
  fileName = 'sample-document.pdf',
  autoDownload = true,
  documentTitle = 'Sample PDF Document',
  content = null
}) => {
  const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, generating, success, error
  const [error, setError] = useState(null);

  // Function to create a simple PDF document
  const createSamplePdf = () => {
    const defaultContent = content || {
      title: documentTitle,
      subtitle: 'Generated PDF Document',
      sections: [
        {
          heading: 'Introduction',
          text: 'This is a sample PDF document generated using React. This document demonstrates how to create and download PDF files programmatically in a web browser.'
        },
        {
          heading: 'Features',
          text: 'This PDF generator includes:\n• Automatic PDF creation\n• Custom content support\n• Download functionality\n• Error handling\n• Responsive design'
        },
        {
          heading: 'Technical Details',
          text: 'The PDF is created using the standard PDF format specification. This is a minimal but valid PDF document that can be opened in any PDF viewer.'
        },
        {
          heading: 'Conclusion',
          text: 'This demonstrates a simple way to generate and download PDF documents directly from a React application without requiring external libraries.'
        }
      ],
      footer: `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`
    };

    // Create a minimal PDF document using PDF specification
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/Contents 5 0 R
>>
endobj

4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

5 0 obj
<<
/Length 1200
>>
stream
BT
/F1 18 Tf
50 750 Td
(${defaultContent.title}) Tj
0 -30 Td
/F1 14 Tf
(${defaultContent.subtitle}) Tj
0 -50 Td
/F1 12 Tf
(${defaultContent.sections[0].heading}) Tj
0 -20 Td
/F1 10 Tf
(${defaultContent.sections[0].text.substring(0, 80)}...) Tj
0 -30 Td
/F1 12 Tf
(${defaultContent.sections[1].heading}) Tj
0 -20 Td
/F1 10 Tf
(This PDF generator includes:) Tj
0 -15 Td
(• Automatic PDF creation) Tj
0 -15 Td
(• Custom content support) Tj
0 -15 Td
(• Download functionality) Tj
0 -15 Td
(• Error handling) Tj
0 -30 Td
/F1 12 Tf
(${defaultContent.sections[2].heading}) Tj
0 -20 Td
/F1 10 Tf
(The PDF is created using standard PDF format) Tj
0 -15 Td
(specification for maximum compatibility.) Tj
0 -30 Td
/F1 12 Tf
(${defaultContent.sections[3].heading}) Tj
0 -20 Td
/F1 10 Tf
(This demonstrates PDF generation directly) Tj
0 -15 Td
(from a React application.) Tj
0 -50 Td
/F1 8 Tf
(${defaultContent.footer}) Tj
ET
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000074 00000 n 
0000000131 00000 n 
0000000244 00000 n 
0000000317 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
1570
%%EOF`;

    return pdfContent;
  };

  const generateAndDownloadPdf = async () => {
    try {
      setDownloadStatus('generating');
      setError(null);

      // Create the PDF content
      const pdfContent = createSamplePdf();
      
      // Create blob with PDF content
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      setDownloadStatus('success');
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setError(err.message);
      setDownloadStatus('error');
    }
  };

  // Auto-generate and download on component mount
  useEffect(() => {
    if (autoDownload) {
      generateAndDownloadPdf();
    }
  }, [autoDownload]);

  const getStatusIcon = () => {
    switch (downloadStatus) {
      case 'generating':
        return <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (downloadStatus) {
      case 'generating':
        return 'Generating PDF...';
      case 'success':
        return 'PDF generated and downloaded successfully';
      case 'error':
        return `Generation failed: ${error}`;
      default:
        return 'Ready to generate PDF';
    }
  };

  const getStatusColor = () => {
    switch (downloadStatus) {
      case 'generating':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          {getStatusIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          PDF Generator
        </h3>
        
        <p className={`text-sm mb-4 ${getStatusColor()}`}>
          {getStatusText()}
        </p>
        
        <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
          <div><strong>File name:</strong> {fileName}</div>
          <div><strong>Document title:</strong> {documentTitle}</div>
          <div><strong>Auto-download:</strong> {autoDownload ? 'Enabled' : 'Disabled'}</div>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={generateAndDownloadPdf}
            disabled={downloadStatus === 'generating'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            {downloadStatus === 'generating' ? 'Generating...' : 'Generate & Download PDF'}
          </button>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



export default TwilioPdfDownloader;