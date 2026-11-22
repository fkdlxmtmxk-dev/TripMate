
import React, { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  // 로그인 없는 게스트 모드
  const user = null;
  const isAuthenticated = true;

  const logout = () => {
    // 로그인 기능을 사용하지 않으므로 별도 처리 없음
  };

  const navigateToLogin = () => {
    // 로그인 기능을 사용하지 않음
  };

  const checkUserAuth = async () => {};
  const checkAppState = async () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth: false,
        isLoadingPublicSettings: false,
        authError: null,
        appPublicSettings: null,
        authChecked: true,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
