/*eslint-disable*/
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const fallbackTitle = `GNX Web Portal`;

const useDocumentTitle = (title) => {
    const { pathname } = useLocation();
    useEffect(() => {
        try {
            document.title = title;
        } catch (error) {
            document.title = fallbackTitle;
        }
        return () => {
            document.title = fallbackTitle;
        };
    }, [pathname]);
};

export default useDocumentTitle;
/*eslint-enable*/
