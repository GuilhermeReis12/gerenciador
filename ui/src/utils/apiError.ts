import { AxiosError } from 'axios';

export type ApiFieldErrors = Record<string, string>;

export type ParsedApiError = {
  message: string;
  fieldErrors: ApiFieldErrors;
  status?: number;
};

export function parseApiError(error: unknown): ParsedApiError {
  const fallback: ParsedApiError = {
    message: 'Ocorreu um erro inesperado.',
    fieldErrors: {}
  };

  if (!error || typeof error !== 'object') {
    return fallback;
  }

  const axiosError = error as AxiosError<Record<string, unknown> | string>;
  const status = axiosError.response?.status;
  const data = axiosError.response?.data;

  if (!data) {
    return {
      message: axiosError.message || fallback.message,
      fieldErrors: {},
      status
    };
  }

  if (typeof data === 'string') {
    return { message: data, fieldErrors: {}, status };
  }

  if (data.detail) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map(String).join(', ')
      : String(data.detail);
    return { message: detail, fieldErrors: {}, status };
  }

  const fieldErrors: ApiFieldErrors = {};
  const messages: string[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const msg = Array.isArray(value) ? value.map(String).join(', ') : String(value);
    if (key === 'non_field_errors') {
      messages.push(msg);
      return;
    }
    fieldErrors[key] = msg;
    messages.push(msg);
  });

  return {
    message: messages[0] || fallback.message,
    fieldErrors,
    status
  };
}

export function showApiError(
  error: unknown,
  toast: { error: (msg: string) => void }
): ApiFieldErrors {
  const parsed = parseApiError(error);
  toast.error(parsed.message);
  return parsed.fieldErrors;
}
