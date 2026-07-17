import { useCallback, useRef, useState } from 'react';
import { TextInput } from 'react-native';

// 🔥 ENHANCED REAL-TIME VALIDATION HOOK
// Real-time onChange validation + auto-focus on error

export interface ValidationRule {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: string) => string | undefined;
}

export interface FormField<T> {
  name: keyof T;
  rules?: ValidationRule;
  // Allow nullable refs created via `useRef` (MutableRefObject) or `createRef` (RefObject)
  ref?: React.RefObject<TextInput | null> | React.MutableRefObject<TextInput | null>;
}

interface UseFormValidationProps<T extends Record<string, string>> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean; // 🔥 NEW: Enable real-time validation
}

export function useFormValidation<T extends Record<string, string>>({
  initialValues,
  onSubmit,
  validateOnChange = true, // 🔥 Default: Real-time validation ON
}: UseFormValidationProps<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔥 NEW: Loading state

  // Store field refs and validation rules
  // Store refs that may be nullable (current can be TextInput | null)
  // Accept both RefObject and MutableRefObject so `useRef` return values are compatible
  const fieldRefs = useRef<
    Map<keyof T, React.RefObject<TextInput | null> | React.MutableRefObject<TextInput | null>>
  >(new Map());
  const validationRules = useRef<Map<keyof T, ValidationRule>>(new Map());

  // Register field with ref and validation rules
  const registerField = useCallback((field: FormField<T>) => {
    if (field.ref) {
      fieldRefs.current.set(field.name, field.ref);
    }
    if (field.rules) {
      validationRules.current.set(field.name, field.rules);
    }
  }, []);

  // Validate single field
  const validateField = useCallback((name: keyof T, value: string): string | undefined => {
    const rules = validationRules.current.get(name);
    if (!rules) return undefined;

    // Required check
    if (rules.required) {
      if (!value || value.trim() === '') {
        return typeof rules.required === 'string' ? rules.required : `${String(name)} is required`;
      }
    }

    // If field is empty and not required, skip other validations
    if (!value && !rules.required) return undefined;

    // Min length check
    if (rules.minLength && value.length < rules.minLength.value) {
      return rules.minLength.message;
    }

    // Max length check
    if (rules.maxLength && value.length > rules.maxLength.value) {
      return rules.maxLength.message;
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }

    // Custom validation
    if (rules.validate) {
      return rules.validate(value);
    }

    return undefined;
  }, []);

  // 🔥 ENHANCED onChange handler with REAL-TIME validation
  const handleChange = useCallback(
    (name: keyof T) => (text: string) => {
      setFormData((prev) => ({ ...prev, [name]: text }));

      // 🔥 Real-time validation on EVERY keystroke (if enabled and field touched)
      if (validateOnChange && touched[name]) {
        const error = validateField(name, text);
        setErrors((prev) => {
          if (error) {
            return { ...prev, [name]: error };
          } else {
            // 🔥 Clear error immediately when valid
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          }
        });
      }
    },
    [touched, validateField, validateOnChange]
  );

  // Handle field blur - mark as touched + validate
  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate on blur
      const error = validateField(name, formData[name]);
      setErrors((prev) => {
        if (error) {
          return { ...prev, [name]: error };
        } else {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        }
      });
    },
    [formData, validateField]
  );

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    // 🔥 AUTO-FOCUS on first error field
    if (!isValid) {
      const firstErrorField = Object.keys(newErrors)[0] as keyof T;
      const inputRef = fieldRefs.current.get(firstErrorField);
      if (inputRef?.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }

    return isValid;
  }, [formData, validateField]);

  // Handle form submit with loading state
  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof T, boolean>
    );
    setTouched(allTouched);

    const isValid = validateAll();

    if (isValid) {
      setIsSubmitting(true); // 🔥 Start loading
      try {
        await onSubmit(formData);
      } catch (error) {
        // Error handling done in onSubmit callback
      } finally {
        setIsSubmitting(false); // 🔥 Stop loading
      }
    }
  }, [formData, validateAll, onSubmit]);

  // Reset form
  const reset = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // 🔥 Set specific field error (for server-side errors)
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Auto-focus on error field
    const inputRef = fieldRefs.current.get(name);
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  // 🔥 Set multiple field errors at once
  const setFieldErrors = useCallback((fieldErrors: Partial<Record<keyof T, string>>) => {
    setErrors((prev) => ({ ...prev, ...fieldErrors }));
    const touchedFields = Object.keys(fieldErrors).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof T, boolean>
    );
    setTouched((prev) => ({ ...prev, ...touchedFields }));

    // Auto-focus on first error field
    const firstErrorField = Object.keys(fieldErrors)[0] as keyof T;
    const inputRef = fieldRefs.current.get(firstErrorField);
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, []);

  return {
    formData,
    errors,
    touched,
    isSubmitting, // 🔥 NEW: Loading state
    handleChange,
    handleBlur,
    handleSubmit,
    registerField,
    setFieldError,
    setFieldErrors, // 🔥 NEW: Set multiple errors
    reset,
  };
}

// 🔥 PRE-DEFINED VALIDATION RULES
export const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
      message: 'Invalid email format',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
  },
  code: {
    required: 'Verification code is required',
    minLength: {
      value: 6,
      message: 'Code must be 6 digits',
    },
    maxLength: {
      value: 6,
      message: 'Code must be 6 digits',
    },
    pattern: {
      value: /^[0-9]{6}$/,
      message: 'Code must be 6 digits',
    },
  },
  required: (fieldName = 'This field') => ({
    required: `${fieldName} is required`,
  }),
  minLength: (length: number, fieldName = 'This field') => ({
    minLength: {
      value: length,
      message: `${fieldName} must be at least ${length} characters`,
    },
  }),
  maxLength: (length: number, fieldName = 'This field') => ({
    maxLength: {
      value: length,
      message: `${fieldName} must not exceed ${length} characters`,
    },
  }),
  numeric: {
    pattern: {
      value: /^[0-9]+$/,
      message: 'Only numbers are allowed',
    },
  },
};
