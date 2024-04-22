import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import { useDataContext } from '../contexts/DataContext';



const VoiceExerciseGame = ({ navigation }) => {
  const handleButtonClick = (url) => {
    navigation.navigate('games', { url });
  };

  const navigateBack = () => {
    navigation.navigate('exercisePage');
  };


  return (
    <>
          <CustomHeader title="Games" goBack={navigateBack} />

    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonClick('https://5829-20-2-225-3.ngrok-free.app/start_blow_game/60/3')}
      >
        <Text style={styles.buttonText}>Start Blow Game</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleButtonClick('https://5829-20-2-225-3.ngrok-free.app/start_aaa_game/60/3')}
      >
        <Text style={styles.buttonText}>Start AAA Game</Text>
      </TouchableOpacity>
    </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VoiceExerciseGame;
