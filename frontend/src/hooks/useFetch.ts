import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseFetchOptions {
  skip?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useFetch = <T,>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseFetchOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      options.onError?.(axiosError);
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, options]);

  useEffect(() => {
    if (options.skip) return;
    execute();
  }, dependencies);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
};
