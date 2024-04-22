import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Platform,
  BackHandler,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVModeIOSOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import CustomHeader from '../components/CustomHeader';
import SearchIcon from '../assets/SearchIcon';
import LinearGradient from 'react-native-linear-gradient';
import CalenderIcon from '../assets/CalenderIcon';
import ReportDetails from '../components/ReportDetails';
import WaveSVG from '../assets/Wave';
import BaseURL from '../components/ApiCreds';
import {useDataContext} from '../contexts/DataContext';
import {useCameraDevice, Camera} from 'react-native-vision-camera';

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

const DarkButton = (props: any) => {
  return (
    <TouchableOpacity
      onPress={() => props.onPress()}
      style={styles.recordButton}>
      <Text style={styles.recordButtonText}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const audioRecorderPlayer = new AudioRecorderPlayer();

const backendURL = `${BaseURL}/predict_stutter`;
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

function PassagePageTwo({navigation, route}: any) {
  const {userId} = useDataContext();
  const sessionId = route.params?.sessionId;
  const [status, setStatus] = useState('idle');
  const [backendResponse, setBackendResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const device = useCameraDevice('front');
  const [hack, doHack] = useState(0);
  const width = Dimensions.get('screen').width;

  const newCameraInit = () => {
    setTimeout(() => {
      doHack(1);
    }, 100);
  };

  const naviagteBack = () => {
    navigation.navigate('assessmentPage');
  };

  ////////////////////////////////////////////////////////////

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
  const [backendResponseText, setBackendResponseText] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleYes = () => {
    setVerificationResult('Yes');
    setIsModalVisible(false);
  };

  const handleNo = () => {
    setVerificationResult('No');
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (verificationResult !== null) {
      addFeedback();
    }
  }, [verificationResult]);

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

  const addFeedback = async () => {
    try {
      const formData = new FormData();
      formData.append('UserID', userId);
      formData.append('DisorderID', 2);
      formData.append(
        'ModelOutput',
        `stammering ${JSON.parse(backendResponseText).no_stuttering}`,
      );
      formData.append('FeedbackAnswer', verificationResult);
      console.log('Form Data ---> ', formData);

      const response = await fetch(`${BaseURL}/add_user_feedback`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
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

  useEffect(() => {
    console.log('Curent Position ===> ', currentPositionSec);
  }, [currentPositionSec]);

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

    const fileName = userId + '_2.mp4';
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
      setLoading(true);
      // Make the request using RNFetchBlob
      const response = await RNFetchBlob.fetch(
        'POST',
        BaseURL + '/upload_video_stammering',
        {
          'Content-Type': 'multipart/form-data',
        },
        formData,
      );

      if (response){
        setStatus('stop');
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (backendResponseText !== null) {
      addAssessmentResult();
    }
  }, [backendResponseText]);

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
      const response = await fetch(backendURL, options);

      // Log the response status for debugging
      console.log('Response status:', response.status);

      const data = await response.json();

      // Check if the response is successful
      if (response.ok) {
        setBackendResponse(data.predictions);
        setBackendResponseText(JSON.stringify(data, null, 2));
        console.log('Backend Response:', data);
      } else {
        // If the response is not successful, log the error message
        console.error('Error:', data); // Log the error message from the response
      }
    } catch (error) {
      // If an error occurs during the fetch request, log the error
      console.error('Network request failed:', error);
    }

    const fileName = userId + '_2.wav';
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
      await fetch(`${BaseURL}/upload_audio_stammering`, uploadOptions);
      console.log('Audio sent to upload_audio_stammering');
    } catch (error) {
      console.error('Network request failed:', error);
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
      formData.append('Score', JSON.parse(backendResponseText).no_stuttering);
      formData.append('DisorderID', 2);
      formData.append('PassageStammering', 2);

      formData.append('AssessmentDate', formattedDate);
      console.log('Form Data ---> ', formData);

      const response = await fetch(`${BaseURL}/add_assessment_stammering`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(
          'Assessment stammering result added successfully:',
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

  const onStartPlay = async () => {
    setPlayStart(true);
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener(e => {
      setCurrentPositionSec(e.currentPosition);
      setCurrentDurationSec(e.duration);
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
    });
    console.log('When Complete Stop');
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = () => {
    setPlayStart(false);
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  useEffect(() => {
    if (playTime == duration) {
      setPlayStart(false);
    }
  }, [playTime]);

  return (
    <SafeAreaView>
      <View style={{minHeight: '100%'}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <CustomHeader title="Rainbow Passage" goBack={naviagteBack} />
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
              // borderWidth: 1,
              // borderColor: '#000',
              margin: 20,
              marginTop: 30,
            }}>
            <View
              style={{
                height: 270,
                borderWidth: 1,
                borderColor: '#0CC8E8',
                borderRadius: 16,
                padding: 20,
              }}>
              <Text style={[styles.base, {fontSize: 20, marginTop: 10}]}>
                Read this Paragraph:
              </Text>
              <ScrollView
                indicatorStyle="black"
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}>
                <Text style={[styles.base, {fontSize: 32, marginTop: 10}]}>
                  When the sunlight strikes raindrops in the air, they act as a
                  prism and form a rainbow. The rainbow is a division of white
                  light into many beautiful colors. These take the shape of a
                  long round arch, with its path high above, and its two ends
                  apparently beyond the horizon. There is, according to legend,
                  a boiling pot of gold at one end. People look, but no one ever
                  finds it. When a man looks for something beyond his reach, his
                  friends say he is looking for the pot of gold at the end of
                  the rainbow. Throughout the centuries people have explained
                  the rainbow in various ways. Some have accepted it as a
                  miracle without physical explanation. To the Hebrews it was a
                  token that there would be no more universal floods. The Greeks
                  used to imagine that it was a sign from the gods to foretell
                  war or heavy rain. The Norsemen considered the rainbow as a
                  bridge over which the gods passed from earth to their home in
                  the sky. Others have tried to explain the phenomenon
                  physically. Aristotle thought that the rainbow was caused by
                  reflection of the sun's rays by the rain. Since then
                  physicists have found that it is not reflection, but
                  refraction by the raindrops which causes the rainbows. Many
                  complicated ideas about the rainbow have been formed. The
                  difference in the rainbow depends considerably upon the size
                  of the drops, and the width of the colored band increases as
                  the size of the drops increases. The actual primary rainbow
                  observed is said to be the effect of super-imposition of a
                  number of bows. If the red of the second bow falls upon the
                  green of the first, the result is to give a bow with an
                  abnormally wide yellow band, since red and green light when
                  mixed form yellow. This is a very common type of bow, one
                  showing mainly red and yellow, with little or no green or
                  blue.
                </Text>
              </ScrollView>
            </View>
            <View
              style={{
                height: 180,
                marginTop: 20,
                backgroundColor: '#111920',
                borderRadius: 16,
                padding: 20,
              }}>
              <Text
                style={[
                  styles.base,
                  {color: '#fff', fontSize: 20, marginTop: 10},
                ]}>
                Speech Output:
              </Text>
              <Text
                style={[
                  styles.base,
                  {color: '#fff', marginTop: 10, fontSize: 18, lineHeight: 30},
                ]}>
                {/* When he speaks, his voice is just a bit cracked and quivers a
                bit. Twice each day he plays skillfully and with zest upon a
                small organ. Except in the winter when the snow or ice prevents,
                he slowly takes a short */}
                {loading && 'Loading Response'}
                {backendResponseText && !loading && (
                  <>
                    Normal: {JSON.parse(backendResponseText).no_stuttering}
                    {'\n'}Stuttering:{' '}
                    {JSON.parse(backendResponseText).stuttering}
                  </>
                )}
              </Text>
            </View>
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
                  <View
                    style={{flexDirection: 'row', marginHorizontal: 'auto'}}>
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
          </View>

          {/* <PlayButton onPress={() => navigation.navigate('main')} /> */}
          {status == 'idle' && (
            <DarkButton
              onPress={() => {
                setStatus('recording');
                onStartRecord();
              }}>
              {'\u2B24'} Record
            </DarkButton>
          )}
          {status == 'recording' && (
            <PlayButton
              onPress={() => {
                setStatus('loading');
                onStopRecord();
              }}
            />
          )}
          {status == 'loading' && (
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
          {status == 'stop' && (
            <DarkButton onPress={() => navigation.navigate('main')}>
              Back to Home
            </DarkButton>
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
    marginBottom: '5%',
  },
  recordButtonText: {
    color: '#fff',
    fontWeight: '600',
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

export default PassagePageTwo;
