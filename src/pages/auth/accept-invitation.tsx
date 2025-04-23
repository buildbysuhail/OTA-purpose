import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Urls from '../../redux/urls';

const AcceptInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Processing your invitation...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    localStorage.setItem("_token", token??"") ;
    if (!userId || !email || !token) {
      setMessage('Invalid invitation link.');
      setIsLoading(false);
      return;
    }

    const decodedEmail = decodeURIComponent(email);

    const acceptInvitation = async () => {
      try {

        const response = await axios.post(Urls.accept_link, {
          userId: parseInt(userId),
          email: email,
          token: token
        });

        if (response.data.success) {
          setMessage('Invitation accepted successfully!');
        } else {
          setMessage(response.data.message || 'Failed to accept invitation.');
        }
      } catch (error: any) {
        setMessage(error?.response?.data?.message || 'An error occurred while accepting the invitation.');
      } finally {
        setIsLoading(false);
      }
    };

    acceptInvitation();
  }, [searchParams]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      {isLoading ? <p>Loading...</p> : <p>{message}</p>}
    </div>
  );
};

export default AcceptInvitation;
