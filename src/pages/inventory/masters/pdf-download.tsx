import React, { useEffect, useState } from 'react';
import { Download, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Urls from '../../../redux/urls';
import { APIClient } from '../../../helpers/api-client';
import { t } from 'i18next';
import { fetchDefaultTemplateFromApi, fetchDefaultTemplateFromToken } from '../../use-print';
import { useCommenPrint } from '../../transaction-base/use-commen-print';
import { useDirectPrint } from '../../../utilities/hooks/use-direct-print';
import { de } from 'date-fns/locale';
import { handleResponse } from '../../../utilities/HandleResponse';

interface TwilioPdfDownloaderProps {
  fileName?: string;
  autoDownload?: boolean;
  mode?: 'twilio' | 'browser';
}

const TwilioPdfDownloader: React.FC<TwilioPdfDownloaderProps> = ({ 
  fileName = 'document.pdf',
  autoDownload = true,
  mode='twilio',
}) => {
   const api = new APIClient();
  const { directPrint } = useDirectPrint();
  const location = useLocation();
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'fetching' | 'generating' | 'converting' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isTwilioMode, setIsTwilioMode] = useState(false);
   
  // Extract token and detect mode
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setIsTwilioMode(mode === 'twilio');
      console.log('Token extracted:', tokenFromUrl);
      console.log('Twilio mode:', mode === 'twilio');
    } else {
      setError('No token found in URL parameters');
      setDownloadStatus('error');
    }
  }, [location.search]);

  // Main function to generate and process PDF
  const generateAndProcessPdf = async (token: string) => {
    if (!token) {
      setError('No token available');
      setDownloadStatus('error');
      return;
    }

    try {
      setDownloadStatus('fetching');
      setError('');

      // Step 1: Fetch template and data from YOUR MAIN SERVER
      // This validates the token and retrieves data
      const Data = await fetchDefaultTemplateFromToken(token);
      
      if (!Data) {
        setDownloadStatus('error');
        setError('No data received from server');
        return;
      }

      setDownloadStatus('generating');
      const { template, data } = Data;

      // Step 2: Generate PDF in browser (client-side)
      const pdfBlob =  await directPrint({isDirectDownload:true ,template,data,})
      const pdfFileName = `${template?.templateGroup || 'document'}.pdf`;
      setDownloadStatus('converting');
      // Step 3: Convert to Base64
      const base64String = await blobToBase64(pdfBlob);

      // Step 4: Handle based on mode
      if (isTwilioMode) {
        // For Twilio: Send Base64 to WEBHOOK (not main server)
        setDownloadStatus('sending');
        await sendToTwilioWebhook(token, base64String, pdfFileName);
      } else {
        // For Browser: Direct download
        downloadPdfToUser(pdfBlob, pdfFileName);
      }

      setDownloadStatus('success');

    } catch (err: any) {
      console.error('PDF processing error:', err);
      setError(err.message || 'An error occurred');
      setDownloadStatus('error');
    }
  };


const blobToBase64 = async (blob: Blob): Promise<string> => {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
};


  // Send Base64 to WEBHOOK (separate from main server)
  const sendToTwilioWebhook = async (token: string, pdfBase64: string, fileName: string) => {
    try {
      // IMPORTANT: This is a SEPARATE webhook endpoint
      // NOT your main server API
         const res = await api.postAsync(Urls.print_streme, {
            Base64 : pdfBase64,
            FileName : fileName
          });
        handleResponse(res);

    } catch (error: any) {
      console.error('Error sending to webhook:', error);
      throw error;
    }
  };

  // Download PDF to user's browser
  const downloadPdfToUser = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Auto-process when token is available
  useEffect(() => {
    if (token) {
      generateAndProcessPdf(token);
    }
  }, [token]);

  const getStatusIcon = () => {
    switch (downloadStatus) {
      case 'fetching':
      case 'generating':
      case 'converting':
      case 'sending':
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (downloadStatus) {
      case 'fetching':
        return 'Fetching PDF data...';
      case 'generating':
        return 'Generating PDF...';
      case 'converting':
        return 'Converting to Base64...';
      case 'sending':
        return 'Sending to WhatsApp...';
      case 'success':
        return isTwilioMode ? 'PDF sent to WhatsApp!' : 'PDF downloaded successfully!';
      case 'error':
        return `Error: ${error}`;
      default:
        return 'Ready to process PDF';
    }
  };

  const getStatusColor = () => {
    switch (downloadStatus) {
      case 'fetching':
      case 'generating':
      case 'converting':
      case 'sending':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Minimal UI for Twilio mode
  if (isTwilioMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4">
            {getStatusIcon()}
          </div>
          <p className={`text-lg font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          {downloadStatus === 'success' && (
            <p className="mt-2 text-sm text-gray-600">
              You can close this window
            </p>
          )}
        </div>
      </div>
    );
  }

  // Full UI for browser users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            {getStatusIcon()}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            PDF Downloader
          </h2>
          
          <p className={`text-base mb-6 ${getStatusColor()} font-medium`}>
            {getStatusText()}
          </p>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">File name:</span>
              <span className="font-medium text-gray-900">{fileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Token status:</span>
              <span className={`font-medium ${token ? 'text-green-600' : 'text-red-600'}`}>
                {token ? 'Valid' : 'Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mode:</span>
              <span className="font-medium text-gray-900">
                {isTwilioMode ? 'Twilio' : 'Browser'}
              </span>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-left">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-red-900">Error:</strong>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => generateAndProcessPdf(token)}
            disabled={!token || ['fetching', 'generating', 'converting', 'sending'].includes(downloadStatus)}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg"
          >
            {['fetching', 'generating', 'converting', 'sending'].includes(downloadStatus) ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download PDF
              </>
            )}
          </button>

          {downloadStatus === 'success' && (
            <p className="mt-4 text-sm text-gray-600">
              Your download should start automatically. If not, click the button above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwilioPdfDownloader;


