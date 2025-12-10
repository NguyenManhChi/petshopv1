import React from 'react';
import { useAuth } from './custom-hooks/useAuth';
import LoginModal from './Compoments/LoginModal';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '40px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <LoginModal open={true} onClose={() => {}} />;
  }
  return children;
};

export default RequireAuth;