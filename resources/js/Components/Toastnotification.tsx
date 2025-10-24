import { Toaster } from 'react-hot-toast';

export default function ToastNotification() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: 'white',
          color: '#374151',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          maxWidth: '500px',
        },
        // Success
        success: {
          duration: 3000,
          style: {
            background: '#10b981',
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#10b981',
          },
        },
        // Error
        error: {
          duration: 4000,
          style: {
            background: '#ef4444',
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#ef4444',
          },
        },
        // Loading
        loading: {
          style: {
            background: '#3b82f6',
            color: 'white',
          },
        },
      }}
    />
  );
}

// Dark mode styles (you can add these to your global CSS or handle with className)
export const darkModeToastStyles = {
  style: {
    background: '#1f2937',
    color: '#f3f4f6',
  },
  success: {
    style: {
      background: '#059669',
    },
  },
  error: {
    style: {
      background: '#dc2626',
    },
  },
};