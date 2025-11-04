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

const TwilioPdfDownloader = ({ 
  fileName = 'document.pdf',
  apiEndpoint = 'https://your-api-endpoint.com/api/download', // Replace with your actual API endpoint
  autoDownload = true
}) => {
  const api = new APIClient();
     const { directPrint } = useDirectPrint();
  const location = useLocation();
  const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, fetching, generating, success, error
  const [error, setError] = useState("null");
  const [token, setToken] = useState("");
   
  // Extract token from query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      console.log('Token extracted from URL:', tokenFromUrl);
    } else {
      setError('No token found in URL parameters');
      setDownloadStatus('error');
    }
  }, [location.search]);

  // Main function to fetch and download PDF
  const generateAndDownloadPdf = async (token:string) => {
    if (!token) {
      setError('No token available');
      setDownloadStatus('error');
      return;
    }

    try {
      setDownloadStatus('fetching');
      setError("");
      // Call API to get PDF data
       const Data= await fetchDefaultTemplateFromToken(token);
     if(Data){
      debugger;
       const Template =Data?.template;
        await directPrint({isDirectDownload:true ,template: Template,data:Data,})
    }
     
      setDownloadStatus('generating')
      setDownloadStatus('success');
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setError(err.message);
      setDownloadStatus('error');
    }
  };

  // Auto-download when token is available
  useEffect(() => {
    debugger;
    if ( token ) {
      generateAndDownloadPdf(token);
    }
  }, [token]);

  const getStatusIcon = () => {
    switch (downloadStatus) {
      case 'fetching':
      case 'generating':
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
        return 'Fetching PDF data from server...';
      case 'generating':
        return 'Preparing download...';
      case 'success':
        return 'PDF downloaded successfully!';
      case 'error':
        return `Error: ${error}`;
      default:
        return 'Ready to download PDF';
    }
  };

  const getStatusColor = () => {
    switch (downloadStatus) {
      case 'fetching':
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
              <span className="text-gray-600">Auto-download:</span>
              <span className="font-medium text-gray-900">
                {autoDownload ? 'Enabled' : 'Disabled'}
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
            onClick={()=>generateAndDownloadPdf(token)}
            disabled={!token || downloadStatus === 'fetching' || downloadStatus === 'generating'}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg"
          >
            {downloadStatus === 'fetching' || downloadStatus === 'generating' ? (
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

