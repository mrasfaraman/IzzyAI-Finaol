import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { PermissionsAndroid } from 'react-native';

const Games = ({ route }) => {
  const { url } = route.params;

  useEffect(() => {
    const requestAudioPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Permission',
            message: 'App needs access to your microphone for recording audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Audio permission granted');
        } else {
          console.log('Audio permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestAudioPermission();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webView}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsFullscreenVideo={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error: ', nativeEvent);
        }}
        onLoad={() => {
          // Load event, you can use it if you need to perform actions when WebView is loaded
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default Games;
