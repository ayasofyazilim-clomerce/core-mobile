import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import QRCodeStyled from 'react-native-qrcode-styled';
import { useStore } from '~/store/store';

export default function QRModal({
  setModalVisible,
}: {
  setModalVisible: (visible: boolean) => void;
}) {
  const { profile } = useStore();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      bottomSheetModalRef.current?.close();
      setModalVisible(false);
    }
  }, []);
  useEffect(() => {
    handlePresentModalPress();
  }, []);
  return (
    <GestureHandlerRootView style={styles.sheetContainer}>
      <StatusBar style="dark" backgroundColor="#00000090" />
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          onDismiss={() => setModalVisible(false)}
          snapPoints={[262]}>
          <BottomSheetView style={styles.contentContainer}>
            <QRCodeStyled data={profile?.userName || ''} pieceSize={6} />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#00000090',
    zIndex: 99,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 112,
  },
});
