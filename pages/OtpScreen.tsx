import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BaseURL from '../components/ApiCreds';

const OtpScreen = ({route}) => {
  const {email} = route.params;
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);
  const navigation = useNavigation();

  const focusInput = index => {
    otpInputs.current[index].focus();
  };

  useEffect(() => {
    Alert.alert(
      'OTP Sent!',
      'An OTP sent to your email. Enter here to continue!',
    );
  }, []);

  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join('');
    if (enteredOTP.length === 6) {
      const formData = new FormData();
      formData.append('Email', email);
      formData.append('otp', enteredOTP);

      console.log('Forget Data ---> ', formData);

      try {
        const response = await fetch(`${BaseURL}/verify_otp`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('data', data);

          navigation.navigate('newPassword', {email: email});
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || response.statusText);
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        Alert.alert(
          'Error',
          'An error occurred while verifying OTP. Please try again.',
        );
      }
    } else {
      Alert.alert('Invalid OTP!', 'Please enter a 6-digit OTP.');
    }
  };

  const handleInputChange = (value, index) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    if (value) {
      if (index < 5) {
        focusInput(index + 1);
      }
    } else if (index > 0) {
      focusInput(index - 1);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            ref={ref => (otpInputs.current[index] = ref)}
            key={index}
            style={styles.input}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={value => handleInputChange(value, index)}
            value={digit}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111920',
  },
  otpContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    color: '#111920',
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 8,
    fontSize: 18,
    textAlign: 'center',
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    backgroundColor: '#007AFF',
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
  },
});

export default OtpScreen;
