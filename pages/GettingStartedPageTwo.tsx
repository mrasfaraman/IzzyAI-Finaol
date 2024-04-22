import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import IzzyAILogo from '../assets/IzzyAILogo';
import BlackDot from '../assets/BlackDot';
import WhiteDot from '../assets/WhiteDot';
import MicroPhoneIconGradient from '../assets/MicrophoneIconWithGradient';
import CustomButton from '../components/Button';

function GettingStartedPageTwo({navigation}: any) {
  const navigate = () => {
    navigation.push('startedThree');
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
          <IzzyAILogo style={{marginTop: 60}} />

          <Text style={[styles.base, styles.heading, {marginTop: 50}]}>
            Your partner at every step in achieving effective communication.
          </Text>
          <Text style={[styles.base, styles.heading2]}>Vision</Text>
          <Text style={[styles.base, styles.para]}>
            Accessibility to timely assessment and variety of the therapeutic exercises for everyone.
          </Text>
          <Text style={[styles.base, styles.heading2]}>Mission</Text>
          <Text style={[styles.base, styles.para]}>
            IzzyAI Avatars based assessments and interventions are tailored to
            the specific needs of the users.
          </Text>
          {/* <View style={styles.svgContainer}>
            <WhiteDot style={styles.baseDot} />
            <BlackDot style={styles.baseDot} />
            <WhiteDot style={styles.baseDot} />
          </View> */}
          {/* <View style={styles.secondContainer}>
        <View style={styles.micContainer}>
          <MicroPhoneIconGradient />
          <Text style={[styles.base, styles.micText]}>izzy</Text>
        </View>
        <View>
          <Text style={[styles.base, styles.para2]}>
            Hello there! you can start saying words you feel difficult to
            pronounce
          </Text>
        </View>
      </View> */}
          {/* <Image
            style={styles.img}
            source={require('../assets/images/getStarted2.png')}
          /> */}
          <View style={styles.btnContainer}>
            <CustomButton onPress={() => navigate()} title="Get Started" />
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
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  heading: {
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
  },
  heading2: {
    marginTop: 30,
    fontSize: 25,
    fontWeight: '500',
  },
  para: {
    fontSize: 15,
    textAlign: 'justify',
    fontWeight: '400',
    width: '85%',
    marginTop: 5,
  },
  svgContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 20,
    fontSize: 16,
    paddingHorizontal: 30,
    textAlign: 'center',
    fontWeight: '400',
  },
  baseDot: {
    marginHorizontal: 3,
  },
  // secondContainer: {
  //   marginTop: 40,
  //   paddingHorizontal: 30,
  //   display: 'flex',
  //   flexDirection: 'row',
  // },
  // micContainer: {
  //   display: 'flex',
  //   justifyContent: 'center',
  // },
  // micText: {
  //   textAlign: 'center',
  // },
  // para2: {
  //   paddingTop: 5,
  //   fontSize: 14,
  //   paddingHorizontal: 30,
  //   fontWeight: '400',
  //   marginTop: 10,
  // },
  img: {
    marginTop: 40,
  },
  btnContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default GettingStartedPageTwo;
