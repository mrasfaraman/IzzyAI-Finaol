import {useState, useEffect} from 'react';
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
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.darkButton}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const RedButton = (props: any) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.redButton}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

function AssessmentPage({navigation}: any) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const {userId} = useDataContext();
  const closeDetails = (val: any) => {
    setDetailsOpen(val);
  };

  const naviagteBack = () => {
    navigation.goBack();
  };

  const [firstAnswer, setFirstAnswer] = useState<boolean>(false);
  const [secondAnswer, setSecondAnswer] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState(null);

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

          const first14Yes =
            parsedAnswers.slice(0, 14).filter(value => value).length > 7;
          setFirstAnswer(first14Yes);
          console.log('Firsts 14 Yes:', first14Yes);
          const after14Yes = parsedAnswers.slice(14).some(value => value);
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

  const SessiontypId = 1;
  const [endTimeLessThan6Hours, setEndTimeLessThan6Hours] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get the current time
    const currentTime = new Date();
  
    // Hit the API endpoint to get session details
    fetch(`${BaseURL}/get_session_details/${userId}/1/1`, {
      method: 'GET',
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
      // Check if the session is not found
      if (!data) {
        // If data is null, set endTimeLessThan6Hours to null
        setEndTimeLessThan6Hours(null);
        console.log('No data found');
        setLoading(false);
        return;
      }
  
      // Check if the session is not found
      if (data.error && data.error === 'Session not found.') {
        // If session not found, set endTimeLessThan6Hours to false (assuming it's okay to proceed)
        setEndTimeLessThan6Hours(false);
        console.log('Session not found');
        setLoading(false);
        return;
      }
  
      // Log the end time received from the API
      console.log('End Time:', data.EndTime);
  
      // Convert end time to a Date object
      const endTime = new Date(data.EndTime);
  
      // Calculate the difference in milliseconds
      const timeDifferenceInMilliseconds =
        endTime.getTime() - currentTime.getTime();

        console.log("Disfferrnce-------",timeDifferenceInMilliseconds);
  
      // Check if end time is less than 6 hours
      const isLessThan6Hours =
        timeDifferenceInMilliseconds < 6 * 60 * 60 * 1000;
  
      // Set the state based on whether the time difference is less than 6 hours
      setEndTimeLessThan6Hours(isLessThan6Hours);
      setLoading(false);
    })
    .catch(error => {
            setLoading(false);
    });
  }, []);
  
  // Log the state to the console
  console.log('endTimeLessThan6Hour:', endTimeLessThan6Hours);
  
  // Show "No data found" message if loading is false and endTimeLessThan6Hours is null
  if (!loading && endTimeLessThan6Hours === null) {
    console.log('No data found');
  }
  

  const handleButtonClick = () => {
 if (endTimeLessThan6Hours === true) {
      alert('Please wait for 6 hours to start an assessment again');
      return;
    }
    
if (endTimeLessThan6Hours === null || endTimeLessThan6Hours === false) {
      const formData = new FormData();
      formData.append('UserID', userId);
      formData.append('SessionTypeID', 1);

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
          navigation.navigate('instructionsPage', {
            sessionId: data.SessionID,
            SessiontypId: SessiontypId,
          });
        })
        .catch(error => {
          // Handle fetch error
          console.error('Error:', error);
        });
    }
  };

  const handleButtonClickStammering = () => {
    // Hit the API endpoint with userId and sessionTypeId
    const formData = new FormData();
    formData.append('UserID', userId);
    formData.append('SessionTypeID', 1);
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
        setDetailsOpen(!detailsOpen);
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
    formData.append('SessionTypeID', 1);
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
        navigation.navigate('scanfaceInstruction', {
          sessionId: data.SessionID,
          routeName: 'voiceDisorderPage',
          nextPage: 'faceauthenticationscreenmain',
        });
      })
      .catch(error => {
        // Handle fetch error
        console.error('Error:', error);
      });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {sessionId && (
          <AssessmentDetails
            navigation={navigation}
            detailsOpen={detailsOpen}
            closeDetails={closeDetails}
            sessionId={sessionId}
          />
        )}

        <View style={styles.container}>
          <CustomHeader title="Assessment" goBack={naviagteBack} />

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
                Speech Articulation
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <DocumentIcon />
                <Text style={[styles.base, styles.para]}>44 Labels</Text>
              </View>
            </View>
            {/* {!secondAnswer && ( */}
            <DarkButton onPress={handleButtonClick} title="Start" />
            {/* )} */}
          </View>

          {/* <View style={styles.cardContainer2}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View>
                <Text style={[styles.base, styles.heading]}>
                  Speech Articulation
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <DocumentIcon />
                  <Text style={[styles.base, styles.para]}>129 Questions</Text>
                </View>
              </View>
              <RedButton
                onPress={() => navigation.navigate('speechArticulationPage')}
                title="Resume"
              />
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                marginTop: 10,
              }}>
              <LinearProgress
                style={{
                  marginVertical: 10,
                  borderRadius: 16,
                  height: 7,
                }}
                value={0.24}
                variant="determinate"
                color="#FF7A2F"
              />
              <Text style={[styles.base, styles.para]}>24%</Text>
            </View>
          </View> */}

          <View style={styles.cardContainer}>
            <View>
              <Text style={[styles.base, styles.heading]}>
                Stammering Passages
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <DocumentIcon />
                <Text style={[styles.base, styles.para]}>2 Passages</Text>
              </View>
            </View>
            {/* {!secondAnswer && ( */}
            <DarkButton onPress={handleButtonClickStammering} title="Start" />
            {/* )} */}
          </View>

          <View style={styles.cardContainer}>
            <View>
              <Text style={[styles.base, styles.heading]}>Voice Disorder</Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <DocumentIcon />
                <Text style={[styles.base, styles.para]}>3 Questions</Text>
              </View>
            </View>
            {/* {!firstAnswer && (
    <DarkButton
      onPress={() => setDetailsOpen(!detailsOpen)}
      title="Start"
    />
  )} */}
            <DarkButton onPress={handleButtonClickVoice} title="Start" />
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
    marginBottom: 30,
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

export default AssessmentPage;
