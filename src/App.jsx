import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#033A4E',
            color: '#BFDBF7',
            border: '1px solid rgba(116, 69, 119, 0.3)',
            borderRadius: '14px',
            fontSize: '14px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: { primary: '#E1E5F2', secondary: '#022B3A' },
          },
          error: {
            iconTheme: { primary: '#1F7A8C', secondary: '#BFDBF7' },
          },
        }}
      />
    </AppProvider>
  );
}
