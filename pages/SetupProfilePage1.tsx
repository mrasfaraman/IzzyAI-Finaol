import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import IzzyAILogo from '../assets/IzzyAILogo';
import BarFilled from '../assets/BarFilled';
import Bar from '../assets/Bar';
import {useDataContext} from '../contexts/DataContext';
import BaseURL from '../components/ApiCreds';

const CustomButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.button}>
      {props.loading ? (
        <ActivityIndicator color={'white'} size={26} />
      ) : (
        <Text style={styles.buttonText}>{props.title}</Text>
      )}
    </TouchableOpacity>
  );
};

function SetupProfilePage1({navigation, route}) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [gender, setGender] = useState('Male');
  const {userId} = useDataContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('User Data Back ', route.params);
    // Assuming the gender is passed as a parameter called 'gender'
    if (route.params?.gender) {
      setGender(route.params.gender);
    }
  }, [route.params?.gender]);

  const navigateNext = () => {
    if (true) {
      const formData = new FormData();
      setIsLoading(true);

      // Append data to FormData object
      formData.append('UserID', userId);
      formData.append('AvatarID', selectedAvatar);

      console.log('Body Data ---> ', formData);
      fetch(`${BaseURL}/update_avatar_id`, {
        method: 'PUT',
        headers: {},
        body: formData,
      })
        .then(response => {
          console.log('My result ===> ', response);
          setIsLoading(false);
          navigation.push('setupProfile2', route.params);
        })
        .catch(error => {
          setIsLoading(false);
          console.error('here', error);
        });
      // ///////////////////////

      // navigation.push('setupProfile2', route.params); // Pass profileData to the next component
    } else {
      Alert.alert('Please select an avatar');
    }
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const selectAvatar = avatar => {
    console.log('Selecte Avatar ===> ', avatar);
    setSelectedAvatar(avatar);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <CustomHeader title="Setup Profile" goBack={navigateBack} />
        <View style={styles.container}>
          <IzzyAILogo style={{marginTop: 60}} />

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <BarFilled />
            <BarFilled />
            <Bar />
            <Bar />
            <Bar />
          </View>

          <Text style={[styles.base, styles.heading]}>Choose your Avatar</Text>

          {gender === 'Male' && (
            <>
              {/* <Text style={[styles.base, styles.labelText]}>Male Avatars</Text> */}
              <View style={styles.avatarRow}>
                <TouchableOpacity
                  onPress={() => selectAvatar(1)}
                  style={[
                    styles.avatarContainer,
                    selectedAvatar === 1 && styles.selectedAvatarContainer,
                  ]}>
                  <Image
                    style={styles.avatarImage}
                    source={require('../assets/images/male1.png')}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectAvatar(2)}
                  style={[
                    styles.avatarContainer,
                    selectedAvatar === 2 && styles.selectedAvatarContainer,
                  ]}>
                  <Image
                    style={styles.avatarImage}
                    source={require('../assets/images/male2.png')}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          {(gender === 'Transgender' || gender === 'Prefer not to say') && (
            <>
              <Text style={[styles.base, styles.labelText]}>Male Avatars</Text>
              <View style={styles.avatarRow}>
                <TouchableOpacity
                  onPress={() => selectAvatar(1)}
                  style={[
                    styles.avatarContainer,
                    selectedAvatar === 1 && styles.selectedAvatarContainer,
                  ]}>
                  <Image
                    style={styles.avatarImage}
                    source={require('../assets/images/male1.png')}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectAvatar(2)}
                  style={[
                    styles.avatarContainer,
                    selectedAvatar === 2 && styles.selectedAvatarContainer,
                  ]}>
                  <Image
                    style={styles.avatarImage}
                    source={require('../assets/images/male2.png')}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.base, styles.labelText]}>
                Female Avatars
              </Text>
              <View style={styles.avatarRow}>
                <TouchableOpacity
                  onPress={() => selectAvatar(4)}
                  style={[
                    styles.avatarContainer,
                    selectedAvatar === 4 && styles.selectedAvatarContainer,
                  ]}>
                  <Image
                    style={styles.avatarImage}
                    source={require('../assets/images/female1.png')}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectAvatar(3)}
                  style={[
                    styles.avatarContainer,
                    selectedAvatar === 3 && styles.selectedAvatarContainer,
                  ]}>
                  <Image
                    style={styles.avatarImage}
                    source={require('../assets/images/female2.png')}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          {gender === 'Female' && (
            <>
              {/* <Text style={[styles.base, styles.labelText]}>
                Female Avatars
              </Text> */}
              <View style={styles.avatarRow}>
                <TouchableOpacity
                  onPress={() => selectAvatar(4)}
                  style={[
                    styles.avatarContainer,
                    selectedAvatar === 4 && styles.selectedAvatarContainer,
                  ]}>
                  <Image
                    style={styles.avatarImage}
                    source={require('../assets/images/female1.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectAvatar(3)}
                  style={[
                    styles.avatarContainer,
                    selectedAvatar === 3 && styles.selectedAvatarContainer,
                  ]}>
                  <Image
                    style={styles.avatarImage}
                    source={require('../assets/images/female2.png')}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Add conditions and avatar components for other genders if needed */}

          <CustomButton
            onPress={navigateNext}
            title="Next"
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'SF-Pro-Display-Regular',
    color: '#111920',
    marginBottom: 10,
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: '100%',
    padding: 20,
  },
  heading: {
    paddingTop: 30,
    fontSize: 24,
    fontWeight: '500',
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
    marginRight: 200,
    textAlign: 'left',
  },
  button: {
    width: '85%',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#111920',
    padding: 10,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
    gap: 50,
    marginTop: 30,
  },
  avatarContainer: {
    borderWidth: 0,
    borderRadius: 10,
  },
  selectedAvatarContainer: {
    borderWidth: 2,
    borderColor: '#2DEEAA',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
});

export default SetupProfilePage1;
