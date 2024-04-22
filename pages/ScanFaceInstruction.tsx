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

function ScanFaceInstruction({navigation, route}: any) {
  const naviagte = () => {
    navigation.push(route.params.nextPage, {
      ...route.params
    });
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
          <CustomHeader title="Verification" goBack={naviagteBack} />
          <View
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={styles.faceIcon}
              source={require('../assets/images/faceIcon.png')}
            />
            <View style={{display: 'flex', marginTop: 10}}>
              <Text
                style={[
                  styles.base,
                  styles.heading,
                  {maxWidth: 350, textAlign: 'center'},
                ]}>
                We want to scan
              </Text>
              <Text
                style={[
                  styles.base,
                  styles.heading,
                  {maxWidth: 350, textAlign: 'center'},
                ]}>
                your face
              </Text>
            </View>

            <Text
              style={[
                styles.base,
                {
                  fontSize: 16,
                  fontWeight: '400',
                  maxWidth: 300,
                  textAlign: 'center',
                  marginTop: 10,
                },
              ]}>
            Please take a clear picture of yourself. It will be used for authentication purposes.
            </Text>
          </View>

          <CustomButton onPress={() => naviagte()} title="Next" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  faceIcon: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  base: {
    fontFamily: 'SF-Pro-Display-Regular, sans-serif',
    color: '#111920',
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
  },
});

export default ScanFaceInstruction;
