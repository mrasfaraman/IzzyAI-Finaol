import React, {useState, useEffect, useRef} from 'react';
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
  Dimensions,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {Icon, LinearProgress} from '@rneui/themed';
import CustomHeader from '../components/CustomHeader';
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
import Loader from '../components/Loader';
import {useCameraDevice, Camera} from 'react-native-vision-camera';

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

const EndButton = (props: any) => {
  return (
    <TouchableOpacity onPress={() => props.onPress()} style={styles.endButton}>
      <Text style={styles.endButtonText}>{props.title}</Text>
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

const PrevButton = (props: any) => {
  return (
    <TouchableOpacity onPress={() => props.onPress()} style={styles.prevBtn}>
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
        marginTop: 20,
      }}>
      <TouchableOpacity
        onPress={() => props.onPress()}
        style={styles.playButton}>
        <WaveSVG />
      </TouchableOpacity>
    </View>
  );
};

const IzzyDialogue = ({
  showSecondLine,
  question,
  secondLine = '',
  highlightIndexes = [],
}: any) => {
  // Function to generate highlighted text

  const generateHighlightedText = (text: string, indexes: number[]) => {
    return text.split('').map((letter, index) => {
      const isHighlighted = indexes.includes(index);
      return isHighlighted ? (
        <Text
          key={index}
          style={[
            styles.base,
            {
              color: 'red',
              textTransform: index === 0 ? 'uppercase' : 'lowercase',
              fontSize: 18,
            },
          ]}>
          {letter}
        </Text>
      ) : (
        <Text
          key={index}
          style={[
            styles.base,
            {
              marginLeft: 1,
              fontSize: 18,
              textTransform: index === 0 ? 'uppercase' : 'lowercase',
            },
          ]}>
          {letter}
        </Text>
      );
    });
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '90%',
        marginTop: 30,
        gap: 15,
      }}>
      {showSecondLine ? (
        <Image key="image" source={require('../assets/images/izzy_bot.png')} />
      ) : question === 'Correct!' ? (
        <Icon name="check" size={25} color={'green'} />
      ) : (
        <Icon name="close" size={25} color={'red'} solid />
      )}
      <View style={{justifyContent: 'space-between'}}>
        {showSecondLine ? (
          <Text
            key="question"
            style={[styles.base, {maxWidth: 230, fontSize: 15}]}>
            {question}
          </Text>
        ) : (
          <Text
            key="question"
            style={[
              styles.base,
              {maxWidth: 200, fontSize: 18, fontWeight: '600'},
            ]}>
            {question}
          </Text>
        )}
        {showSecondLine && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 5,
            }}>
            {generateHighlightedText(secondLine, highlightIndexes)}
          </View>
        )}
      </View>
    </View>
  );
};

const UserDialogue = ({showSecondLine, username}: any) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '90%',
        marginTop: 30,
        marginRight: 20,
      }}>
      <AudioWaveSVG />
      <View style={{marginLeft: 10, marginTop: 10}}>
        <Image
          style={{height: 32, width: 32, borderRadius: 100}}
          source={require('../assets/images/avatar.png')}
        />
        <Text style={[styles.base, {textAlign: 'center'}]}>{username}</Text>
      </View>
    </View>
  );
};

function SpeechArticulationPage({navigation, route}: any) {
  // Extract session ID from route params
  const sessionId = route.params?.sessionId;
  const SessiontypId = route.params?.SessiontypId;
  const cameraRef = useRef(null);
  const device = useCameraDevice('front');
  const [hack, doHack] = useState(0);
  const width = Dimensions.get('screen').width;

  const newCameraInit = () => {
    setTimeout(() => {
      doHack(1);
    }, 100);
  };

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

  const [recordStart, setRecordStart] = useState(false);
  const [playStart, setPlayStart] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [playBtnDisable, setPlayBtnDisable] = useState(true);

  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');

  const [isLoading, setIsLoading] = useState(false);

  // Targeted Time In Second
  const [targetTimeInSeconds, setTargetTimeInSeconds] = useState(0);
  const [dynamicTimeInSeconds, setDynamicTimeInSeconds] = useState(0);

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
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

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
    const result = await audioRecorderPlayer.startRecorder(path, audioSet);
    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });

    if (cameraRef.current) {
      setPlayStart(true);
      setIsRecording(true);
      console.log('Recording started');
      await cameraRef.current.startRecording({
        fileType: 'mp4',
        videoBitRate: 'normal',
        videoCodec: 'h264',
        onRecordingFinished: video => {
          console.log('Video recording successful:', video);
          // Handle successful recording (e.g., navigate to next page)
          sendVideo(video.path);
        },
        onRecordingError: error => {
          console.error('Error recording video:', error);
          // Handle recording error (e.g., display error message to user)
        },
      });
    } else {
      console.error('Camera ref is null');
    }
    console.log(result);
  };

  const sendVideo = async (newVideoPath: any) => {
    console.log('Video Path:', newVideoPath);

    const fileName = userId + '_' + questionCount + '.mp4';
    console.log('File Name:', fileName);
    // Define the URL to which you want to send the video

    // Prepare the data to be sent in the request
    const formData = [
      {
        name: 'file',
        filename: fileName,
        type: 'video/mp4',
        data: RNFetchBlob.wrap(newVideoPath),
      },
    ];

    try {
      setRecordingStatus('loading');
      // Make the request using RNFetchBlob
      const response = await RNFetchBlob.fetch(
        'POST',
        BaseURL + '/upload_video_articulation',
        {
          'Content-Type': 'multipart/form-data',
        },
        formData,
      );

      // if (response.status === 200) {
      //   console.log('Sending Audio...');
      //   sendAudio(audioResult);
      // }

      // Log the response text
      console.log('Response:', response.text());
    } catch (error) {
      // Log any errors that occur
      console.error('Error:', error);
    } finally {
      setRecordingStatus('stop');
    }
  };

  const sendAudio = async (newAudioPath: any) => {
    console.log('Audio Path:', newAudioPath);

    const formData = new FormData();
    formData.append('audio', {
      uri: newAudioPath,
      // type: 'audio/mp4',
      // name: 'sound.mp4',
      type: 'audio/wav',
      name: 'sound.wav',
    });
    formData.append('text', questionData.WordText || '');

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const response = await fetch(`${BaseURL}/process_speech`, options);
      const data = await response.json();
      console.log('response of rec : ', data);

      if (data.message === 'Matched') {
        setQuestionResponse('Correct!');
        setCorrectAnswersCount(prevCount => prevCount + 1);
        // Add questionData to correctQuestions if not already present
        if (!correctQuestions.includes(questionData.WordID)) {
          setCorrectQuestions(prevQuestions => [
            ...prevQuestions,
            questionData.WordID,
          ]);
        }
        // Remove questionData from incorrectQuestions if present
        if (incorrectQuestions.some(q => q.WordID === questionData.WordID)) {
          setIncorrectQuestions(prevQuestions =>
            prevQuestions.filter(q => q.WordID !== questionData.WordID),
          );
        }
      } else {
        // Check if the questionData is already in incorrectQuestions
        if (!incorrectQuestions.some(q => q.WordID === questionData.WordID)) {
          setIncorrectQuestions(prevQuestions => [
            ...prevQuestions,
            questionData,
          ]);
          console.log('--------ok--------');
        }

        // Decrement correct answers count if the questionData was previously marked as correct
        if (correctQuestions.includes(questionData.WordID)) {
          setCorrectAnswersCount(prevCount => prevCount - 1);
          setCorrectQuestions(prevQuestions =>
            prevQuestions.filter(q => q !== questionData.WordID),
          );
        }

        console.log(incorrectQuestions);

        setQuestionResponse('Incorrect!');
      }
    } catch (error) {
      console.error('Network request failed:', error);
    }

    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);

    const fileName = userId + '_' + questionCount + '.wav';
    console.log('Audio File Name:', fileName);

    const uploadFormData = new FormData();
    uploadFormData.append('file', {
      uri: newAudioPath,
      type: 'audio/wav',
      name: fileName,
    });

    const uploadOptions = {
      method: 'POST',
      body: uploadFormData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      await fetch(`${BaseURL}/upload_audio_articulation`, uploadOptions);
      console.log('Audio sent to upload_audio_articulation');
    } catch (error) {
      console.error('Network request failed:', error);
    }
  };

  const onStopRecord = async () => {
    setPlayStart(false);
    setIsRecording(false);
    await cameraRef.current.stopRecording();

    setPlayBtnDisable(false);
    setRecordStart(false);

    const result = await audioRecorderPlayer.stopRecorder();
    sendAudio(result);
  };

  useEffect(() => {
    if (playTime == duration) {
      setPlayStart(false);
    }
  }, [playTime]);

  const [questionResponse, setQuestionResponse] = useState('');
  const [questionData, setQuestionData] = useState(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [correctQuestions, setCorrectQuestions] = useState([]);

  const {userId} = useDataContext();

  const {setArticulationReport}: any = useDataContext();

  const fetchQuestionData = async (id: number) => {
    // Update id type to number
    console.log('Fetching question with ID:', id);
    try {
      if (questionCount <= 44) {
        setIsLoading(true);
        const response = await fetch(`${BaseURL}/get_assess_word/${id}`);
        const data = await response.json();
        console.log('response data ==> ', data);
        if (data) {
          setQuestionData(data);
          console.log('question data___: ', data);
        }
      }
    } catch (error) {
      console.error('Network request failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log('-------------------Question', questionData);

  // useEffect(() => {
  //   const sessionId = 81; // Provide the session ID here

  //   const checkSessionUpdateAPI = async () => {
  //     try {
  //       const sessionData = {
  //         SessionStatus: 'complete',
  //       };

  //       const response = await fetch(`${BaseURL}/second_session_update/${sessionId}`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(sessionData),
  //       });

  //       if (response.ok) {
  //         const responseData = await response.json();
  //         console.log('Session update response:', responseData);
  //       } else {
  //         const errorResponse = await response.json(); // Parse error response
  //         console.error('Failed to update session:', errorResponse.message); // Log specific error message
  //       }
  //     } catch (error) {
  //       console.error('Error updating session:', error); // Log generic error
  //     }
  //   };

  //   // Call the function when the component mounts
  //   checkSessionUpdateAPI();
  // }, []);

  useEffect(() => {
    if (questionCount <= 44) {
      console.log('Question: ____ ', questionCount);
      setQuestionResponse('');
      fetchQuestionData(questionCount);
    } else {
      console.log('Question: ____ ', questionCount);
      setArticulationReport(incorrectQuestions);
      navigateTo();
    }
  }, [questionCount]);

  const navigateTo = () => {
    console.log('inc___', incorrectQuestions.length);
    console.log('incorrectQuest', incorrectQuestions);
    console.log('cor___', questionCount);
    navigation.navigate('resultReport', {
      sessionId: sessionId,
      startTime: startTime,
      SessiontypId: SessiontypId,
      correctAnswers: correctAnswersCount,
      incorrectAnswers: incorrectQuestions.length,
      incorrectQuestions: incorrectQuestions,
    });
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('assessmentPage');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const naviagteBack = () => {
    navigation.navigate('assessmentPage');
  };

  const endAssessment = () => {
    console.log('Question: ____ ', questionCount);
    setArticulationReport(incorrectQuestions);
    navigateTo();
  };

  const percentageCompleted = ((questionCount - 1) / 44) * 100;

  return (
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <CustomHeader title="Speech Articulation" goBack={naviagteBack} />

          <Text
            style={[
              styles.base,
              {textAlign: 'center', marginTop: 15, fontSize: 15},
            ]}>
            Place your face in the camera below while speaking
          </Text>
          <View style={styles.cameraView}>
            <Camera
              ref={cameraRef}
              device={device}
              isActive={true}
              video={true}
              audio={false}
              style={[StyleSheet.absoluteFill, {width: width + hack}]}
              onInitialized={() => newCameraInit()}
              zoom={0}
            />
          </View>
          <View
            style={{
              width: '95%',
              marginHorizontal: 'auto',
              // backgroundColor: 'red',
              display: 'flex',
              justifyContent: 'center',
            }}>
            {isLoading ? <Loader loading={isLoading} /> : <></>}
            <Text
              style={[
                styles.base,
                {
                  fontSize: 18,
                  marginTop: 30,
                  textAlign: 'left',
                  paddingHorizontal: 20,
                },
              ]}>
              Question{' '}
              <Text style={{fontWeight: '700'}}>
                {' '}
                {questionCount > 44 ? 44 : questionCount}{' '}
              </Text>
              out of
              <Text style={{fontWeight: '700'}}> 44</Text>
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
                {percentageCompleted.toFixed(1)}%
              </Text>
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: '#0CC8E8',
                borderRadius: 16,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                paddingHorizontal: 20,
                marginHorizontal: 20,
              }}>
              {questionData && (
                <Image
                  style={{marginVertical: 20, width: 200, height: 200}}
                  //  source={require('../assets/images/piano.png')}
                  source={{uri: `${BaseURL}${questionData.PictureUrl}`}}
                />
              )}
            </View>
          </View>

          <ScrollView style={{marginVertical: 5, marginBottom: 10}}>
            {questionData && (
              <IzzyDialogue
                question="Say this..."
                secondLine={questionData && questionData.WordText}
                showSecondLine
                highlightIndexes={
                  questionData && questionData.HighlightWord
                    ? JSON.parse(questionData.HighlightWord)
                    : []
                }
              />
            )}
            {recordingStatus == 'loading' && (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: 30,
                  alignSelf: 'center',
                }}>
                <ActivityIndicator size={30} color={'black'} />
              </View>
            )}
            {recordingStatus == 'stop' && questionResponse && (
              <IzzyDialogue question={questionResponse} />
            )}
          </ScrollView>
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
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 20,
                width: '100%',
                marginBottom:'10%'
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,

                  gap: 10,
                }}>
                {questionCount !== 1 && (
                  <PrevButton
                    onPress={() => {
                      setRecordingStatus('idle');
                      setQuestionResponse(''); // Clear previous response
                      if (questionCount >= 1) {
                        setQuestionCount(prevCount => prevCount - 1);
                      }
                    }}
                    title="Previous Question"
                  />
                )}
                <NextButton
                  onPress={() => {
                    setRecordingStatus('idle');
                    setQuestionResponse(''); // Clear previous response
                    if (questionCount <= 44) {
                      setQuestionCount(prevCount => prevCount + 1);
                    }
                  }}
                  title="Next Question"
                />
              </View>
              <EndButton onPress={() => endAssessment()} title="End Now" />
            </View>
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
  // Define the resultsDisplayContainer style here
  resultsDisplayContainer: {
    alignItems: 'center',
    marginTop: 0,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '90%',
    backgroundColor: '#f0f0f0', // light gray background for visibility
  },
  resultsContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0, // Adjust based on your layout
  },
  resultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 2, // For better spacing between result texts
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
  prevBtn: {
    width: '42%',
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    height: 50,
    justifyContent: 'center',
  },
  nextButton: {
    width: '42%',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#71D860',
    padding: 10,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    // marginTop: 120,
  },
  nextButtonText: {
    color: '#111920',
    fontWeight: '600',
  },
  endButton: {
    width: '42%',
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    height: 50,
    justifyContent: 'center',
    // marginTop: 120,
  },
  endButtonText: {
    color: 'white',
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
    marginTop: 20,
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
  cameraView: {
    height: 250,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default SpeechArticulationPage;
