import { useState, useCallback } from 'react';
import { EmailValidationResult } from '@/lib/email/types';

interface ValidationState {
  results: { [email: string]: EmailValidationResult };
  loading: Set<string>;
  errors: { [email: string]: string };
}

export const useEmailValidation = () => {
  const [state, setState] = useState<ValidationState>({
    results: {},
    loading: new Set(),
    errors: {}
  });

  const validateEmail = useCallback(async (email: string) => {
    if (!email.trim()) return;

    setState(prev => ({
      ...prev,
      loading: new Set(prev.loading).add(email),
      errors: { ...prev.errors, [email]: '' }
    }));

    try {
      const response = await fetch('/api/email/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          enableDnsCheck: true,
          useExternalService: false 
        })
      });

      if (!response.ok) {
        throw new Error('Validation failed');
      }

      const { data } = await response.json();

      setState(prev => ({
        ...prev,
        results: { ...prev.results, [email]: data },
        loading: new Set([...prev.loading].filter(e => e !== email))
      }));

      return data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, [email]: 'Validation failed' },
        loading: new Set([...prev.loading].filter(e => e !== email))
      }));
    }
  }, []);

  const validateBatch = useCallback(async (emails: string[]) => {
    const validEmails = emails.filter(email => email.trim());
    
    setState(prev => ({
      ...prev,
      loading: new Set([...prev.loading, ...validEmails])
    }));

    try {
      const response = await fetch('/api/email/validate/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          emails: validEmails,
          options: {
            enableDnsCheck: true,
            checkDisposable: true,
            checkRoleBased: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Batch validation failed');
      }

      const { data } = await response.json();

      const newResults = data.results.reduce((acc: any, result: EmailValidationResult) => {
        acc[result.email] = result;
        return acc;
      }, {});

      setState(prev => ({
        ...prev,
        results: { ...prev.results, ...newResults },
        loading: new Set([...prev.loading].filter(e => !validEmails.includes(e)))
      }));

      return data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: new Set([...prev.loading].filter(e => !validEmails.includes(e)))
      }));
    }
  }, []);

  const clearValidation = useCallback((email?: string) => {
    if (email) {
      setState(prev => {
        const newResults = { ...prev.results };
        const newErrors = { ...prev.errors };
        delete newResults[email];
        delete newErrors[email];
        return {
          ...prev,
          results: newResults,
          errors: newErrors
        };
      });
    } else {
      setState({
        results: {},
        loading: new Set(),
        errors: {}
      });
    }
  }, []);

  // Update your useEmailValidation hook
const validateWithFreeService = useCallback(async (email: string, service?: string) => {
  if (!email.trim()) return;

  setState(prev => ({
    ...prev,
    loading: new Set(prev.loading).add(email),
    errors: { ...prev.errors, [email]: '' }
  }));

  try {
    const response = await fetch('/api/email/verification-services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        service,
        enableAdvancedChecks: true 
      })
    });

    if (!response.ok) {
      throw new Error('Free validation failed');
    }

    const { data } = await response.json();

    setState(prev => ({
      ...prev,
      results: { ...prev.results, [email]: data },
      loading: new Set([...prev.loading].filter(e => e !== email))
    }));

    return data;
  } catch (error) {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [email]: 'Free validation failed' },
      loading: new Set([...prev.loading].filter(e => e !== email))
    }));
  }
}, []);

  return {
    results: state.results,
    loading: state.loading,
    errors: state.errors,
    validateEmail,
    validateBatch,
    clearValidation,
    validateWithFreeService
  };
};