import { useState, useCallback } from 'react';

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const withLoading = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      const result = await promise;
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    withLoading
  };
};