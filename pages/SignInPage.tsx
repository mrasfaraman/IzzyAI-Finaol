import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import IzzyAILogo from '../assets/IzzyAILogo';
import EmailIcon from '../assets/EmailIcon';
import LockIcon from '../assets/LockIcon';
import EyeOnIcon from '../assets/EyeOnIcon';
import GoogleIcon from '../assets/GoogleIcon';
import AppleIcon from '../assets/AppleIcon';
import CustomHeader from '../components/CustomHeader';
import {useDataContext} from '../contexts/DataContext';
import BaseURL from '../components/ApiCreds';
import {CommonActions} from '@react-navigation/native';
import Loader from '../components/Loader';
import EmailPopup from '../components/EmailPopup';

const CustomButton = (props: any) => {
  return (
    <TouchableOpacity
      onPress={() => props.onPress()}
      style={styles.button}
      disabled={props.loading}>
      {props.loading ? (
        <ActivityIndicator color={'white'} size={26} />
      ) : (
        <Text style={styles.buttonText}>{props.title}</Text>
      )}
    </TouchableOpacity>
  );
};

function SignInPage({navigation}: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgetLoading, setForgetLoading] = useState(false);
  const [forgetError, setForgetError] = useState('');

  const {updateUserId, updateUserDetail} = useDataContext();

  const handleLogin = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email address');
      return;
    }

    setIsLoading(true);

    const userData = {
      Email: email,
      PasswordHash: password,
    };

    console.log('App credential', userData);

    fetch(`${BaseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        updateUserId(data.USERID);
        console.log(data);
        if (data.error) {
          setIsLoading(false);
          setError(data.error);
        } else {
          fetch(`${BaseURL}/get_answers/${data.USERID}`)
            .then(response => response.json())
            .then(responseData => {

              updateUserDetail({email: email, UserID: data.USERID});
              
              if (
                responseData.message === 'No answers found for the user ID.'
              ) {
                navigation.navigate('setupProfile');
              } else if (
                Array.isArray(responseData.answers) &&
                responseData.answers.length === 0
              ) {
                navigation.navigate('setupProfile');
              } else if (Array.isArray(responseData.answers)) {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'main'}],
                  }),
                );
              } else {
                setIsLoading(false);
                console.error('Invalid responseData structure:', responseData);
                setError('An error occurred while fetching answers');
              }
              setIsLoading(false);
            })
            .catch(error => {
              setIsLoading(false);

              console.error(error);
              setError('An error occurred while fetching answers');
            });
        }
      })
      .catch(error => {
        setIsLoading(false);

        // navigation.push('profileType');
        console.error(error);
        setError('An error occurred while signing in');
      });
  };

  const handleForgetPassword = async forgetEmail => {
    if (!forgetEmail) {
      setForgetError('Email is required');
      return;
    }

    setForgetLoading(true);

    const formData = new FormData();
    formData.append('Email', forgetEmail);

    console.log('Forget Data ---> ', formData);

    try {
      const response = await fetch(`${BaseURL}/generate_otp`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data) {
        console.log('data', data);
        if (data.error) {
          setForgetLoading(false);
          setForgetError(data.error);
        } else {
          setForgetLoading(false);
          navigation.navigate('otpScreen', {email: forgetEmail});
          setShowEmailPopup(false);
          setForgetError('');
        }
      } else {
        // Handle error response
        setForgetLoading(false);
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      setForgetLoading(false);

      Alert.alert('An unexpected error occurred!');

      // Handle fetch error
      console.log('Forgot Error', error);
    }
  };

  const isValidEmail = (email: string) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };

  const [showEmailPopup, setShowEmailPopup] = useState(false);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomHeader title="Sign In" goBack={() => navigation.goBack()} />
          <IzzyAILogo style={{marginTop: 60}} />

          <View style={styles.textInputContainer}>
            <Text style={[styles.base, styles.labelText]}>
              Email<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <EmailIcon />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor={'#D6D8C0'}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
          <View style={styles.textInputContainer}>
            <Text style={[styles.base, styles.labelText]}>
              Password<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <LockIcon />
              <TextInput
                style={styles.textInput}
                secureTextEntry={hidePassword}
                placeholder="Password"
                placeholderTextColor={'#D6D8C0'}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                <EyeOnIcon />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowEmailPopup(true)}>
            <Text style={[styles.base, styles.forgotPassword]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <EmailPopup
            visible={showEmailPopup}
            error={forgetError}
            onClose={() => {
              setShowEmailPopup(false), setForgetError('');
            }}
            onConfirm={handleForgetPassword}
            loading={forgetLoading}
          />

          <Text style={[styles.base, styles.heading]}>Sign in to continue</Text>
          {error ? (
            <Text
              style={{
                color: 'red',
                marginTop: 20,
                textAlign: 'center',
                width: '80%',
              }}>
              {error}
            </Text>
          ) : null}

          <CustomButton
            onPress={handleLogin}
            title="Login"
            loading={isLoading}
          />

          <View style={{marginTop: 10, display: 'flex', flexDirection: 'row'}}>
            <Text style={[styles.base, styles.text]}>
              Don’t have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.push('signUpPage')}>
              <Text style={[styles.base, styles.bold, styles.text]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <View
              style={{
                borderTopWidth: 1,
                borderColor: '#E0E0E0',
                width: '40%',
                marginHorizontal: 30,
              }}
            />
            <Text
              style={{
                fontFamily: 'SF-Pro-Display-Regular',
                color: '#7E7E7E',
              }}>
              OR
            </Text>
            <View
              style={{
                borderTopWidth: 1,
                borderColor: '#E0E0E0',
                width: '40%',
                marginHorizontal: 20,
              }}
            />
          </View>
          <View style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
            <TouchableOpacity style={styles.socialAuthBtn}>
              <GoogleIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialAuthBtn}>
              <AppleIcon />
            </TouchableOpacity>
          </View>
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
    paddingTop: 40,
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
  socialAuthBtn: {
    width: '40%',
    height: 50,
    borderColor: '#D0D5DD',
    borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    margin: 5,
  },
});

export default SignInPage;
