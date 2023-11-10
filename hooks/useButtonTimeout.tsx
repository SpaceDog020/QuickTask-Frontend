import { useEffect } from 'react';

const useButtonTimeout = (callback: () => void, duration: number, isSubmitting: boolean) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isSubmitting) {
      // Execute the callback after the specified timeout duration
      timeoutId = setTimeout(() => {
        callback();
      }, duration);
    }

    // Clear the timeout when the component unmounts or when isSubmitting changes
    return () => clearTimeout(timeoutId);
  }, [callback, duration, isSubmitting]);
};

export default useButtonTimeout;
