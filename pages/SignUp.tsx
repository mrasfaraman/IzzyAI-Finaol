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
} from 'react-native';
import IzzyAILogo from '../assets/IzzyAILogo';
import EmailIcon from '../assets/EmailIcon';
import LockIcon from '../assets/LockIcon';
import EyeOnIcon from '../assets/EyeOnIcon';
import UserIcon from '../assets/UserIcon';
import CustomHeader from '../components/CustomHeader';
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

function SignUpPage({navigation}: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = () => {
    if (!email || !password || !username || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email address');
      return;
    }
    if (!isValidPassword(password)) {
      setError(
        'Invalid password. It should contain at least 8 characters, 1 uppercase letter, and 1 special character.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password don't match");
      return;
    }

    setIsLoading(true);

    // Request Data
    const userData = {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
    console.log(userData);

    fetch(`${BaseURL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.error) {
          setError(data.error);
        } else {
          navigation.push('signInPage');
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
        setError('An error occurred while signing up');
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 10000);

    return () => clearTimeout(timer);
  }, [error]);

  const isValidEmail = (email: string) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };
  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    return regex.test(password);
  };
  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomHeader title="Sign Up" goBack={navigateBack} />
          <IzzyAILogo style={{marginTop: 60}} />

          <Text style={[styles.base, styles.heading]}>
            Sign up to get started with IzzyAI
          </Text>
          <View style={styles.textInputContainer}>
            <Text style={[styles.base, styles.labelText]}>
              Username<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <UserIcon />
              <TextInput
                style={styles.textInput}
                placeholder="Username"
                placeholderTextColor={'#D6D8C0'}
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>
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
          <View style={styles.textInputContainer}>
            <Text style={[styles.base, styles.labelText]}>
              Confirm Password<Text style={{color: 'red'}}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <LockIcon />
              <TextInput
                style={styles.textInput}
                secureTextEntry={hideConfirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor={'#D6D8C0'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setHideConfirmPassword(!hideConfirmPassword)}>
                <EyeOnIcon />
              </TouchableOpacity>
            </View>
          </View>
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
            onPress={navigate}
            title="Sign Up"
            loading={isLoading}
          />

          <View style={{marginTop: 10, display: 'flex', flexDirection: 'row'}}>
            <Text style={[styles.base, styles.text]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.push('signInPage')}>
              <Text style={[styles.base, styles.bold, styles.text]}>
                Sign In
              </Text>
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
    marginBottom: 50,
  },
  heading: {
    paddingTop: 50,
    fontSize: 24,
    fontWeight: '500',
  },
  textInputContainer: {
    marginTop: 15,
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
    marginTop: 10,
  },
  bold: {
    fontWeight: '700',
  },
});

export default SignUpPage;
