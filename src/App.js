import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { CartProvider } from './context/CartContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { ImageProvider } from './context/ImageContext';
import Routes from './pages/Home';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <InventoryProvider>
          <BookmarkProvider>
            <CartProvider>
              <ImageProvider>
                <Routes />
              </ImageProvider>
            </CartProvider>
          </BookmarkProvider>
        </InventoryProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
