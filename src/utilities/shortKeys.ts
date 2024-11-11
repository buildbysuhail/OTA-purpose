import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const PopupShortKey = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'b') {
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dispatch]);

    return null;
};

export default PopupShortKey;