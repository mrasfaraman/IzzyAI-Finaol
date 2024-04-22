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
import RNFetchBlob from 'rn-fetch-blob';
import {useDataContext} from '../contexts/DataContext';

const FaceAuthenticationScreenMain = ({navigation, route}: any) => {
  const cameraRef = useRef(null);
  // // ...
  const {userId} = useDataContext();
  console.log(userId);

  const [isFace, setIsFace] = useState<boolean>();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [originalImg, setOriginalImg] = useState(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BaseURL}/get_face_authentication/${userId}`,
        );
        const data = await response.json();
        console.log('data: ', data);
        // Assuming the API response contains the image URL in 'imageUrl' field
        if (data) {
          console.log('data: ', data[0]);
          setImageUrl(data[0].FaceSnapshotURL);
          saveImageToCache(data[0].FaceSnapshotURL);
        }
      } catch (error) {
        console.error('Error fetching image URL:', error);
      }
    };

    fetchData();
  }, []);

  const saveImageToCache = async originalUrl => {
    try {
      const {config, fs} = RNFetchBlob;
      const {CacheDir} = fs.dirs;

      // Get the file extension from the URL
      const parts = originalUrl.split('/');
      // Generate a unique filename for the image
      const filename = parts[parts.length - 1];
      console.log(filename);

      // Download the image and save it to the cache
      const cachedFile = await config({
        fileCache: true,
        path: `${CacheDir}/${filename}`,
      }).fetch('GET', originalUrl);

      console.log('Image saved to cache:', cachedFile.path());
      setOriginalImg('file://' + cachedFile.path());
    } catch (error) {
      console.error('Error saving image:', error);
    }
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

  const detectFace = async image => {
    const formData = new FormData();

    formData.append('file', {
      uri: 'file://' + image.path,
      type: 'image/jpeg',
      name: 'face.jpg',
    });

    try {
      setIsLoading(true);
      setShowAlert(true);
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

  const navigate = () => {
    setShowAlert(false);
    navigation.push('waitverifying', {
      ...route.params,
      originalImg: originalImg,
      capturedImg: capturedImg,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Face Authentication</Text>
      <Text style={styles.promptText}>
        Please take a picture of your face to authenticate yourself
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
          onInitialized={() => newCameraInit()}
          enableHighQualityPhotos
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

export default FaceAuthenticationScreenMain;
