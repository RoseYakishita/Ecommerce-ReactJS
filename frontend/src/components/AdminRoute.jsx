import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../store/useStore';

export default function AdminRoute() {
  const { user, token } = useStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Assuming UserRole.ADMIN is 'ADMIN'
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-textMain px-4 text-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">403 Forbidden</h1>
          <p className="mb-6">You do not have administrative privileges to view this page.</p>
          <a href="/" className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
