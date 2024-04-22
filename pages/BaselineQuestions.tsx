import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CustomHeaderBaseline from '../components/CustomHeaderBaseline';
import {useDataContext} from '../contexts/DataContext';
import BaseURL from '../components/ApiCreds';

const CustomButton = (props: any) => {
  return (
    <TouchableOpacity onPress={() => props.onPress()} style={styles.button}>
      {props.loading ? (
        <ActivityIndicator color={'white'} size={26} />
      ) : (
        <Text style={styles.buttonText}>{props.title}</Text>
      )}
    </TouchableOpacity>
  );
};

const Question = ({
  num,
  questionText,
  onSelect,
  selectedValue,
}: {
  num: number;
  questionText: string;
  onSelect: (value: boolean) => void;
  selectedValue: boolean | null;
}) => {
  return (
    <View style={{marginVertical: 15, width: '100%', alignItems: 'center'}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: '90%',
        }}>
        <Text
          style={[
            styles.base,
            {marginBottom: 10, width: '90%', textAlign: 'left'},
          ]}>
          {`Q${num}). ${questionText}`}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          width: '90%',
        }}>
        <TouchableOpacity
          onPress={() => onSelect(true)}
          style={{
            borderColor: selectedValue === true ? '#71D860' : '#ccc',
            borderWidth: 2,
            width: '40%',
            borderRadius: 100,
            paddingVertical: 8,
          }}>
          <Text style={[styles.base, {textAlign: 'center', fontWeight: '700'}]}>
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelect(false)}
          style={{
            borderColor: selectedValue === false ? '#FC4343' : '#ccc',
            borderWidth: 2,
            width: '40%',
            borderRadius: 1000,
            paddingVertical: 8,
          }}>
          <Text style={[styles.base, {textAlign: 'center', fontWeight: '700'}]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function BaselineQuestions({navigation, route}: any) {
  const {userId} = useDataContext();
  const questions = [
    'At 15 months is still not babbling.',
    'At 2 years uses less than 50 words.',
    'At 2 years not talking.',
    'At 2years the family finds it difficult to understand the speech',
    'At 2-1/2years is unable to use unique two-word phrases.',
    'At 2-1/2years is unable to use noun-verb combinations.',
    'At 3 years unable to use at least 200 words. ',
    'At 3 years unable to ask for things by name. ',
    'At 3 years is unable to speak in short sentences.',
    'At 3 years strangers are unable to understand the speech.',
    'At any age is unable to say previously learned words. ',
    'Has difficulty following directions. ',
    'Has poor pronunciation or articulation. ',
    'Is leaving words out of a sentence.',
    'Frequent coughing or sneezing loudly. ',
    'Frequent throat clearing. ',
    'Frequent screaming or shouting. ',
    'Frequent talking in noisy environments. ',
    'Frequent loud singing or class practice. ',
    'Frequent talking for extended periods of time. ',
    'Extensive number of hours of voice usage per day. ',
    'Frequent intake of caffeine products (coffee, chocolate, cocoa). ',
    'Frequent exposure to environmental irritants. ',
    'Frequent or extensive smoking. ',
    'Frequent alcohol consumption. ',
    'Frequent intake of spicy food items. ',
    'Frequent consumption of carbonated drinks. ',
    'Minimum or less number of glasses of water intake per day',
    'Frequent habit of chewing tobacco, snuff, pan etc. ',
    'Frequent infections like cold or laryngitis etc. ',
    'High pitch voice that does not match your age. ',
    'Frequent pitch breaks while talking. ',
    'Voice sounds strained, tight or breathy while talking.',
  ];

  const [isLoading, setIsLoading] = useState(false);

  const [responses, setResponses] = useState<(boolean | null)[]>(
    new Array(questions.length).fill(null),
  );

  const [first14QuestionsYes, setFirst14QuestionsYes] =
    useState<boolean>(false);
  const [question15OnwardYes, setQuestion15OnwardYes] =
    useState<boolean>(false);

  const handleSelect = (index: number, value: boolean) => {
    const updatedResponses = [...responses];
    updatedResponses[index] = value;
    setResponses(updatedResponses);
  };

  const handleSubmit = () => {
    if (responses.includes(null)) {
      // Not all questions answered
      Alert.alert(
        'Incomplete',
        'Please answer all questions before submitting.',
      );
    } else {
      console.log('Array val ==> ', responses);
      // Proceed with submission logic
      // navigation.push('profileSetupSuccess', route.params);
      const formData = new FormData();
      setIsLoading(true);

      // Append data to FormData object
      formData.append('UserID', userId);
      formData.append('Answer', JSON.stringify(responses));

      console.log('Body Data ---> ', formData);
      fetch(`${BaseURL}/add_answer`, {
        method: 'POST',
        headers: {},
        body: formData,
      })
        .then(response => {
          console.log('My result ===> ', response);
          // Check if user answered first 14 questions with "Yes"
          const first14Yes = responses
            .slice(0, 14)
            .every(value => value === true);
          setFirst14QuestionsYes(first14Yes);

          // Check if user answered question 15 onward with "Yes"
          const question15OnwardYes = responses
            .slice(14)
            .some(value => value === true);
          setQuestion15OnwardYes(question15OnwardYes);

          navigate(first14Yes, question15OnwardYes);
          console.log('My result ===> ', route.params);
        })
        .catch(error => {
          setIsLoading(false);
          console.error('here', error);
        });
    }
  };

  const navigate = (first14QuestionsYes, question15OnwardYes) => {
    setIsLoading(false);
    navigation.push('sufferingDisease', {
      ...route.params,
      first14QuestionsYes: first14QuestionsYes,
      question15OnwardYes: question15OnwardYes,
    });
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  console.log(first14QuestionsYes);
  console.log(question15OnwardYes);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomHeaderBaseline
            title="Setup Profile"
            navigation={navigation}
            goBack={() => navigation.goBack()}
          />
          <View style={{marginVertical: 15}}>
            {questions.map((questionText, index) => (
              <Question
                key={index}
                num={index + 1}
                questionText={questionText}
                onSelect={value => handleSelect(index, value)}
                selectedValue={responses[index]}
              />
            ))}
          </View>
          <CustomButton
            onPress={handleSubmit}
            title="Submit"
            loading={isLoading}
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
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: '100%',
  },
  heading: {
    paddingTop: 30,
    fontSize: 24,
    fontWeight: '500',
    maxWidth: 370,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'center',
    maxWidth: 350,
  },

  button: {
    width: '85%',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#111920',
    padding: 10,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default BaselineQuestions;
