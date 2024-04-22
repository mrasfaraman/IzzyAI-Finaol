import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import EyeOnIcon from '../assets/EyeOnIcon';
import {CommonActions} from '@react-navigation/native';
import BaseURL from '../components/ApiCreds';

const NewPassword = ({navigation, route}) => {
  const {email} = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State variable to toggle password visibility
  const [error, setError] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    clearError();

    const formData = new FormData();
    formData.append('Email', email);
    formData.append('password', newPassword);
    formData.append('confirmPassword', confirmPassword);

    if (!newPassword || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (!isValidPassword(newPassword)) {
      setError(
        'Invalid password. It should contain at least 8 characters, 1 uppercase letter, and 1 special character.',
      );
      return;
    }

    if (!isValidPassword(confirmPassword)) {
      setError(
        'Invalid password. It should contain at least 8 characters, 1 uppercase letter, and 1 special character.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password and confirm password don't match");
      return;
    }

    console.log('Forget Data ---> ', formData);

    try {
      setIsLoading(true);

      const response = await fetch(`${BaseURL}/update_password`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data) {
        console.log('data', data);
        Alert.alert('Password updated!', 'You can login with new password.');
        setIsLoading(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'signInPage'}],
          }),
        );
      } else {
        setIsLoading(false);

        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      setIsLoading(false);

      console.error('Error updating password:', error);
      Alert.alert(
        'Error',
        'An error occurred while updating password. Please try again.',
      );
    }
  };
  const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    return regex.test(password);
  };

  const clearError = () => {
    setError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => setNewPassword(text)}
          value={newPassword}
          placeholder="New Password"
          placeholderTextColor="grey"
          secureTextEntry={!showPass1}
          onFocus={clearError}
        />
        <TouchableOpacity
          onPress={() => setShowPass1(!showPass1)}
          style={styles.iconContainer}>
          <EyeOnIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor="grey"
          secureTextEntry={!showPass2}
          onFocus={clearError}
        />
        <TouchableOpacity
          onPress={() => setShowPass2(!showPass2)}
          style={styles.iconContainer}>
          <EyeOnIcon />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        {isLoading ? (
          <ActivityIndicator size={20} color={'white'} />
        ) : (
          <Text style={styles.buttonText}>Change Password</Text>
        )}
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
    color: '#111920',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#111920',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
  button: {
    width: '90%',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#111920',
    padding: 10,
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
    width: '80%',
  },
});

export default NewPassword;
