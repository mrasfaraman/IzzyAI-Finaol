import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import CustomButton from '../components/Button';

function InstructionsPage({navigation, route}: any) {
  // Extract session ID from route params
  const sessionId = route.params?.sessionId;
  const SessiontypId = route.params?.SessiontypId;

  // Function to navigate to speechArticulationPage
  const navigate = () => {
    navigation.push('scanfaceInstruction', {
      sessionId: sessionId,
      SessiontypId: SessiontypId,
      routeName: 'speechArticulationPage',
      nextPage: 'faceauthenticationscreenmain',
    });
  };

  // Function to navigate back
  const navigateBack = () => {
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
          <CustomHeader title="Instructions" goBack={navigateBack} />
          <Image
            style={{marginTop: 40}}
            source={require('../assets/images/mouth.png')}
          />

          <Text
            style={[
              styles.base,
              styles.heading,
              {maxWidth: 350, textAlign: 'center'},
            ]}>
            Articulation screening instructions
          </Text>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 10,
              width: '80%',
              alignSelf: 'center',
              gap: 10,
            }}>
            <Text style={[styles.base, {fontSize: 14, fontWeight: '400'}]}>
              {'\u2B24'}
            </Text>
            <Text
              style={[
                styles.base,
                {
                  fontSize: 14,
                  fontWeight: '400',
                },
              ]}>
              You will be shown some images of random objects and you will have
              to pronounce their names with your mic
            </Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: 10,
              width: '80%',
              gap: 10,
            }}>
            <Text style={[styles.base, {fontSize: 14, fontWeight: '400'}]}>
              {'\u2B24'}
            </Text>
            <Text
              style={[
                styles.base,
                {
                  fontSize: 14,
                  fontWeight: '400',
                },
              ]}>
              Hit “Record” button and start pronouncing the name of the object
            </Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: 10,
              width: '80%',
              gap: 10,
            }}>
            <Text style={[styles.base, {fontSize: 14, fontWeight: '400'}]}>
              {'\u2B24'}
            </Text>
            <Text
              style={[
                styles.base,
                {
                  fontSize: 14,
                  fontWeight: '400',
                },
              ]}>
              IzzyAI will respond if you pronounced the name correctly
            </Text>
          </View>

          <CustomButton onPress={() => navigate()} title="Start Now" />
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
  heading: {
    paddingTop: 50,
    fontSize: 24,
    fontWeight: '500',
  },
});

export default InstructionsPage;
