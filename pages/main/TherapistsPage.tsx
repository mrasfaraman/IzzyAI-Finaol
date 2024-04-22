import React from 'react';
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
import CustomHeader from '../../components/CustomHeader';
import ArrowRightTeal from '../../assets/ArrowRightTeal';
import LinearGradient from 'react-native-linear-gradient';

function Card({navigation}: any) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('therapistProfile', {
          itemId: 86,
          otherParam: 'anything you want here',
        });
      }}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={['#0CC8E8', '#2DEEAA']}
        style={{
          // alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          marginTop: 14,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 15,
            margin: 1.5,
            borderRadius: 15,
            backgroundColor: '#fff',
            padding: 16,
            // borderWidth: 1,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              style={{
                height: 64,
                width: 64,
                borderRadius: 1000,
                backgroundColor: '#D6D8C0',
              }}
              source={require('../../assets/images/therapist.png')}
            />
            <View style={{marginLeft: 10}}>
              <Text style={[styles.base, {fontSize: 20, fontWeight: '500'}]}>
                AI SLP
              </Text>
              <Text style={[styles.base, {fontSize: 14, fontWeight: '500'}]}>
                Your Personal Therapist
              </Text>
            </View>
          </View>
          <ArrowRightTeal />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function TherapistsPage({navigation}: any) {
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
          }}>
          <CustomHeader title="Therapists" goBack={naviagteBack} />
          <View style={{marginBottom: 30}}>
            <Text
              style={[
                styles.base,
                {
                  fontSize: 24,
                  fontWeight: '500',
                  maxWidth: '90%',
                  marginTop: 40,
                  marginBottom: 20,
                },
              ]}>
              List of therapists you can choose from!
            </Text>
            <Card navigation={navigation} />
            <Card navigation={navigation} />
            <Card navigation={navigation} />
            <Card navigation={navigation} />
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
});

export default TherapistsPage;
