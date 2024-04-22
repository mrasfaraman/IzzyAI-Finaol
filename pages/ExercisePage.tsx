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
import {LinearProgress} from '@rneui/themed';
import CustomHeader from '../components/CustomHeader';
import SearchIcon from '../assets/SearchIcon';
import DocumentIcon from '../assets/DocumentIcon';
import AssessmentDetails from '../components/AssessmentDetails';
import {useDataContext} from '../contexts/DataContext';
import BaseURL from '../components/ApiCreds';

const DarkButton = (props: any) => {
  const isDisabled = props.disabled;
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.darkButton, isDisabled ? {opacity: 0.3} : {}]}
      disabled={isDisabled}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

function ExercisePage({navigation}: any) {
  const {userId, updateUserDetail, userDetail} = useDataContext();
  const naviagteBack = () => {
    navigation.goBack();
  };

  const [firstAnswer, setFirstAnswer] = useState<boolean>(false);
  const [secondAnswer, setSecondAnswer] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState(null);

  const [isAssessed, setIsAssessed] = useState(true);

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
        setSumQuestion(sum);
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
    const fetchReportsData = async () => {
      try {
        const response = await fetch(`${BaseURL}/get_report/${userId}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('AssessmentResults', data.AssessmentResults);
          const hasArticulationReport = data.AssessmentResults.some(
            result => result?.DisorderName === 'Articulation',
          );
          console.log('Has Articulation Report:', hasArticulationReport);
          setIsAssessed(hasArticulationReport);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || response.statusText);
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };

    fetchReportsData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseURL}/get_answers/${userId}`);
        const responseData = await response.json();
        console.log('Answers Array:', responseData);

        if (responseData.answers && responseData.answers.length > 0) {
          // Extract the JSON string from the array
          const jsonString = responseData.answers[0];

          // Extract the inner array from the JSON string
          const innerArrayString = jsonString.match(/\[(.*?)\]/)[0];

          // Parse the inner array string into an array of booleans
          const parsedAnswers = JSON.parse(innerArrayString);

          // Check if the first 14 elements of the first array are all true
          const first14Yes = parsedAnswers
            .slice(0, 14)
            .every(value => value === true);
          setFirstAnswer(first14Yes);
          console.log('Firsts 14 Yes:', first14Yes);
          const after14Yes = parsedAnswers
            .slice(14)
            .every(value => value === true);
          setSecondAnswer(after14Yes);
          console.log('After 14 Yes:', after14Yes);
        } else {
          console.log('No answers found.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const SessiontypId = 2;

  const handleButtonClick = () => {
    // Hit the API endpoint with userId and sessionTypeId
    const formData = new FormData();
    formData.append('UserID', userId);
    formData.append('SessionTypeID', 2);
    console.log('Body Data ---> ', formData);

    fetch(`${BaseURL}/insert_session_first_data`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          // If the response is successful, parse the response body as JSON
          return response.json();
        } else {
          // Handle error response
          throw new Error(response.statusText);
        }
      })
      .then(data => {
        // Log the newly generated session ID
        console.log('New Session ID:', data.SessionID);

        // Navigate to instructionsPage and pass the session ID as a parameter
        navigation.navigate('speechExcercisePage', {
          sessionId: data.SessionID,
          SessiontypId: SessiontypId,
        });
      })
      .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
      });
  };

  const handleButtonClickStammering = () => {
    // Hit the API endpoint with userId and sessionTypeId
    const formData = new FormData();
    formData.append('UserID', userId);
    formData.append('SessionTypeID', 2);
    console.log('Body Data ---> ', formData);

    fetch(`${BaseURL}/insert_session_first_data`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          // If the response is successful, parse the response body as JSON
          return response.json();
        } else {
          // Handle error response
          throw new Error(response.statusText);
        }
      })
      .then(data => {
        // Log the newly generated session ID
        console.log('New Session ID:', data.SessionID);
        setSessionId(data.SessionID);
        // Navigate to instructionsPage and pass the session ID as a parameter
        navigation.navigate('stammeringExercisePage', {
          sessionId: data.SessionID,
          SessiontypId: SessiontypId,
        });
      })
      .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
      });
  };

  const handleButtonClickVoice = () => {
    // Hit the API endpoint with userId and sessionTypeId
    const formData = new FormData();
    formData.append('UserID', userId);
    formData.append('SessionTypeID', 2);
    console.log('Body Data ---> ', formData);

    fetch(`${BaseURL}/insert_session_first_data`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          // If the response is successful, parse the response body as JSON
          return response.json();
        } else {
          // Handle error response
          throw new Error(response.statusText);
        }
      })
      .then(data => {
        // Log the newly generated session ID
        console.log('New Session ID:', data.SessionID);

        // Navigate to instructionsPage and pass the session ID as a parameter
        navigation.navigate('voiceExercisePage', {sessionId: data.SessionID});
      })
      .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
      });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomHeader title="Exercise" goBack={naviagteBack} />

          <View style={styles.textInputContainer}>
            <View style={styles.inputContainer}>
              {/* <SearchIcon />
              <TextInput
                style={styles.textInput}
                placeholder="Search"
                placeholderTextColor={'#D6D8C0'}
              /> */}
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View>
              <Text style={[styles.base, styles.heading]}>
                Articulation Exercise
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <DocumentIcon />
                <Text style={[styles.base, styles.para]}>
                  {userDetail.totalQuestion} Questions
                </Text>
              </View>
            </View>

            <DarkButton
              onPress={handleButtonClick}
              title="Start"
              disabled={!isAssessed}
            />

            {/* )} */}
          </View>
          <View style={styles.cardContainer}>
            <View>
              <Text style={[styles.base, styles.heading]}>
                Stammering Exercise
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <DocumentIcon />
                <Text style={[styles.base, styles.para]}>5 Statements</Text>
              </View>
            </View>
            {/* {!secondAnswer && ( */}
            <DarkButton onPress={handleButtonClickStammering} title="Start" />
            {/* )} */}
          </View>

          <View style={styles.cardContainer}>
            <View>
              <Text style={[styles.base, styles.heading, {width: '95%'}]}>
                Voice Disorder Exercise
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <DocumentIcon />
                <Text style={[styles.base, styles.para]}>2 Games</Text>
              </View>
            </View>

            <DarkButton
              onPress={() => navigation.navigate('voiceExerciseGame')}
              title="Start"
            />
          </View>
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
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: '100%',
  },
  heading: {
    fontSize: 22,
    fontWeight: '500',
  },
  para: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  textInputContainer: {
    marginTop: 45,
    width: '100%',
    paddingHorizontal: 25,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: '#0CC8E8',
    borderRadius: 16,
    padding: 14,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginTop: 30,
  },
  cardContainer2: {
    borderWidth: 1,
    borderColor: '#0CC8E8',
    borderRadius: 16,
    padding: 14,
    // display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    width: '90%',
    marginTop: 30,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  textInput: {
    backgroundColor: '#F8F8F8',
    paddingLeft: 4,
    color: '#111920',
    fontSize: 16,
    width: '80%',
    margin: 5,
    // marginRight: 'auto',
  },
  darkButton: {
    marginLeft: 'auto',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#111920',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 24,
    paddingRight: 24,
  },
  redButton: {
    marginLeft: 'auto',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#FC4343',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 24,
    paddingRight: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
  },
  bold: {
    fontWeight: '700',
  },
});

export default ExercisePage;
