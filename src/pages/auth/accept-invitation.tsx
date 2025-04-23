import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Urls from '../../redux/urls';
import { handleLoginSuccess } from '../../utilities/handles-login-success-utils';
import { APIClient } from '../../helpers/api-client';
import { useAppDispatch } from '../../utilities/hooks/useAppDispatch';
import { modelToBase64 } from '../../utilities/jsonConverter';
import { setApplicationSettings } from '../../redux/slices/app/application-settings-reducer';

const api = new APIClient();
const AcceptInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Processing your invitation...');
  const [isLoading, setIsLoading] = useState(true);

  
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const [error, setError] = useState<any>();
    const [counterSettings, setCounterSettings] = useState<{
      show: boolean;
      token: string;
    }>({ show: false, token: "" });
    if (!userId || !email || !token) {
      setMessage('Invalid invitation link.');
      setIsLoading(false);
      return;
    }
    useEffect(() => {
      const acceptInvitation = async () => {
        try {
  
          const response = await api.postAsync(Urls.accept_link, {
            userId: parseInt(userId),
            email: email,
            token: token
          });
  debugger
          if (response.isOk == true) {
                  await handleLoginSuccess(
                    response,
                    dispatch,
                    load,
                    setIsLoggedToBranch,
                    setHasToChooseBranch
                  );
                  
                } else {
                  if (response.item.hasToSetCounter) {
                    localStorage.setItem("_token", response.item.token);
                    setCounterSettings({ show: true, token: response.item.token });
                  } else {
                    setError(response.message);
                  }
                }
        } catch (error: any) {
          setMessage(error?.response?.data?.message || 'An error occurred while accepting the invitation.');
        } finally {
          setIsLoading(false);
        }
      };
  
      acceptInvitation();
    }, [searchParams]);
    const decodedEmail = decodeURIComponent(email);
    const navigate = useNavigate();
    const [hasToChooseBranch, setHasToChooseBranch] = useState(false);
    const [isLoggedToBranch, setIsLoggedToBranch] = useState(false);
      const dispatch = useAppDispatch();
      const load = async () => {
        const settings = await api.getAsync(Urls.application_setting);
        localStorage.setItem('as', modelToBase64(settings))
        dispatch(setApplicationSettings(
          {
            ...settings,
            apiLoaded: true
          }));
      }
      useEffect(() => {
        if (isLoggedToBranch) {
          navigate("/");
        } else if (hasToChooseBranch) {
          navigate("/select-organization");
        }
      }, [hasToChooseBranch, isLoggedToBranch]);
    

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      {isLoading && ! error && <p>Loading...</p>}
      {!isLoading && ! error && <p>{message}</p>}
      {error&& <p>{error}</p>}
    </div>
  );
};

export default AcceptInvitation;
