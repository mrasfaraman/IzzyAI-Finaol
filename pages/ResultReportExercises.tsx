import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {LinearProgress} from '@rneui/themed';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import CustomHeader from '../components/CustomHeader';
import {useDataContext} from '../contexts/DataContext';
import {background} from 'native-base/lib/typescript/theme/styled-system';
import BaseURL from '../components/ApiCreds';

const DarkButton = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.darkButton1, {width: '45%'}]}>
      <Text style={styles.darkButtonText1}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const LightButton = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.lightButton1, {width: '45%'}]}>
      <Text style={styles.lightButtonText1}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const ProgressTextRight = ({text}: any) => {
  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: 48,
          fontWeight: '500',
          color: '#71D860',
          textAlign: 'center',
        },
      ]}>
      {text}%
    </Text>
  );
};

function ResultReportArticulation({navigation, route}: any) {
  // Extract session ID from route params
  const sessionId = route.params?.sessionId;
  const SessiontypId = route.params?.SessiontypId;

  const startTime = route.params?.startTime;
  console.log('TimeStart', startTime);
  const {userId, updateUserDetail, exercisesReport} = useDataContext();

  const {articulationReport} = useDataContext();
  console.log('Report:', articulationReport);
  const length = articulationReport.length;
  const correct = route.params?.correctAnswers;
  const incorrectQuestions = route.params?.incorrectQuestions;

  const totalQuestions = correct + route.params?.incorrectAnswers;
  const percentage = (correct / totalQuestions) * 100;
  console.log('incorrects', length);
  console.log('corrects', correct);
  console.log('percentage', Math.round(percentage));

  const [wordIDs, setWordIDs] = useState([]);
  const [soundIDs, setSoundIDs] = useState([]);
  const [endTime, setEndTime] = useState('');

  // useEffect hook to set the start time when the component mounts
  useEffect(() => {
    const currentEndTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    setEndTime(currentEndTime);
  }, []);

  const naviagte = () => {
    navigation.push('assessmentPage');
  };

  const naviagteBack = () => {
    navigation.navigate('main');
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  const addAssessmentResult = async () => {
    try {
      const formData = new FormData();
      formData.append('UserID', userId);
      formData.append('Score', percentage);
      formData.append('SessionID', sessionId);
      formData.append('DisorderID', 1);

      const validItems = articulationReport.filter(item => item !== undefined);
      console.log(validItems);

      // Extract WordIDs and SoundIDs from valid items
      const extractedWordIDs = validItems.map(item => item.WordID);
      const extractedSoundIDs = validItems.map(item => item.SoundID);

      // Set WordIDs and SoundIDs state
      console.log(validItems);
      console.log('id', extractedWordIDs);

      console.log('id', extractedSoundIDs);
      if (extractedWordIDs && extractedSoundIDs) {
        // Append wordIDs array to FormData
        formData.append('WordIDList', JSON.stringify(extractedWordIDs));

        // Append soundIDs array to FormData
        formData.append('SoundIDList', JSON.stringify(extractedSoundIDs));
      } else {
        console.log(
          'wordIDs or soundIDs is empty or not in the correct format.',
        );
        return; // Exit the function early if wordIDs or soundIDs are empty or not in the correct format
      }

      formData.append('AssessmentDate', formattedDate);
      console.log('Form Data ---> ', formData);

      const response = await fetch(`${BaseURL}/add_assessment_result`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // If the response is successful, parse the response body as JSON
        const responseData = await response.json();
        console.log('Assessment result added successfully:', responseData);
      } else {
        // Handle error response
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      // Handle fetch error
      console.log('Error:', error);
    }
  };

  const updateSession = async () => {
    const sessionStatus = 'Completed';

    const formData = new FormData();
    formData.append('SessionID', sessionId);
    formData.append('StartTime', String(startTime));
    formData.append('EndTime', String(endTime));
    formData.append('SessionStatus', sessionStatus);

    console.log('Update Data ---> ', formData);

    try {
      const response = await fetch(
        `${BaseURL}/second_session_update/${sessionId}`,
        {
          method: 'PUT', // Using PUT method for update
          body: formData,
        },
      );

      if (response.ok) {
        // If the response is successful, parse the response body as JSON
        const data = await response.json();
        console.log('second: ', data);
        return data;
      } else {
        // Handle error response
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      // Handle fetch error
      console.log('Error1:', error);
    }
  };

  updateSession();

  const [soundNames, setSoundNames] = useState([]);
  const [sumQuestion, setSumQuestion] = useState(0);

  const fetchReport = async () => {
    try {
      const response = await fetch(
        `${BaseURL}/get_Exercise_word_count/${userId}/1`,
        {
          method: 'GET',
        },
      );

      if (response.ok) {
        // If the response is successful, parse the response body as JSON
        const reportData = await response.json();
        console.log('Words in backend:', reportData);

        // Calculate the sum of all values and collect sound names
        let sum = 0;
        const names = [];
        for (const key in reportData) {
          if (reportData.hasOwnProperty(key)) {
            sum += reportData[key].Count / 4;
            names.push(reportData[key].SoundName);
          }
        }

        updateUserDetail({totalQuestion: sum});
        setSumQuestion(sum); // Update the state with the calculated sum
        setSoundNames(names); // Update the state with sound names
      } else {
        // Handle error response
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      // Handle fetch error
      console.error('Error words:', error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  useEffect(() => {
    console.log('dasdbsdv fn as dkafd', SessiontypId);
    if (SessiontypId === 1) {
      console.log('1,______________', SessiontypId);
      addAssessmentResult();
    }
    console.log('-----dsafasd-----', route.params?.incorrectQuestions);

    if (SessiontypId === 2) {
      console.log('2,', SessiontypId);

      submitUserExercise();
    }
  }, []);

  // const handleRetry = () => {
  //   // Hit the API endpoint with userId and sessionTypeId
  //   const formData = new FormData();
  //   formData.append('UserID', userId);
  //   formData.append('SessionTypeID', 1);

  //   fetch(`${BaseURL}/insert_session_first_data`, {
  //     method: 'POST',
  //     body: formData,
  //   })
  //     .then(response => {
  //       if (response.ok) {
  //         // If the response is successful, parse the response body as JSON
  //         return response.json();
  //       } else {
  //         // Handle error response
  //         throw new Error(response.statusText);
  //       }
  //     })
  //     .then(data => {
  //       navigation.navigate('instructionsPage', {
  //         sessionId: data.SessionID,
  //         SessiontypId: SessiontypId,
  //       });
  //     })
  //     .catch(error => {
  //       // Handle fetch error
  //       console.error('Error:', error);
  //     });
  // };

  const submitUserExercise = async () => {
    // Prepare the data to be sent
    const formData = new FormData();
    formData.append('UserID', userId);
    formData.append('DisorderID', 2);
    formData.append('SessionID', sessionId);
    formData.append('ExerciseDate', formattedDate); // Assuming exerciseDate is in 'YYYY-MM-DD' format
    formData.append('SoundIDList', JSON.stringify([])); // Use soundNames array
    formData.append('CompletionStatus', 'complete');
    formData.append('WordIDList', JSON.stringify([])); // You need to provide word IDs if necessary
    formData.append('CompletedQuestions', totalQuestions);
    formData.append('Score', percentage);
    formData.append('TotalQuestions', totalQuestions);

    console.log(formData);

    try {
      const response = await fetch(`${BaseURL}/artic_user_exercise`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // If the response is successful, parse the response body as JSON
        const responseData = await response.json();
        console.log('Exercise submitted successfully:', responseData);
      } else {
        // Handle error response
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }
    } catch (error) {
      // Handle fetch error
      console.error('ErrorExercise:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1}}>
          <CustomHeader title="Result Report" goBack={naviagteBack} />

          <View style={{alignItems: 'center', marginTop: 40}}>
            <AnimatedCircularProgress
              size={250}
              width={30}
              fill={percentage}
              tintColor="#71D860"
              onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="#FC4343"
              children={() => (
                <ProgressTextRight text={percentage.toFixed(1)} />
              )}
            />
          </View>

          <View
            style={{
              width: '95%',
              marginHorizontal: 'auto',
              // backgroundColor: 'red',
              display: 'flex',
              justifyContent: 'center',
              marginTop: 30,
            }}>
            <Text
              style={[
                styles.base,
                {
                  fontSize: 18,
                  textAlign: 'left',
                  paddingHorizontal: 20,
                },
              ]}>
              Correct Answers
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                paddingHorizontal: 20,
              }}>
              <LinearProgress
                style={{
                  marginVertical: 10,
                  borderRadius: 16,
                  height: 7,
                }}
                value={percentage / 100}
                variant="determinate"
                color="#71D860"
              />
              <Text style={[styles.base, styles.para]}>
                {percentage.toFixed(1)}%
              </Text>
            </View>
          </View>

          <View
            style={{
              width: '95%',
              marginHorizontal: 'auto',
              // backgroundColor: 'red',
              display: 'flex',
              justifyContent: 'center',
            }}>
            <Text
              style={[
                styles.base,
                {
                  fontSize: 18,
                  marginTop: 15,
                  textAlign: 'left',
                  paddingHorizontal: 20,
                },
              ]}>
              Incorrect Answers
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                paddingHorizontal: 20,
              }}>
              <LinearProgress
                style={{
                  marginVertical: 10,
                  borderRadius: 16,
                  height: 7,
                }}
                value={(100 - percentage) / 100}
                variant="determinate"
                color="#FC4343"
              />
              <Text style={[styles.base, styles.para]}>
                {(100 - percentage).toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={{marginHorizontal: 20, marginTop: 20}}>
            <Text style={[styles.base, {fontSize: 18}]}>
              List of Incorrect Sentence:
            </Text>
            <View style={{marginTop: 10}}>
              {SessiontypId === 2 ? (
                // If SessiontypId is 2, render list of sound names
                incorrectQuestions?.map((item, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.base,
                      {fontSize: 18, fontWeight: '500', marginLeft: 20},
                    ]}>
                    - {item.Sentence}
                  </Text>
                ))
              ) : (
                // If neither SessiontypId is 1 nor 2, render placeholder text
                <Text style={[styles.base, {fontSize: 18, marginLeft: 20}]}>
                  No items to display
                </Text>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20,
            marginTop: 30,
          }}>
          <DarkButton
            title="Back to Home"
            onPress={() => navigation.navigate('main')}
          />
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
  darkButton1: {
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#111920',
    padding: 10,
    justifyContent: 'center',
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 25,
    paddingRight: 25,
  },
  para: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 15,
  },
  darkButtonText1: {
    color: '#fff',
    fontWeight: '600',
  },
  lightButton1: {
    borderRadius: 50,
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 25,
    paddingRight: 25,
    borderWidth: 2,
    borderColor: '#FC4343',
  },
  lightButtonText1: {
    color: '#FC4343',
    fontWeight: '600',
  },
});

export default ResultReportArticulation;
