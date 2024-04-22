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
  Dimensions
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
import {CommonActions} from '@react-navigation/native';
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

function VoiceDisorderPage({navigation, route}: any) {
  //   Extract session ID from route params
  const sessionId = route.params?.sessionId;

  const cameraRef = useRef(null);
  const device = useCameraDevice('front');
  const [hack, doHack] = useState(0);
  const width = Dimensions.get('screen').width;

  const newCameraInit = () => {
    setTimeout(() => {
      doHack(1);
    }, 100);
  };
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
  const [isRecording, setIsRecording] = useState(false);
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [predictionsData, setPredictionsData] = useState(null);
  const [questionScores, setQuestionScores] = useState([]);

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
  };

  const sendVideo = async (newVideoPath: any) => {
    console.log('Video Path:', newVideoPath);

    const fileName = userId + '_' + exerciseCount + '.mp4';
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
        BaseURL + '/upload_video_voice',
        {
          'Content-Type': 'multipart/form-data',
        },
        formData,
      );

      if (response){
        setTimeout(() => {
          setIsModalVisible(true);
        }, 2000);
      }

      // Log the response text
      console.log('Response:', response.text());
    } catch (error) {
      // Log any errors that occur
      console.error('Error:', error);
    } finally {
      setRecordingStatus('stop');
    }
  };

  const onStopRecord = async () => {
    setPlayStart(false);
    setIsRecording(false);
    await cameraRef.current.stopRecording();

    setPlayBtnDisable(false);
    setRecordStart(false);
    const result = await audioRecorderPlayer.stopRecorder();

    const formData = new FormData();
    formData.append('audio', {
      uri: result,
      // type: 'audio/mp4',
      // name: 'sound.mp4',
      type: 'audio/wav',
      name: 'sound.wav',
    });

    const options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const response = await fetch(
        `${BaseURL}/predict_voice_disorder`,
        options,
      );
      const data = await response.json();
      console.log('response of rec : ', data);

      if (response.ok) {
        console.log('Done');
        // Extract score from predictions data
        const score = parseFloat(data.predictions.Normal);

        // Update questionScores array with the new score
        setQuestionScores(prevScores => [...prevScores, score]);
      } else {
        setRecordingStatus('idle');
      }
      setPredictionsData(data.predictions);
      console.log('_______Response data______:', data);
    } catch (error) {
      console.error('Network2 request failed:', error);
    }

    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log(result);

    const fileName = userId + '_' + exerciseCount + '.wav';
    console.log('Audio File Name:', fileName);

    const uploadFormData = new FormData();
    uploadFormData.append('file', {
      uri: result,
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
      await fetch(`${BaseURL}/upload_audio_voice`, uploadOptions);
      console.log('Audio sent to upload_audio_voice');
    } catch (error) {
      console.error('Network request failed:', error);
    }

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
  const [showVideo, setShowVideo] = useState(true);
  const [incorrentQuestions, setIncorrectQuestions] = useState([]);
  const [questionResponse, setQuestionResponse] = useState('');
  const {userId} = useDataContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [userData, setUserData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('User ID:', userId);
        const response = await fetch(`${BaseURL}/get_user_profile/${userId}`);
        const userData = await response.json();
        console.log('User data from API:', userData);

        // Save user data in state
        setUserData(userData);

        console.log('sfdaa', userData);
        setAvatarUrl(userData.AvatarID);

        // Fetch avatar URL if userData contains AvatarId
        // if (userData?.AvatarID) {
        //   const avatarId = userData.AvatarID; // Use optional chaining to safely access AvatarId
        //   const response = await fetch(`${BaseURL}/get_avatar/${avatarId}`);
        //   const avatarData = await response.json();

        //   if (avatarData && avatarData.AvatarID) {
        //     console.log('sadas', avatarData);
        //     setAvatarUrl(avatarData.AvatarID);
        //     console.log(avatarData.AvatarID);
        //   }
        // }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (verificationResult !== null) {
      addFeedback();
    }
  }, [verificationResult]);

  const addFeedback = async () => {
    try {
      const formData = new FormData();
      formData.append('UserID', userId);
      formData.append('DisorderID', 2);
      formData.append('ModelOutput', `VoiceDisorder ${averageScore}`);
      formData.append('FeedbackAnswer', verificationResult);
      console.log('Form Data ---> ', formData);

      const response = await fetch(`${BaseURL}/add_user_feedback`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('ok');
        // navigation.navigate('main');

        console.log('Feedback added successfully:', responseData);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      console.error('Error posting Feedback result:', error);
      throw error;
    }
  };
  const handleYes = () => {
    setVerificationResult('Yes');
    setIsModalVisible(false);
  };

  const handleNo = () => {
    setVerificationResult('No');
    setIsModalVisible(false);
  };

  const {setExercisesReport} = useDataContext();

  const fetchExerciseData = async (id: number) => {
    console.log('Fetching', id);

    try {
      if (exerciseCount <= 3) {
        const response = await fetch(
          `${BaseURL}/get_voice_disorders/${avatarUrl}`,
        );
        console.log('response->>', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('response data ==> ', data);

        if (data) {
          setExerciseData(data.voice_disorder);
          console.log('Exercise Saved Data', data.voice_disorder);
        } else {
          console.error('Response data is undefined or empty');
        }
      }
    } catch (error) {
      console.error('Network1 request failed:', error);
    }
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
      formData.append('SessionID', sessionId);
      formData.append('DisorderID', 3);
      formData.append('AssessmentDate', formattedDate);
      formData.append('Score', averageScore);
      console.log('Form Data ---> ', formData);
      const response = await fetch(`${BaseURL}/add_assessment_voice_disorder`, {
        method: 'POST',
        body: formData,
      });
      console.log('asfd', response);

      if (response.ok) {
        const responseData = await response.json();

        console.log(
          'Assessment vocie result added successfully:',
          responseData,
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
    } catch (error) {
      console.error('Error posting assessment stammering result:', error);
      throw error;
    }
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

  useEffect(() => {
    if (exerciseCount <= 3) {
      setQuestionResponse('');
      if (avatarUrl) {
        fetchExerciseData(exerciseCount);
      }
    } else {
      setExercisesReport(incorrentQuestions);

      addAssessmentResult();
      navigation.navigate('assessmentPage');
    }
  }, [exerciseCount, avatarUrl]);

  const naviagteBack = () => {
    navigation.navigate('assessmentPage');
  };
  const percentageCompleted = ((exerciseCount - 1) / 3) * 100;

  console.log('Exercise Report', exerciseCount);
  const averageScore =
    questionScores.length > 0
      ? (
          questionScores.reduce((acc, score) => acc + score, 0) /
          questionScores.length
        ).toFixed(2)
      : 0;
  console.log('Average', averageScore);
  return (
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <CustomHeader title="Voice Disorder" goBack={naviagteBack} />
          <Text style={[styles.base, {textAlign: 'center', marginTop: 15, fontSize: 15}]}>
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
              Assesment{' '}
              <Text style={{fontWeight: '700'}}>
                {' '}
                {exerciseCount > 3 ? 3 : exerciseCount}{' '}
              </Text>
              out of
              <Text style={{fontWeight: '700'}}> 3</Text>
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

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                paddingHorizontal: 20,
                marginHorizontal: 20,
              }}>
              {exerciseData && (
                <VideoPlayer
                  source={{uri: `${BaseURL}${exerciseData.VideoUrl}`}}
                />
              )}
            </View>
          </View>

          <ScrollView style={{marginVertical: 20, marginTop: 10}}>
            <Text
              style={[
                styles.base,
                {fontSize: 18, fontWeight: '500', marginTop: 10},
              ]}>
              Say This...
            </Text>

            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text
                style={[
                  styles.base,
                  {
                    color: '#FC4343',
                    fontSize: 32,
                    fontWeight: '500',
                    textTransform: 'uppercase',
                  },
                ]}
              />
              <Text style={[styles.base, {fontSize: 32, fontWeight: '500'}]}>
                {exerciseData ? exerciseData.WordText : 'loading'}
              </Text>
            </View>

            {recordingStatus == 'stop' && predictionsData && (
              <View style={{marginTop: 10}}>
                <Text
                  style={[
                    styles.base,
                    {fontSize: 20, fontWeight: '500', color: 'black'},
                  ]}>
                  Label: Normal
                </Text>
                <Text
                  style={[
                    styles.base,
                    {
                      fontSize: 18,
                      fontWeight: '500',
                      color: 'green',
                      marginTop: 10,
                    },
                  ]}>
                  Score: {predictionsData.Normal}
                </Text>
              </View>
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

          {recordingStatus === 'stop' && (
            <NextButton
              onPress={() => {
                setRecordingStatus('idle');
                setQuestionResponse('');
                if (exerciseCount <= 3) {
                  setExerciseCount(exerciseCount + 1);
                }
                setExerciseData(null);
                setPredictionsData(null);
              }}
              title={exerciseCount === 3 ? "Finish" : "Next Exercise"}
            />
          )}

          {/* {recordingStatus == 'loading' && (
            <View style={{alignSelf: 'center', marginBottom: 50}}>
              <ActivityIndicator size={34} color={'black'} />
            </View>
          )} */}
          {recordingStatus == 'loading' && (
            <View
              style={{
                width: '85%',
                borderRadius: 50,
                alignItems: 'center',
                backgroundColor: '#111920',
                padding: 10,
                height: 50,
                display: 'flex',
                justifyContent: 'center',
                marginTop: 'auto',
                marginBottom: '5%',
              }}>
              <ActivityIndicator size={30} color={'white'} />
            </View>
          )}
          {isModalVisible && (
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  padding: 40,
                  elevation: 9,
                  shadowColor: 'black',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    marginBottom: 10,
                    color: 'black',
                    textAlign: 'center',
                  }}>
                  Satisfied with Results?
                </Text>
                <View style={{flexDirection: 'row', marginHorizontal: 'auto'}}>
                  <TouchableOpacity
                    onPress={handleYes}
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: 'black',
                      marginLeft: 20,
                      width: 60,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'black',
                      }}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleNo}
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: 'black',
                      marginLeft: 30,
                      width: 60,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'black',
                      }}>
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  cameraView: {
    height: 250,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default VoiceDisorderPage;