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

function WaitVerifying({navigation, route}: any) {
  const {originalImg, capturedImg} = route.params;
  const [showAlert, setShowAlert] = React.useState(false);
  const alertMsg = 'You are not the authenticated user!';

  const {userId} = useDataContext();
  console.log(userId);

  useEffect(() => {
    const authenticateImagesToServer = async () => {
      const formData = new FormData();
      console.log('Original: ', originalImg);
      console.log('Captured: ', capturedImg);

      formData.append('user_id', userId);

      formData.append('file2', {
        uri: capturedImg,
        name: 'image2.jpg',
        type: 'image/jpg',
      });

      formData.append('file1', {
        uri: originalImg,
        name: 'image1.jpg',
        type: 'image/jpg',
      });

      try {
        const response = await fetch(BaseURL + '/authenticate', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Response__: ', response);

        if (response.status === 200) {
          const data = await response.json();
          const isAuth =
            data.message === 'You are not authenticated' ? false : true;
          if (isAuth) {
            navigate();
          }
          setShowAlert(!isAuth);
          console.log(data);
          // Clear image states after successful upload
        } else {
          console.log('Error uploading images');
          setShowAlert(true);
        }
      } catch (error) {
        console.error('Error: ', error);
      }
    };

    if (capturedImg && originalImg) {
      authenticateImagesToServer();
    }
  }, []);

  const navigate = () => {
    navigation.navigate(route.params.routeName, {
      ...route.params,
    });
  };

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

export default WaitVerifying;
