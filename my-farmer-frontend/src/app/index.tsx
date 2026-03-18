import { SafeAreaView } from 'react-native-safe-area-context';

import NavBar from '@/components/navBar';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavBar />
    </SafeAreaView>
  );
}

