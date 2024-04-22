import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, Text, ScrollView} from 'react-native';
import IzzyAILogo from '../assets/IzzyAILogo';
import SuccessIcon from '../assets/SuccessIcon';
import CustomButton from '../components/Button';

function SufferingDisease({navigation, route}: any) {
  const navigateToProfileSetupSuccess = () => {
    navigation.navigate('profileSetupSuccess');
  };

  const first14QuestionsYes = route.params?.first14QuestionsYes;
  const question15OnwardYes = route.params?.question15OnwardYes;

  useEffect(() => {
    if (
      first14QuestionsYes !== undefined &&
      question15OnwardYes !== undefined
    ) {
    }
  }, [first14QuestionsYes, question15OnwardYes]);
  return (
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            display: 'flex',
            flex: 1,
            marginTop: 80,
            alignItems: 'center',
          }}>
          <View style={{marginLeft: -40}}>
            <IzzyAILogo style={{marginTop: 15}} />

            <Text style={[styles.base, styles.text_1]}>
              Diagnosed conditions
            </Text>

            {first14QuestionsYes && (
              <>
                <Text style={[styles.base, styles.text_2]}>Articulation</Text>
                <Text style={[styles.base, styles.text_2]}>Stammering</Text>
              </>
            )}

            {question15OnwardYes && (
              <Text style={[styles.base, styles.text_2]}>Voice Disorder</Text>
            )}

            <Text style={[styles.base, styles.text_3]}>
              Explore our app to find personalized exercise plans, assemsments,
              and informative content designed to address common disorder
              concerns. With easy-to-use tools and comprehensive solutions, take
              charge of your well-being today.
            </Text>
          </View>

          <CustomButton
            onPress={navigateToProfileSetupSuccess}
            title="Get Started"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'SF-Pro-Display-Regular, sans-serif',
    color: '#111920',
  },
  text_1: {
    marginTop: 16,
    fontSize: 30,
    fontWeight: '700',
    maxWidth: 300,
  },
  text_2: {
    marginTop: 16,
    fontSize: 25,
    fontWeight: '600',
  },
  text_3: {
    marginTop: 16,
    fontSize: 15,
    maxWidth: 280,
  },
});

export default SufferingDisease;
