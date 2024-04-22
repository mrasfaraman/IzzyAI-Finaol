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
import CustomHeader from '../components/CustomHeader';
import SearchIcon from '../assets/SearchIcon';
import LinearGradient from 'react-native-linear-gradient';
import CalenderIcon from '../assets/CalenderIcon';
import ReportDetails from '../components/ReportDetails';
import ExerciseDetails from '../components/ExerciseDetails';
import {useDataContext} from '../contexts/DataContext';
import BaseURL from '../components/ApiCreds';

function Card({reportData, assessment, itemNum, navigation}: any) {
  if (!reportData) {
    return null; // If reportData is null or undefined, return null to render nothing
  }

  const {AssessmentDate, DisorderName, Score} = assessment;
  const [detailsOpen, setDetailsOpen] = useState(false);

  const closeDetails = (val: any) => {
    setDetailsOpen(val);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setDetailsOpen(true)}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={['#0CC8E8', '#2DEEAA']}
          style={{
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
                paddingVertical: 10,
              }}>
              <View style={{}}>
                <Text
                  style={[
                    styles.base,
                    {fontSize: 18, fontWeight: '500', maxWidth: 250},
                  ]}>
                  {DisorderName} Assessment
                </Text>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <CalenderIcon />
                  <Text
                    style={[
                      styles.base,
                      {fontSize: 14, fontWeight: '500', marginLeft: 5},
                    ]}>
                    {new Date(AssessmentDate).toLocaleDateString('en-GB')}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.base,
                  {
                    marginLeft: 50,
                    fontSize: 20,
                    fontWeight: '800',
                    color: '#71D860',
                  },
                ]}>
                100%
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <ReportDetails
        detailsOpen={detailsOpen}
        closeDetails={closeDetails}
        reportData={reportData}
        itemNum={itemNum}
      />
    </>
  );
}

function ExerciseCard({reportData, exercise, itemNum}: any) {
  if (!reportData) {
    return null; // If reportData is null or undefined, return null to render nothing
  }

  const {ExerciseDate, DisorderName, Score} = exercise;
  const [detailsOpen, setDetailsOpen] = useState(false);

  const closeDetails = (val: any) => {
    setDetailsOpen(val);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setDetailsOpen(true)}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={['#FF8C00', '#FFD700']}
          style={{
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
              margin: 1.5,
              borderRadius: 15,
              backgroundColor: '#fff',
              padding: 16,
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <View style={{}}>
                <Text
                  style={[
                    styles.base,
                    {fontSize: 18, fontWeight: '500', maxWidth: 250},
                  ]}>
                  {DisorderName} Exercise
                </Text>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <CalenderIcon />
                  <Text
                    style={[
                      styles.base,
                      {fontSize: 14, fontWeight: '500', marginLeft: 5},
                    ]}>
                    {new Date(ExerciseDate).toLocaleDateString('en-GB')}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.base,
                  {
                    marginLeft: 50,
                    fontSize: 20,
                    fontWeight: '800',
                    color: '#71D860',
                  },
                ]}>
                {Score.toString().substring(0, 2)}%
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <ExerciseDetails
        detailsOpen={detailsOpen}
        closeDetails={closeDetails}
        reportData={reportData}
        itemNum={itemNum}
      />
    </>
  );
}

function ReportsPage({navigation}: any) {
  const {userId} = useDataContext();
  const [reportData, setReportData] = useState(null);
  const [itemNum, setItemNum] = useState(null);

  const naviagteBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseURL}/get_report/${userId}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('report: ', Object.keys(data));
          setReportData(data);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || response.statusText);
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };

    fetchData();
  }, []);

  console.log('Report', reportData);

  return (
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <CustomHeader title="Reports" goBack={naviagteBack} />

          <View style={styles.textInputContainer}>
            <View style={styles.inputContainer}>
              {/* <SearchIcon />
              <TextInput
                style={styles.textInput}
                placeholder="Search"
                placeholderTextColor={'#D6D8C0'}
              /> */}
            </View>
            {
            reportData &&
  <>
    {reportData.AssessmentResults.map((assessment, index) => (
      <View key={index} style={{marginBottom: 20}}>
        <Card
          reportData={reportData}
          assessment={assessment}
          itemNum={index}
        />
      </View>
    ))}
    {reportData.UserExercises.map((exercise, index) => (
      <View key={index} style={{marginBottom: 20}}>
        <ExerciseCard
          reportData={reportData}
          exercise={exercise}
          itemNum={index}
        />
      </View>
    ))}
  </>
}

{reportData && 
  (reportData.AssessmentResults.length === 0 && reportData.UserExercises.length === 0) ? (
    <Text
      style={{
        color: 'darkgrey',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
      }}>
      No reports yet!
    </Text>
  ) : (
    <></>
  )
}

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

export default ReportsPage;
