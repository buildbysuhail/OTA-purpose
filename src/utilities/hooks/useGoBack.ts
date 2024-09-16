import { useNavigate, useLocation } from 'react-router-dom';

const useGoBack = (fallbackUrl = '/') => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    debugger;
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate(fallbackUrl);
    }
  };

  return goBack;
};

export default useGoBack;