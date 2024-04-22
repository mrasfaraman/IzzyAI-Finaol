import React, {useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BaseURL from '../components/ApiCreds';
import {Dialog} from '@rneui/themed';
import {useDataContext} from '../contexts/DataContext';

function WaitVerifyingNew({navigation, route}: any) {
  const {capturedImg} = route.params;
  const [showAlert, setShowAlert] = React.useState(false);
  const alertMsg = 'Retry! Something wrong with your face!';

  const {userId} = useDataContext();
  console.log(userId);

  useEffect(() => {
    const sendImageToServer = async image => {
      const formData = new FormData();
      console.log('image__', image);
      formData.append('UserID', userId);
      formData.append('FaceSnapshot', {
        uri: image,
        type: 'image/jpeg',
        name: 'face.jpg',
      });

      console.log('formData__', formData);

      const response = await fetch(BaseURL + '/add_face_authentication', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      console.log('data__', data);
      if (data.FaceAuthId) {
        navigation.navigate(route.params.routeName,{
          ...route.params
        });
      } else {
        setShowAlert(true);
      }
    };

    if (capturedImg) {
      sendImageToServer(capturedImg);
    }
  }, []);

  const navigateBack = () => {
    setShowAlert(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Dialog isVisible={showAlert}>
              <Dialog.Title title={alertMsg} titleStyle={{color: 'black'}} />
              <Dialog.Actions>
                <Dialog.Button title="Retry" onPress={() => navigateBack()} />
              </Dialog.Actions>
            </Dialog>
            <ActivityIndicator size={100} color="skyblue" />
            <Text style={styles.text}>Please wait, we're verifying</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'SF-Pro-Display-Regular, sans-serif',
    color: '#111920',
    // color: '#000',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 30,
    fontWeight: 'bold',
  },
  faceIcon: {
    width: 100,
    height: 100,
  },
});

export default WaitVerifyingNew;
