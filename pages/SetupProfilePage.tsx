import {useState} from 'react';
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
import SelectDropdown from 'react-native-select-dropdown';
import IzzyAILogo from '../assets/IzzyAILogo';
import ChevronDownIcon from '../assets/ChevronDown';
import CustomHeader from '../components/CustomHeader';
import {CheckBox} from '@rneui/themed';
import BarFilled from '../assets/BarFilled';
import Bar from '../assets/Bar';
const countries = ['Male', 'Female', 'Transgender', 'Prefer not to say'];
import {useDataContext} from '../contexts/DataContext';
import BaseURL from '../components/ApiCreds';

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

function SetupProfilePage({navigation}: any) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedGender, setSelectedGender] = useState('Male');
  const [improvementPreferences, setImprovementPreferences] = useState([]);
  const {userId} = useDataContext();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = () => {
    if (name.trim() === '' || age.trim() === '') {
      Alert.alert('Please fill out all required fields.');
      return;
    }
    setIsLoading(true);
    const profileData = {
      name,
      age,
      gender: selectedGender,
      improvementPreferences,
    };
    // navigation.push('setupProfile1', profileData);
    const formData = new FormData();

    // Append data to FormData object
    formData.append('UserID', userId);
    formData.append('FullName', profileData.name);
    formData.append('Age', profileData.age);
    formData.append('Gender', profileData.gender);
    formData.append('checkboxes', profileData.improvementPreferences.join(','));

    console.log('Body Data ---> ', formData);
    fetch(`${BaseURL}/insert_user_profile`, {
      method: 'POST',
      headers: {},
      body: formData,
    })
      .then(response => {
        console.log('My result ===> ', response);

        setIsLoading(false);
        navigation.push('setupProfile1', profileData);
        // navigation.push('setupProfile');
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

  const handleCheckboxChange = (preference) => {
    const updatedPreferences = improvementPreferences.includes(preference)
      ? improvementPreferences.filter((item) => item !== preference)
      : [...improvementPreferences, preference];

    setImprovementPreferences(updatedPreferences);
  }; 

  console.log(improvementPreferences)
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomHeader title="Setup Profile" goBack={navigateBack} />
          <IzzyAILogo style={{marginTop: 60}} />

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <BarFilled />
            <Bar />
            <Bar />
            <Bar />
            <Bar />
          </View>

          <Text style={[styles.base, styles.heading]}>
            Setup your profile to continue
          </Text>
          <View style={styles.textInputContainer}>
            <Text style={[styles.base, styles.labelText]}>
              Your Name<Text style={{color: 'red'}}>*</Text>
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
              Your Age<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="eg. 28"
                inputMode="numeric"
                placeholderTextColor={'#D6D8C0'}
                value={age}
                onChangeText={setAge}
              />
            </View>
          </View>
          <View style={styles.textInputContainer}>
            <Text style={[styles.base, styles.labelText]}>
              Your Gender<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <SelectDropdown
                defaultButtonText="Male"
                buttonStyle={{
                  backgroundColor: '#F8F8F8',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
                renderDropdownIcon={ChevronDownIcon}
                buttonTextStyle={[styles.base, styles.dropdownButtonText]}
                defaultValue={'Male'}
                rowTextStyle={[styles.base, styles.dropdownRowText]}
                data={countries}
                onSelect={(selectedItem, index) => {
                  setSelectedGender(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </View>
          </View>

          <View style={{marginTop: 20, width: '100%', paddingHorizontal: 20}}>
            <Text style={[styles.base, styles.labelText]}>
              What do you want to improve?
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

          <CustomButton onPress={navigate} title="Next" loading={isLoading} />
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

export default SetupProfilePage;
