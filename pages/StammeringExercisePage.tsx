import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {LinearProgress} from '@rneui/themed';
import CustomHeader from '../components/CustomHeader';
import VideoPlayer from '../components/VideoPlayer';
import AudioWaveSVG from '../assets/AudioWave';
import WaveSVG from '../assets/Wave';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVModeIOSOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import {useDataContext} from '../contexts/DataContext';
import BaseURL from '../components/ApiCreds';
const audioRecorderPlayer = new AudioRecorderPlayer();

const dirs = RNFetchBlob.fs.dirs;
// const path = Platform.select({
//   ios: 'hello.mp4',
//   android: `${dirs.CacheDir}/sound.mp4`,
// });
const path = Platform.select({
  ios: 'hello.wav',
  android: `${dirs.CacheDir}/${new Date().getTime()}.wav`,
});
const audioSet: AudioSet = {
  // -----For .wav format
  AudioSourceAndroid: AudioSourceAndroidType.MIC,
  OutputFormatAndroid: OutputFormatAndroidType.DEFAULT,
  AudioEncoderAndroid: AudioEncoderAndroidType.AMR_NB,
  AudioSamplingRateAndroid: 44100,
  AudioChannelsAndroid: 2,
  AudioEncodingBitRateAndroid: 128000,

  // -----For .mp4 format
  // AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
  // AudioSourceAndroid: AudioSourceAndroidType.MIC,
  // AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
  // AVNumberOfChannelsKeyIOS: 2,
  // AVFormatIDKeyIOS: AVEncodingOption.aac,
};

const RecordButton = (props: any) => {
  return (
    <TouchableOpacity
      onPress={() => props.onPress()}
      style={styles.recordButton}>
      <Text style={styles.recordButtonText}>
        {'\u2B24'} {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const NextButton = (props: any) => {
  return (
    <TouchableOpacity onPress={() => props.onPress()} style={styles.nextButton}>
      <Text style={styles.nextButtonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const PlayButton = (props: any) => {
  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: '#FC4343',
        marginBottom: '10%',
        padding: 5,
        borderRadius: 100,
      }}>
      <TouchableOpacity
        onPress={() => props.onPress()}
        style={styles.playButton}>
        <WaveSVG />
      </TouchableOpacity>
    </View>
  );
};

function StammeringExercisePage({navigation, route}: any) {
  // Extract session ID from route params
  const sessionId = route.params?.sessionId;
  const SessiontypId = route.params?.SessiontypId;

  console.log('Session Type', SessiontypId);
  ///////////////////////////////////////////////
  const [startTime, setStartTime] = useState('');

  // useEffect hook to set the start time when the component mounts
  useEffect(() => {
    const currentStartTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    setStartTime(currentStartTime);
  }, []);

  ///////////////////////////////////////////////
  const [recordStart, setRecordStart] = useState(false);
  const [playStart, setPlayStart] = useState(false);
  const [playBtnDisable, setPlayBtnDisable] = useState(true);

  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');

  // Targeted Time In Second
  const [targetTimeInSeconds, setTargetTimeInSeconds] = useState(0);
  const [dynamicTimeInSeconds, setDynamicTimeInSeconds] = useState(0);
  const [incorrectResponseCount, setIncorrectResponseCount] = useState(0);

  const [mispronouncedWord, setMispronouncedWord] = useState('');
  const {userDetail} = useDataContext();

  useEffect(() => {
    const timeToSeconds = (time: any) => {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    };
    setTargetTimeInSeconds(timeToSeconds(duration));
  }, [duration]);

  useEffect(() => {
    const timeToSeconds = (time: any) => {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    };
    setDynamicTimeInSeconds(timeToSeconds(playTime));
  }, [playTime]);

  useEffect(() => {
    console.log('Target Time ===> ', targetTimeInSeconds);
    console.log('Dynamic Time ===> ', dynamicTimeInSeconds);
  }, [dynamicTimeInSeconds]);

  const progressPercentage = (dynamicTimeInSeconds / targetTimeInSeconds) * 100;

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  useEffect(() => {
    console.log('Curent Position ===> ', currentPositionSec);
  }, [currentPositionSec]);

  const onStartRecord = async () => {
    setPlayBtnDisable(true);
    setRecordStart(true);
    // const path = `./voices/_izzyvoice_${new Date().getTime()}.mp3`;
    const result = await audioRecorderPlayer.startRecorder(path, audioSet);
    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });
    console.log(result);
  };

  const [tries, setTries] = useState(1);
  const [wordMatched, setWordMatched] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const onStopRecord = async () => {
    setPlayBtnDisable(false);
    setRecordStart(false);
    const result = await audioRecorderPlayer.stopRecorder();

    const formData = new FormData();

    const text =
      mispronouncedWord !== '' ? mispronouncedWord : exerciseData.Sentence;

    formData.append('audio', {
      uri: result,
      // type: 'audio/mp4',
      // name: 'sound.mp4',
      type: 'audio/wav',
      name: 'sound.wav',
    });
    formData.append('sentence', text || '');

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      setRecordingStatus('loading');
      const response = await fetch(`${BaseURL}/process_sentence`, options);
      const data = await response.json();
      console.log('response of rec : ', data);

      if (data.message === 'Matched' && mispronouncedWord === '') {
        setQuestionResponse('Correct!');
        setMispronouncedWord('');
        setShowVideo(false);
        setTries(1);

        setRecordingStatus('stop');
        setIncorrectResponseCount(0);
        setCorrectAnswersCount(prevCount => prevCount + 1);
        setWordMatched(false);
      } else if (data.message === 'Matched' && mispronouncedWord !== '') {
        console.log('_____tries____', tries);
        setQuestionResponse('Correct!');

        if (tries === 5) {
          setIncorrectQuestions(prevQuestions => [
            ...prevQuestions,
            exerciseData,
          ]);

          setMispronouncedWord('');
          setWordMatched(true);
          setTries(1);

          setShowVideo(false);
          setRecordingStatus('stop');
        } else {
          setTries(prev => prev + 1);
          setMispronouncedWord('');
          setWordMatched(true);
          setShowVideo(false);
          setRecordingStatus('idle');
        }
      } else {
        // Extract the mispronounced word from the response data
        console.log('_____tries____', tries);

        if (tries === 5) {
          setIncorrectQuestions(prevQuestions => [
            ...prevQuestions,
            exerciseData,
          ]);
          setRecordingStatus('stop');
          setShowVideo(false);
          setTries(1);
          setWordMatched(true);
          setMispronouncedWord('');
        } else {
          let mispronouncedWordData = data.mispronounced_words.trim(); // Remove leading and trailing whitespace

          if (mispronouncedWordData.endsWith('.')) {
            // Remove the trailing period
            mispronouncedWordData = mispronouncedWordData.slice(0, -1);
          }

          setTries(prev => prev + 1);

          // Check if the mispronounced word is present
          if (mispronouncedWordData) {
            // Save the mispronounced word in state
            setMispronouncedWord(mispronouncedWordData);
            console.log('Word', mispronouncedWordData);
            fetchAvatarPath(mispronouncedWordData, userDetail.AvatarID);
          } else {
            console.error('No mispronounced word found in response');
          }
          setQuestionResponse('Incorrect!');
          setRecordingStatus('idle');
          setShowVideo(true);
          setWordMatched(false);
          setIncorrectResponseCount(prevCount => prevCount + 1);
        }
      }
      console.log('_______Response data______:', data);
    } catch (error) {
      console.error('Network2 request failed:', error);
    }

    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log(result);
  };

  // const onStartPlay = async () => {
  //   setPlayStart(true);
  //   console.log('onStartPlay');
  //   const msg = await audioRecorderPlayer.startPlayer();
  //   console.log(msg);
  //   audioRecorderPlayer.addPlayBackListener(e => {
  //     setCurrentPositionSec(e.currentPosition);
  //     setCurrentDurationSec(e.duration);
  //     setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
  //     setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
  //   });
  //   console.log('When Complete Stop');
  // };

  // const onPausePlay = async () => {
  //   await audioRecorderPlayer.pausePlayer();
  // };

  // const onStopPlay = () => {
  //   setPlayStart(false);
  //   console.log('onStopPlay');
  //   audioRecorderPlayer.stopPlayer();
  //   audioRecorderPlayer.removePlayBackListener();
  // };

  useEffect(() => {
    if (playTime == duration) {
      setPlayStart(false);
    }
  }, [playTime]);

  const [exerciseData, setExerciseData] = useState(null);
  const [exerciseCount, setExerciseCount] = useState(1);
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [showVideo, setShowVideo] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [questionResponse, setQuestionResponse] = useState('');
  const {userId} = useDataContext();
  const [avatarPath, setAvatarPath] = useState('');
  const sentenceID = [1, 3, 4, 9, 11, 12];

  const {setExercisesReport} = useDataContext();

  const fetchExerciseData = async (id: number) => {
    // Update id type to number
    console.log('Fetching question with ID:', id);
    try {
      const response = await fetch(
        `${BaseURL}/get_exercise_sentence/${sentenceID[id]}`,
      );

      const data = await response.json();
      console.log('response data ==> ', data);

      if (data) {
        // Extract the sentence and its ID from the response
        const {Sentence, SentenceID} = data;

        // Check if both Sentence and SentenceID are present
        if (Sentence && SentenceID) {
          // Create an object to represent the exercise data
          const exerciseItem = {Sentence, SentenceID};

          // Set the exercise data in the state
          setExerciseData(exerciseItem);
          console.log('Exercise Saved Data', exerciseItem);
        } else {
          console.error('Invalid exercise data found in response');
        }
      } else {
        console.error('No data found in response');
      }
    } catch (error) {
      console.error('Network1 request failed:', error);
    }
  };

  const fetchAvatarPath = async (wordtext, avatarid) => {
    try {
      console.log(avatarid);
      // Make a GET request to the Flask route
      const response = await fetch(
        `${BaseURL}/get_avatar_path/${wordtext}/${avatarid}`,
      );

      // Check if the response is successful
      if (response.ok) {
        const data = await response.json();
        // Handle the response data here
        console.log('Avatar path:', data.AvatarPath);
        setAvatarPath(data.AvatarPath);
      } else {
        // Handle error response
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  console.log('Session----', SessiontypId);
  const naviagte = () => {
    navigation.navigate('resultReportExercises', {
      SessiontypId: SessiontypId,
      sessionId: sessionId,
      startTime: startTime,
      correctAnswers: correctAnswersCount,
      incorrectAnswers: incorrectQuestions.length,
      incorrectQuestions: incorrectQuestions,
    });
  };

  useEffect(() => {
    console.log('------++', exerciseCount);
    if (exerciseCount <= 5) {
      setQuestionResponse('');
      fetchExerciseData(exerciseCount);
      console.log('up');
    } else {
      setExercisesReport(incorrectQuestions);
      naviagte();
    }
  }, [exerciseCount]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('exercisePage');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const naviagteBack = () => {
    navigation.navigate('exercisePage');
  };

  const percentageCompleted = ((exerciseCount - 1) / 5) * 100;

  console.log('Exercise Report', exerciseCount);
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
          <CustomHeader title="Stammering Exercise" goBack={naviagteBack} />

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
                  marginTop: 50,
                  textAlign: 'left',
                  paddingHorizontal: 20,
                },
              ]}>
              Exercise{' '}
              <Text style={{fontWeight: '700'}}> {exerciseCount} </Text>
              out of
              <Text style={{fontWeight: '700'}}> 5</Text>
            </Text>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                paddingHorizontal: 20,
                marginTop: 10,
              }}>
              <LinearProgress
                style={{
                  marginVertical: 10,
                  borderRadius: 16,
                  height: 7,
                }}
                value={percentageCompleted / 100}
                variant="determinate"
                color="#FF7A2F"
              />
              <Text style={[styles.base, styles.para]}>
                {percentageCompleted.toFixed(1)}%{' '}
              </Text>
            </View>
          </View>

          <ScrollView
            style={{marginVertical: 20, paddingHorizontal: 30, width: '100%'}}>
            {recordingStatus !== 'stop' && (
              <Text
                style={[
                  styles.base,
                  {
                    fontSize: 18,
                    fontWeight: '500',
                    width: '90%',
                    bottom: 5,
                  },
                ]}>
                Say This...
              </Text>
            )}

            {mispronouncedWord !== '' ? (
              <Text
                style={[
                  styles.base,
                  {
                    fontSize: 28,
                    fontWeight: '500',
                    width: '90%',
                    bottom: 5,
                  },
                ]}>
                {mispronouncedWord}
              </Text>
            ) : (
              <Text
                style={[
                  styles.base,
                  {
                    fontSize: 28,
                    fontWeight: '500',
                    width: '90%',
                    bottom: 5,
                  },
                ]}>
                {exerciseData ? exerciseData.Sentence : 'loading...'}
              </Text>
            )}

            {questionResponse && (
              <Text
                style={[
                  styles.base,
                  {
                    marginBottom: 30,
                    fontSize: 18,
                    fontWeight: '500',
                    width: '90%',
                    bottom: 5,
                    color: questionResponse === 'Incorrect!' ? 'red' : 'green',
                  },
                ]}>
                {questionResponse}
              </Text>
            )}

            {showVideo &&
              exerciseData &&
              avatarPath &&
              recordingStatus !== 'loading' && (
                <VideoPlayer source={{uri: `${BaseURL}${avatarPath}`}} />
              )}
          </ScrollView>

          {recordingStatus == 'loading' && (
            <View style={{alignSelf: 'center', marginBottom: 50}}>
              <ActivityIndicator size={34} color={'black'} />
            </View>
          )}

          {recordingStatus == 'idle' && (
            <RecordButton
              onPress={() => {
                onStartRecord();
                setRecordingStatus('recording');
              }}
              title="Record"
            />
          )}

          {recordingStatus == 'recording' && (
            <PlayButton
              onPress={() => {
                onStopRecord();
              }}
              title="Record"
            />
          )}

          {recordingStatus == 'stop' && (
            <NextButton
              onPress={() => {
                setRecordingStatus('idle');
                setQuestionResponse('');
                if (exerciseCount <= 5) {
                  setExerciseCount(exerciseCount + 1);
                }
              }}
              title="Next Exercise"
            />
          )}
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
    paddingTop: 50,
    fontSize: 24,
    fontWeight: '500',
  },
  para: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 15,
  },
  textInputContainer: {
    marginTop: 15,
    width: '100%',
    paddingHorizontal: 25,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
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
  nextButton: {
    width: '85%',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#71D860',
    padding: 10,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    // marginTop: 120,
    marginBottom: '10%',
  },
  nextButtonText: {
    color: '#111920',
    fontWeight: '600',
  },
  playButton: {
    width: '85%',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#FC4343',
    padding: 10,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  recordButton: {
    width: '85%',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#111920',
    padding: 10,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: '10%',
  },
  recordButtonText: {
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

export default StammeringExercisePage;
