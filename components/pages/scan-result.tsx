import { router } from 'expo-router';
import { ParseResult } from 'mrz';
import { useEffect, useState } from 'react';

import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import SubmitButton from '~/components/custom/Button.Submit';

const deviceWidth = Dimensions.get('window').width;

function ScanResult({ parseResult, image }: { parseResult: ParseResult; image: string }) {
  const [ratio, setRatio] = useState<number | null>(null);
  useEffect(() => {
    Image.getSize(image, (width, height) => {
      setRatio(width / height);
    });
  }, []);

  if (!ratio) {
    return <ActivityIndicator />;
  }
  async function onSubmit() {
    router.back();
  }
  return (
    <>
      <ScrollView style={styles.container}>
        <View>
          <Image
            source={{ uri: image }}
            style={{
              width: deviceWidth - 40,
              aspectRatio: ratio,
              resizeMode: 'contain',
            }}
          />
          {parseResult.details.map((detail) => {
            return (
              <View className="mt-3 flex flex-row gap-4" key={detail.label}>
                <Text className="font-bold">{detail.label}:</Text>
                <Text>{detail.value}</Text>
              </View>
            );
          })}

          <View className="mt-4">
            <SubmitButton icon={'arrow-forward'} iconColor="white" onSubmit={onSubmit}>
              Profili Kaydet
            </SubmitButton>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
export default ScanResult;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
