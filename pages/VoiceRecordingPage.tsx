import {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import ChevronDownIcon from '../assets/ChevronDown';
import ChevronDownWhite from '../assets/ChevronDownWhite';
import SpeechResult from '../components/SpeechResult';
import WideDot from '../assets/WideDot';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVModeIOSOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import StartRecording from '../assets/images/start.png';
import PlayBtn from '../assets/images/play_btn.png';
import PauseBtn from '../assets/images/pause2.png';
import LoaderWave from '../components/LoaderWave';
import BaseURL from '../components/ApiCreds';

const countries = ['German', 'French', 'Arabic', 'Turkish', 'Hindi', 'Urdu'];
const audioRecorderPlayer = new AudioRecorderPlayer();

const backendURL = BaseURL + '/predict';
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

function VoiceRecordingPage({navigation}: any) {
  const [gradient, setGradient] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [backendResponse, setBackendResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const closeDetails = (val: any) => {
    setDetailsOpen(val);
    setGradient(!gradient);
  };

  ////////////////////////////////////////////////////////////

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
    console.log(`Curent Position ===> `, currentPositionSec);
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

  const onStopRecord = async () => {
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
      setLoading(true);
      const response = await fetch(backendURL, options);
      const data = await response.json();

      if (data) {
        setLoading(false);
        setBackendResponse(data.predictions);
      }

      console.log(data);
    } catch (error) {
      console.error('Network request failed:', error);
    }

    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log(result);
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
    <ScrollView>
      <SafeAreaView>
        <LinearGradient
          // colors={['#0CC8E8', '#2DEEAA']}
          colors={gradient ? ['#0CC8E8', '#2DEEAA'] : ['#111920', '#111920']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{minHeight: '100%'}}>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
            }}>
            <SelectDropdown
              // renderSearchInputRightIcon={ChevronDownIcon}
              dropdownIconPosition="right"
              renderDropdownIcon={gradient ? ChevronDownIcon : ChevronDownWhite}
              defaultButtonText="English"
              buttonStyle={{
                marginTop: 30,
                backgroundColor: gradient ? '#fff' : '#363D44',
                width: 350,
                borderRadius: 8,
              }}
              dropdownStyle={{
                backgroundColor: gradient ? '#fff' : '#363D44',
                borderRadius: 8,
              }}
              rowTextStyle={{color: gradient ? '#000' : '#fff'}}
              buttonTextStyle={{
                color: gradient ? '#000' : '#fff',
                textAlign: 'left',
              }}
              data={countries}
              onSelect={(selectedItem, index) => {
                //   console.log(selectedItem, index);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />

            <SpeechResult
              detailsOpen={detailsOpen}
              closeDetails={closeDetails}
            />

            <Image
              style={{height: 350, width: 350, borderRadius: 12, marginTop: 20}}
              source={require('../assets/images/avatar.png')}
            />
            <View
              style={{
                backgroundColor: gradient ? '#fff' : '#363D44',
                padding: 20,
                marginTop: 20,
                width: 350,
                borderRadius: 8,
                paddingBottom: 30,
              }}>
              <Text style={{color: gradient ? '#000' : '#fff'}}>
                Hello, my name is Anna and I’m speeking|
              </Text>
              <Text style={{color: gradient ? '#000' : '#fff'}}>
                {loading && 'Loading Response'}
                {!loading && backendResponse
                  ? // ? `Label: ${backendResponse.Label} Score: ${backendResponse.Score}`
                    `${backendResponse.Label}`
                  : ''}
              </Text>
            </View>

            {/* <View>
              <TouchableOpacity onPress={onStartRecord} >
                <Text style={styles.btnColor}>Start Recording</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onStopRecord} >
                <Text style={styles.btnColor}>Stop Recording</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onStartPlay} >
                <Text style={styles.btnColor}>Start Playback</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPausePlay} >
                <Text style={styles.btnColor}>Pause Playback</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onStopPlay} >
                <Text style={styles.btnColor}>Stop Playback</Text>
              </TouchableOpacity>
            </View> */}

            {/*             
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <LinearProgress
                style={{
                  marginVertical: 10,
                  borderRadius: 16,
                  height: 7,
                  maxWidth: '90%',
                }}
                value={progressPercentage}
                variant="determinate"
                color="#71D860"
              />
              <Text
                style={[
                  styles.base,
                  { fontSize: 14, fontWeight: '500', marginLeft: 5 },
                ]}>
                48%
              </Text>
            </View> */}

            <LoaderWave isAnimation={playStart} />

            {/* <View>
              <Text style={{ color: "white" }}>Play Time Sec: {currentDurationSec}</Text>

              <Text style={{ color: "white" }}>Play Time: {playTime}</Text>
              <Text style={{ color: "white" }}>Duration: {duration}</Text>

              <Text style={{ color: "white" }}>Record Second: {recordSecs}</Text>
              <Text style={{ color: "white" }}>Record Time: {recordTime}</Text>

            </View> */}
            <View style={{flexDirection: 'row', gap: 15}}>
              <Text></Text>
            </View>
            <View style={styles.recorderBtnFlex}>
              <View>
                {/* <TouchableOpacity style={[styles.playPauseBtn, styles.hide]}></TouchableOpacity> */}
                <Text style={{color: 'white'}}>{recordTime}</Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    !recordStart ? onStartRecord() : onStopRecord()
                  }
                  style={[styles.playPauseBtn, styles.playPauseBtnRight]}>
                  {!recordStart ? (
                    <Image
                      source={StartRecording}
                      style={{width: '100%', height: '100%'}}
                    />
                  ) : (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: 'red',
                      }}></View>
                  )}
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  disabled={playBtnDisable}
                  onPress={() => (!playStart ? onStartPlay() : onStopPlay())}
                  style={
                    playBtnDisable
                      ? styles.playPauseBtnDisable
                      : styles.playPauseBtn
                  }>
                  {!playStart ? (
                    <Image
                      style={{width: '100%', height: '100%'}}
                      source={PlayBtn}
                    />
                  ) : (
                    <Image
                      style={{width: '100%', height: '100%'}}
                      source={PauseBtn}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setDetailsOpen(true);
                setGradient(true);
              }}
              style={{
                marginTop: 'auto',
                backgroundColor: '#fff',
                width: '100%',
                height: 80,
                borderTopStartRadius: 24,
                borderTopEndRadius: 24,
                display: 'flex',
                alignItems: 'center',
              }}>
              <WideDot />
              <Text style={[styles.base, {fontSize: 16, textAlign: 'center'}]}>
                Results
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'SF-Pro-Display-Regular',
    color: '#111920',
  },
  recorderBtnFlex: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 50,
  },
  playPauseBtn: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 100,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseBtnDisable: {
    opacity: 0.5,
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 100,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseBtnRight: {
    // marginRight: 40
  },
  hide: {
    opacity: 0,
  },
  btnColor: {
    color: 'white',
  },
});

export default VoiceRecordingPage;
