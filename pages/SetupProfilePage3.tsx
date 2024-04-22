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
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import IzzyAILogo from '../assets/IzzyAILogo';
import ChevronDownIcon from '../assets/ChevronDown';
import CustomHeader from '../components/CustomHeader';
import {CheckBox} from '@rneui/themed';
import BarFilled from '../assets/BarFilled';
import Bar from '../assets/Bar';
import {useDataContext} from '../contexts/DataContext';

const ProgressTextLeft = fill => {
  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: 24,
          fontWeight: '500',
          color: '#FC4343',
          textAlign: 'center',
        },
      ]}>
      {Math.round(fill)}%
    </Text>
  );
};

const ProgressTextRight = fill => {
  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: 24,
          fontWeight: '500',
          color: '#71D860',
          textAlign: 'center',
        },
      ]}>
      {Math.round(fill)}%
    </Text>
  );
};

const CustomButton = (props: any) => {
  return (
    <TouchableOpacity
      onPress={() => props.onPress()}
      style={[styles.button, {backgroundColor: props.backgroundColor}]}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

function SetupProfilePage3({navigation, route}: any) {
  const {videoQualityPercentage, audioQualityPercentage} = route.params;

  const {userId} = useDataContext();
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const checkQuality = () => {
      if (videoQualityPercentage >= 50 && audioQualityPercentage >= 20) {
        setPassed(true);
      } else {
        setPassed(false);
      }
    };
  
    checkQuality();
  }, [videoQualityPercentage, audioQualityPercentage]);
  
  const naviagte = () => {
    console.log('3rd', route.params);
    navigation.push('setupProfile4', route.params);
  };

  const naviagteBack = () => {
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
            <Bar />
          </View>
          {passed ? (
            <Text style={[styles.base, styles.heading]}>
              Congratulations! Your camera passed the test!
            </Text>
          ) : (
            <Text style={[styles.base, styles.heading]}>
              Oops! Your camera didn’t qualify the test :(
            </Text>
          )}
          <View
            style={{
              display: 'flex',
              width: '100%',
              marginTop: 30,
            }}>
            {passed ? (
              <Text style={[styles.base, styles.labelText]}>
                Your camera is good to go! You can now proceed to the next step
              </Text>
            ) : (
              <Text style={[styles.base, styles.labelText]}>
                Try cleaning up your camera or use different Smartphone inorder
                to use IzzyAI
              </Text>
            )}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 20,
                width: '100%',
              }}>
              <View style={{width: 150}}>
                <AnimatedCircularProgress
                  size={150}
                  width={20}
                  fill={videoQualityPercentage ? videoQualityPercentage : 0}
                  tintColor="#FC4343"
                  onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#FFECF0"
                  children={fill => ProgressTextLeft(fill)}
                />
                <Text
                  style={[
                    styles.base,
                    {fontSize: 14, textAlign: 'center', marginTop: 10},
                  ]}>
                  Camera Score
                </Text>
              </View>
              <View style={{width: 150}}>
                <AnimatedCircularProgress
                  size={150}
                  width={20}
                  fill={audioQualityPercentage ? audioQualityPercentage : 0}
                  tintColor="#71D860"
                  backgroundColor="#F4FCF3"
                  children={fill => ProgressTextRight(fill)}
                />
                <Text
                  style={[
                    styles.base,
                    {fontSize: 14, textAlign: 'center', marginTop: 10},
                  ]}>
                  Microphone Score
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <CustomButton
              onPress={() => naviagteBack()}
              title="Retry"
              backgroundColor="red"
            />
            <CustomButton
              onPress={() => naviagte()}
              title="Done"
              backgroundColor="green"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'SF-Pro-Display-Regular',
    color: '#111920',
    alignSelf: 'center',
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
    textAlign: 'center',
  },
  //   para: {
  //     paddingTop: 5,
  //     fontSize: 16,
  //     paddingHorizontal: 30,
  //     textAlign: 'center',
  //     fontWeight: '400',
  //   },
  //   textInputContainer: {
  //     marginTop: 20,
  //     width: '100%',
  //     paddingHorizontal: 25,
  //   },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'center',
    maxWidth: 350,
    width: '95%',
  },
  //   inputContainer: {
  //     display: 'flex',
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     backgroundColor: '#F8F8F8',
  //   },
  //   textInput: {
  //     backgroundColor: '#F8F8F8',
  //     paddingLeft: 4,
  //     color: '#111920',
  //     fontSize: 16,
  //     width: '80%',
  //     margin: 5,
  //     // marginRight: 'auto',
  //   },
  //   forgotPassword: {
  //     marginLeft: 'auto',
  //     fontWeight: '600',
  //     fontSize: 16,
  //     marginRight: 20,
  //     marginTop: 10,
  //   },
  button: {
    width: '40%',
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 60,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  //   text: {
  //     fontSize: 16,
  //   },
  //   bold: {
  //     fontWeight: '700',
  //   },
  //   dropdownButtonText: {
  //     textAlign: 'left',
  //     fontSize: 16,
  //   },
  //   dropdownRowText: {
  //     textAlign: 'left',
  //   },
});

export default SetupProfilePage3;
