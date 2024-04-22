import {useState, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, Text, ScrollView} from 'react-native';
import IzzyAILogo from '../assets/IzzyAILogo';
import SuccessIcon from '../assets/SuccessIcon';
import BaseURL from '../components/ApiCreds';
import {CommonActions} from '@react-navigation/native';

function ProfileSetupSuccessPage({navigation}: any) {
  useEffect(() => {
    let timer1 = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'main'}],
        }),
      );
    }, 2000);

    return () => {
      clearTimeout(timer1);
    };
  }, []);

  return (
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <SuccessIcon />
          <IzzyAILogo style={{marginTop: 15}} />
          <Text style={[styles.base, styles.heading]}>
            Your IzzyAI profile has setup successfully
          </Text>
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
    paddingTop: 15,
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ProfileSetupSuccessPage;
