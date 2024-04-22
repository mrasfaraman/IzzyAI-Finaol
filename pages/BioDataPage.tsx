import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {CheckBox} from '@rneui/themed';
import {useDataContext} from '../contexts/DataContext';
import BaseURL from '../components/ApiCreds';
import CustomHeader from '../components/CustomHeader';

const CustomButton = (props: any) => {
  return (
    <TouchableOpacity onPress={() => props.onPress()} style={styles.button}>
      {props.loading ? (
        <ActivityIndicator color={'white'} size={26} />
      ) : (
        <Text style={styles.buttonText}>{props.title}</Text>
      )}
    </TouchableOpacity>
  );
};

function BioDataPage({navigation}: any) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [improvementPreferences, setImprovementPreferences] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {userId} = useDataContext();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckboxChange = (preference) => {
    const updatedPreferences = improvementPreferences.includes(preference)
      ? improvementPreferences.filter((item) => item !== preference)
      : [...improvementPreferences, preference];

    setImprovementPreferences(updatedPreferences);
  };
  
  
  const Update = () => {
    setIsLoading(true);
    const profileData = {
      name,
      age,
      improvementPreferences,
    };
    const formData = new FormData();

    formData.append('FullName', profileData.name);
    formData.append('Age', profileData.age);
    formData.append('CheckboxValues', profileData.improvementPreferences.join(','));

    console.log('Body Data ---> ', formData);
    fetch(`${BaseURL}/update_user_profile_biodata/${userId}`, {
      method: 'PUT',
      headers: {},
      body: formData,
    })
      .then(response => {
        console.log('My result ===> ', response);
        setIsModalVisible(true);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.error('here', error);
      });
    console.log(profileData);
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseURL}/get_user_profile/${userId}`);
        const userData = await response.json();
        console.log('User data from API:', userData);
        
        setUserData(userData);
        setName(userData.FullName)
        setAge(userData.Age)
        const preferencesString = userData.CheckboxValues || '';
        const preferencesArray = preferencesString
          .replace(/[{}"\\']/g, '') // Remove extra characters like curly braces, double quotes, and single quotes
          .split(','); // Convert string to array
        
        setImprovementPreferences(preferencesArray);      
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleYes = () => {
    setIsModalVisible(false);
    navigation.goBack();
  };

  console.log(improvementPreferences)
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomHeader title="Bio Data" goBack={navigateBack}/>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 30,
            }}>
          </View>

          <Text style={[styles.base, styles.heading]}>
            Update user details
          </Text>
          <View style={styles.textInputContainer}>
            <Text style={[styles.base, styles.labelText]}>
              Your Name
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="eg. John doe"
                placeholderTextColor={'#D6D8C0'}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>
          <View style={styles.textInputContainer}>
            <Text style={[styles.base, styles.labelText]}>
              Your Age
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholderTextColor={'#D6D8C0'}
                value={age}
                onChangeText={setAge}
              />
            </View>
          </View>

          <View style={{marginTop: 20, width: '100%', paddingHorizontal: 20}}>
            <Text style={[styles.base, styles.labelText]}>
              Change your preferences
            </Text>
            <CheckBox
              checked={improvementPreferences.includes('narration')}
              onPress={() => handleCheckboxChange('narration')}
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="#111920"
              title="Narration"
              textStyle={[styles.base, {fontSize: 16, fontWeight: '400'}]}
            />

            <CheckBox
              checked={improvementPreferences.includes('speech')}
              onPress={() => handleCheckboxChange('speech')}
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="#111920"
              title="Speech"
              textStyle={[styles.base, {fontSize: 16, fontWeight: '400'}]}
            />

            <CheckBox
              checked={improvementPreferences.includes('voice')}
              onPress={() => handleCheckboxChange('voice')}
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="#111920"
              title="Voice"
              textStyle={[styles.base, {fontSize: 16, fontWeight: '400'}]}
            />

            <CheckBox
              checked={improvementPreferences.includes('fluency')}
              onPress={() => handleCheckboxChange('fluency')}
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="#111920"
              title="Fluency"
              textStyle={[styles.base, {fontSize: 16, fontWeight: '400'}]}
            />
          </View>
          {isModalVisible && (
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  padding: 40,
                  elevation: 9,
                  shadowColor: 'black',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}>

                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: 'black',
                    textAlign: 'center',
                  }}>
                  Profiles Details Updated
                </Text>
                <View style={{flexDirection: 'row',alignItems:'center',justifyContent:'center'}}>
                  <TouchableOpacity
                    onPress={handleYes}
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: 'black',
                      width: 60,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'black',
                      }}>
                      Ok
                    </Text>
                  </TouchableOpacity>
                  </View>
              </View>
            </View>
          )}
          <CustomButton onPress={Update} title="Update" loading={isLoading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'SF-Pro-Display-Regular',
    color: '#111920',
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: '100%',
  },
  heading: {
    paddingTop: 30,
    fontSize: 24,
    fontWeight: '500',
  },
  para: {
    paddingTop: 5,
    fontSize: 16,
    paddingHorizontal: 30,
    textAlign: 'center',
    fontWeight: '400',
  },
  textInputContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 25,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  textInput: {
    backgroundColor: '#F8F8F8',
    paddingLeft: 4,
    color: '#111920',
    fontSize: 16,
    width: '80%',
    margin: 5,
    // marginRight: 'auto',
  },
  forgotPassword: {
    marginLeft: 'auto',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 20,
    marginTop: 10,
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
  text: {
    fontSize: 16,
  },
  bold: {
    fontWeight: '700',
  },
  dropdownButtonText: {
    textAlign: 'left',
    fontSize: 16,
  },
  dropdownRowText: {
    textAlign: 'left',
  },
});

export default BioDataPage;
