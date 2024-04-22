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
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import IzzyAILogo from '../assets/IzzyAILogo';
import ChevronDownIcon from '../assets/ChevronDown';
import CustomHeader from '../components/CustomHeader';
import {CheckBox} from '@rneui/themed';
import BarFilled from '../assets/BarFilled';
import Bar from '../assets/Bar';
import BaseURL from '../components/ApiCreds';

const CustomButton = (props: any) => {
  return (
    <TouchableOpacity onPress={() => props.onPress()} style={styles.button}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

function SetupProfilePage4({navigation, route}: any) {
  const naviagte = () => {
    console.log('3rd', route.params);
    navigation.push('scanfaceInstruction', {
      ...route.params,
      routeName: 'baselineQuestions',
      nextPage: 'faceauthenticationscreen',
    });
  };

  const naviagteBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomHeader title="Setup Profile" goBack={naviagteBack} />
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
            <BarFilled />
            <BarFilled />
            <BarFilled />
          </View>

          <Text style={[styles.base, styles.heading]}>
            Our Terms & Conditions
          </Text>
          <View
            style={{
              width: '90%',
              marginTop: 20,
            }}>
            <Text style={[styles.base, styles.labelText]}>
              Finish setting up your profile by thoroughly reading our Terms &
              Conditions
            </Text>
          </View>

          <View style={{marginVertical: 20}}>
            <Text style={styles.base}>
              Consent to Recording: You agree that this product may record audio
              and video for the purpose of language disorder assessment and
              improvement.
            </Text>
            <Text style={styles.base}>
              Data Usage: Your recorded data may be used to enhance the
              functionality of the product and for research purposes. Your
              privacy will be respected, and your data will not be shared with
              third parties without your consent.
            </Text>
            <Text style={styles.base}>
              Security Measures: We take your privacy seriously and employ
              industry-standard security measures to protect your data from
              unauthorized access or disclosure.
            </Text>
            <Text style={styles.base}>
              User Responsibilities: You are responsible for maintaining the
              confidentiality of your account credentials and ensuring the
              security of your device.
            </Text>
            <Text style={styles.base}>
              Compliance: This product complies with relevant privacy
              regulations, including the General Data Protection Regulation
              (GDPR) and the Health Insurance Portability and Accountability Act
              (HIPAA), where applicable.
            </Text>
            <Text style={styles.base}>
              Updates: These terms and conditions may be updated from time to
              time. By continuing to use the product, you agree to the updated
              terms.
            </Text>
          </View>

          <CustomButton
            onPress={() => naviagte()}
            title="I agree to Terms & Conditions"
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
    paddingHorizontal: 20,
    marginTop: 5,
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
    maxWidth: 370,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',

    marginBottom: 5,
    textAlign: 'center',
    maxWidth: 350,
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
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SetupProfilePage4;
