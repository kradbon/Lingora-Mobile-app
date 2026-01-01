import './src/shims/platformConstants';
import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthProvider';
import NavRoot from './src/navigation';
import { I18nProvider } from './src/i18n';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nProvider>
        <AuthProvider>
          <NavRoot />
        </AuthProvider>
      </I18nProvider>
    </GestureHandlerRootView>
  );
}
