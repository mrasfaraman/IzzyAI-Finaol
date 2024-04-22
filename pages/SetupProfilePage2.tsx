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
  PermissionsAndroid,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import SelectDropdown from 'react-native-select-dropdown';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import IzzyAILogo from '../assets/IzzyAILogo';
import ChevronDownIcon from '../assets/ChevronDown';
import CustomHeader from '../components/CustomHeader';
import {CheckBox} from '@rneui/themed';
import BarFilled from '../assets/BarFilled';
import Bar from '../assets/Bar';
import LoaderWave from '../components/LoaderWave';
import {useDataContext} from '../contexts/DataContext';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {
  FFprobeKit,
  MediaInformationSession,
  MediaInformation,
} from 'ffmpeg-kit-react-native';
import BaseURL from '../components/ApiCreds';
import Loader from '../components/Loader';

const ProgressCenter = () => {
  return (
    <View
      style={{
        backgroundColor: '#FC4343',
        height: 40,
        width: 40,
        borderRadius: 100,
      }}
    />
  );
};

function SetupProfilePage2({navigation, route}: any) {
  const [timer, setTimer] = useState(5);
  const [counter, setCounter] = useState(100);
  const [playStart, setPlayStart] = useState(false);
  const {userId} = useDataContext();
  const [timerId, setTimerId] = useState(null);
  const [videoQualityPercentage, setVideoQualityPercentage] = useState(0);
  const [audioQualityPercentage, setAudioQualityPercentage] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoPath, setVideoPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [hack, doHack] = useState(0);
  const width = Dimensions.get('screen').width;

  const newCameraInit = () => {
    setTimeout(() => {
      doHack(1);
    }, 100);
  };

  const device = useCameraDevice('front');

  const cameraRef = useRef<Camera>(null);

  const checkPermissions = async () => {
    try {
      const cameraPermission = PermissionsAndroid.PERMISSIONS.CAMERA;
      const audioPermission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;

      const hasCameraPermission = await PermissionsAndroid.check(
        cameraPermission,
      );
      const hasAudioPermission = await PermissionsAndroid.check(
        audioPermission,
      );

      if (!hasCameraPermission || !hasAudioPermission) {
        // If any of the permissions are not granted, request them
        const granted = await PermissionsAndroid.requestMultiple([
          cameraPermission,
          audioPermission,
        ]);

        if (
          granted[cameraPermission] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted[audioPermission] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.error('Camera and audio permissions are required');
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  //permissions
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera.',
            buttonPositive: 'OK',
          },
        );

        const audioGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone.',
            buttonPositive: 'OK',
          },
        );

        if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
        } else {
          console.log('Camera permission denied');
        }

        if (audioGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission granted');
        } else {
          console.log('Microphone permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestPermissions();
  }, []);

  const startRecording = async () => {
    const hasPermissions = await checkPermissions();
    if (!hasPermissions) {
      return;
    }

    // Check if cameraRef.current is not null
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
          saveAndAnalyze(video.path);
        },
        onRecordingError: error => {
          console.error('Error recording video:', error);
          // Handle recording error (e.g., display error message to user)
        },
      });

      // Start a timer that calls tick every second
      const timer_id = setInterval(tick, 1000);

      // Save the timer ID so it can be cleared later
      setTimerId(timer_id);
    } else {
      console.error('Camera ref is null');
    }
  };

  async function saveAndAnalyze(newVideoPath: string) {
    // ... (video recording logic)
    setIsLoading(true);

    try {
      console.log('Using video path:', newVideoPath); // Log the path for verification

      // Use FFprobe to get the bitrate of the video
      const mediaInformationSession: MediaInformationSession =
        await FFprobeKit.getMediaInformation(newVideoPath);
      const mediaInformation: MediaInformation =
        mediaInformationSession.getMediaInformation();
      console.log('Media information:', mediaInformation);

      // Find the video stream
      const videoCodecs = ['h264', 'hevc', 'vp8', 'vp9', 'av1'];

      let bitrate, frameRate, resolution, videoCodec, duration;
      let audioBitrate, audioCodec, channels, sampleRate;

      const videoStream = mediaInformation
        .getStreams()
        .find(stream => videoCodecs.includes(stream.getCodec()));

      if (videoStream) {
        // Extract video metrics
        bitrate = videoStream.getBitrate();
        frameRate = videoStream.getAverageFrameRate();
        resolution = `${videoStream.getWidth()}x${videoStream.getHeight()}`;
        videoCodec = videoStream.getCodec();
        duration = mediaInformation.getDuration();

        console.log('Video Metrics:', {
          bitrate,
          frameRate,
          resolution,
          videoCodec,
          duration,
        });
      } else {
        console.log('No video stream found');
      }

      const audioCodecs = ['aac', 'mp3', 'vorbis', 'opus', 'flac'];

      const audioStream = mediaInformation
        .getStreams()
        .find(stream => audioCodecs.includes(stream.getCodec()));

      if (audioStream) {
        audioCodec = audioStream.getCodec();
        sampleRate = audioStream.getSampleRate();
        channels = audioStream.getChannelLayout();
        audioBitrate = audioStream.getBitrate();

        console.log('Audio Metrics:', {
          audioCodec,
          sampleRate,
          channels,
          audioBitrate,
        });
      } else {
        console.log('No audio stream found');
      }

      evaluateMediaQuality(
        {
          bitrate: bitrate,
          duration: duration,
          frameRate: frameRate,
          resolution: resolution,
          videoCodec: videoCodec,
        },
        {
          audioBitrate: audioBitrate,
          audioCodec: audioCodec,
          channels: channels,
          sampleRate: sampleRate,
        },
      );
    } catch (err) {
      console.error('Error stopping recording or FFmpeg analysis:', err);
      // Handle errors (e.g., display a message to the user)
    }
  }

  function calculateQualityScore(
    metric: number,
    minQualityIndex: number,
    maxQualityIndex: number,
  ): number {
    if (metric < minQualityIndex) {
      return 0;
    }
    if (metric > maxQualityIndex) {
      return 100;
    }

    return (
      ((metric - minQualityIndex) / (maxQualityIndex - minQualityIndex)) * 100
    );
  }

  function evaluateMediaQuality(videoMetrics: any, audioMetrics: any) {
    const videoQualityScore = calculateQualityScore(
      videoMetrics.bitrate,
      500000,
      5000000,
    );
    const audioQualityScore = calculateQualityScore(
      audioMetrics.audioBitrate,
      64000,
      320000,
    );

    // Calculate score for sample rate (assuming good quality is between 22050 and 44100 Hz)
    const sampleRateScore = calculateQualityScore(
      audioMetrics.sampleRate,
      22050,
      44100,
    );

    // Calculate score for channels (assuming stereo (2 channels) is the best)
    const channelsScore = calculateQualityScore(
      audioMetrics.channels === 'stereo' ? 2 : 1,
      1,
      2,
    );

    const frameRate =
      parseFloat(videoMetrics.frameRate.split('/')[0]) /
      parseFloat(videoMetrics.frameRate.split('/')[1]);
    const frameRateScore = calculateQualityScore(frameRate, 24, 60);

    const resolutionScore = calculateQualityScore(
      videoMetrics.resolution.split('x')[0],
      480,
      1080,
    );

    const overallVideoQuality =
      (videoQualityScore + frameRateScore + resolutionScore) / 3;
    // Now considering bitrate, sample rate, and channels for audio quality
    const overallAudioQuality =
      (audioQualityScore + sampleRateScore + channelsScore) / 3;

    console.log('Overall Video Quality:', overallVideoQuality);
    console.log('Overall Audio Quality:', overallAudioQuality);

    setVideoQualityPercentage(Math.round(overallVideoQuality));
    setAudioQualityPercentage(Math.round(overallAudioQuality));
  }

  useEffect(() => {
    if (videoQualityPercentage > 0 && audioQualityPercentage > 0) {
      handlePress();
    }
  }, [videoQualityPercentage, audioQualityPercentage]);

  const stopRecording = async () => {
    setPlayStart(false);
    setIsRecording(false);
    await cameraRef.current.stopRecording();

    // Clear the timer
    clearInterval(timerId);
  };

  function handlePress() {
    const formData = new FormData();

    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(
      '0' +
      (date.getMonth() + 1)
    ).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;

    // Append data to FormData object
    formData.append('UserID', userId);
    formData.append('MicQualityPrecent', audioQualityPercentage.toString());
    formData.append('CamQualityPrecent', videoQualityPercentage.toString());
    // formData.append('TestDate', new Date().toDateString());
    formData.append('TestDate', formattedDate);

    console.log('Body Data ---> ', formData);
    fetch(BaseURL + '/add_mic_camera_test_report', {
      method: 'POST',
      headers: {},
      body: formData,
    })
      .then(response => {
        console.log('My result ===> ', response);

        navigate();
        // navigation.push('setupProfile2', route.params);
      })
      .catch(error => {
        console.error('here', error);
      })
      .finally(() => {
        setVideoQualityPercentage(0);
        setAudioQualityPercentage(0);
        setTimer(5);
        setCounter(100);
        setPlayStart(false);
        setIsRecording(false);
        setVideoPath('');
        setTimerId(null);
        setIsLoading(false);
      });
  }

  function tick() {
    console.log('tick', timer);
    setTimer(prevTimer => prevTimer - 1);
    setCounter(prevCounter => prevCounter - 20);
  }

  useEffect(() => {
    if (timer === 0) {
      stopRecording();
    }
  }, [timer]); // Add timer as a dependency

  const navigate = () => {
    navigation.push('setupProfile3', {
      ...route.params,
      videoQualityPercentage: videoQualityPercentage,
      audioQualityPercentage: audioQualityPercentage,
    });
  };

  // const stopRecording = async () => {
  //    try {
  //       // Stop recording
  //       await cameraRef.current.stopRecording();
  //       setRecording(false);
  //    } catch (err) {
  //       console.error(err);
  //    }
  // };

  const naviagteBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomHeader title="Setup Profile" goBack={naviagteBack} />
          <IzzyAILogo style={{marginTop: 40}} />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <BarFilled />
            <BarFilled />
            <BarFilled />
            <Bar />
            <Bar />
          </View>

          {isLoading ? <Loader loading={isLoading} /> : <></>}

          <Text style={[styles.base, styles.heading]}>
            Test your microphone & camera
          </Text>
          <View
            style={{
              display: 'flex',
              width: '90%',
              marginTop: 20,
            }}>
            <Text style={[styles.base, styles.labelText]}>
              {
                'Record yourself saying: \n"The quick brown fox jumps over the lazy dog"'
              }
            </Text>
            <View
              style={{
                height: 230,
                width: '100%',
                marginTop: 5,
                borderRadius: 20,
                overflow: 'hidden',
              }}>
              <Camera
                ref={cameraRef}
                device={device}
                isActive={true}
                video={true}
                audio={true}
                style={[StyleSheet.absoluteFill, {width: width + hack}]}
                onInitialized={() => newCameraInit()}
                zoom={0}
              />
            </View>

            <LoaderWave isAnimation={playStart} isDark={true} />

            <View
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles.base,
                  {
                    fontSize: 22,
                    textAlign: 'center',
                    fontWeight: '500',
                  },
                ]}>
                <Text style={{color: '#FC4343'}}>
                  0:0{timer > 0 ? timer : 0}
                </Text>{' '}
                Seconds Left
              </Text>
              {/* {!isRecording ? ( */}
              <TouchableOpacity
                onPress={() => startRecording()}
                disabled={isRecording}>
                <AnimatedCircularProgress
                  style={{marginTop: 20}}
                  size={60}
                  width={5}
                  fill={counter}
                  tintColor="#FC4343"
                  // onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#DADADA"
                  children={ProgressCenter}
                />
              </TouchableOpacity>
            </View>
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
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    paddingTop: 30,
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'center',
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
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SetupProfilePage2;
