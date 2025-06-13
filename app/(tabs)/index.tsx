import { Link, Stack } from 'expo-router';

import { CircleCheckBig } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { isProfileCompleted } from '~/actions/lib';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { useStore } from '~/store/store';
function Home() {
  const { profile } = useStore();
  return (
    <>
      <Stack.Screen options={{ title: 'Ev' }} />
      <View style={styles.container}>
        {!isProfileCompleted(profile) && (
          <Alert icon={CircleCheckBig} className="mb-4 max-w-xl">
            <AlertTitle>Hesabını onayla!</AlertTitle>
            <AlertDescription>
              Uygulamayı tam anlamıyla kullanabilmek için hesabını onaylaman gerekiyor.
            </AlertDescription>
            <AlertDescription>
              <Link
                href="/profile/registration-flow"
                className="text-right font-bold text-blue-500">
                Hesabını onayla
              </Link>
            </AlertDescription>
          </Alert>
        )}
        <Text>Ana Sayfa</Text>
      </View>
    </>
  );
}
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
