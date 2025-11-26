import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { CartProvider } from './context/CartContext';
import { ImageProvider } from './context/ImageContext';
import Routes from './pages/Home';
import AuthStack from './routes/AuthStack';

function AppRoutes() {
  const { user } = useAuth();

  // Se o usuário estiver logado, renderiza as telas principais com todos os providers necessários.
  if (user) {
    return (
      <InventoryProvider>
        <CartProvider>
          <ImageProvider>
            <Routes />
          </ImageProvider>
        </CartProvider>
      </InventoryProvider>
    );
  }

  // Se não houver usuário, renderiza as telas de autenticação.
  return <AuthStack />;
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </NavigationContainer>
  );
}
