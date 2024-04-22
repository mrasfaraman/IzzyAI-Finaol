import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {useCameraDevice, Camera} from 'react-native-vision-camera';
import BaseURL from '../components/ApiCreds';
import {Dialog} from '@rneui/themed';
import {useDataContext} from '../contexts/DataContext';

const FaceAuthenticationScreen = ({navigation, route}: any) => {
  const cameraRef = useRef(null);
  // ...
  const {userId} = useDataContext();

  const [isFace, setIsFace] = useState<boolean>();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const device = useCameraDevice('front');
  const [capturedImg, setCapturedImg] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [hack, doHack] = useState(0);
  const width = Dimensions.get('screen').width;

  const newCameraInit = () => {
    setTimeout(() => {
      doHack(1);
    }, 100);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const image = await cameraRef.current.takePhoto({quality: 1});

      console.log(image);
      setCapturedImg('file://' + image.path);

      // Send the image to your API endpoint for face recognition
      detectFace(image);
    }
  };

  const navigate = () => {
    setShowAlert(false);
    navigation.push('waitverifyingnew', {
      ...route.params,
      capturedImg: capturedImg,
    });
  };

  const detectFace = async image => {
    const formData = new FormData();

    formData.append('file', {
      uri: 'file://' + image.path,
      type: 'image/jpeg',
      name: 'face.jpg',
    });

    setIsLoading(true);
    setShowAlert(true);

    try {
      const response = await fetch(BaseURL + '/detect_faces', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data', ///
        },
      });
      const data = await response.json();
      if (data) {
        const detected = data.message === 'No face detected.' ? false : true;
        setIsFace(detected);
        setAlertMsg(
          detected ? 'Face detected!' : 'Face not detected\nPlease try again.',
        );
        setIsLoading(false);
      }
      console.log('Retuned', data);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Face Recognition</Text>
      <Text style={styles.promptText}>
        Please position your face within the frame and tap to capture.
      </Text>

      <Dialog isVisible={showAlert}>
        {isLoading ? (
          <Dialog.Loading />
        ) : (
          <>
            <Dialog.Title title={alertMsg} titleStyle={{color: 'black'}} />
            <Dialog.Actions>
              {isFace ? (
                <Dialog.Button title="Continue" onPress={() => navigate()} />
              ) : (
                <Dialog.Button
                  title="Retry"
                  onPress={() => setShowAlert(false)}
                />
              )}
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      <View style={styles.cameraView}>
        <Camera
          ref={cameraRef}
          style={[StyleSheet.absoluteFill, {width: width + hack}]}
          photo={true}
          isActive={true}
          device={device}
          enableHighQualityPhotos
          onInitialized={() => newCameraInit()}
          zoom={0}
          orientation="portrait"
        />
      </View>
      <View style={styles.captureButtonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <Text style={styles.captureButtonText}>Take Picture</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111920',
  },
  title: {
    color: 'white',
    fontWeight: '600',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
  },
  promptText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
  },
  cameraView: {
    height: 400,
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  captureButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 15,
  },
  captureButtonText: {
    fontSize: 16,
    color: 'black',
  },
});

export default FaceAuthenticationScreen;
