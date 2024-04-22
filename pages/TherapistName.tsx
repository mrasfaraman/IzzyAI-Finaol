import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Keyboard,
  Platform,
  PermissionsAndroid,
  FlatList,
  BackHandler,
  Modal,
} from 'react-native';
import {DotIndicator} from 'react-native-indicators';
import CustomHeader from '../components/CustomHeader';
import {Icon} from '@rneui/themed';
import {useDataContext} from '../contexts/DataContext';
import RNFetchBlob, {RNFetchBlobFile} from 'rn-fetch-blob';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  AVModeIOSOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import BaseURL from '../components/ApiCreds';
import LoaderWave from '../components/LoaderWave';

const audioRecorderPlayer = new AudioRecorderPlayer();

const dirs = RNFetchBlob.fs.dirs;

const path = Platform.select({
  ios: 'hello.wav',
  android: `${dirs.CacheDir}/${new Date().getTime()}.wav`,
});
const audioSet: AudioSet = {
  AudioSourceAndroid: AudioSourceAndroidType.MIC,
  OutputFormatAndroid: OutputFormatAndroidType.DEFAULT,
  AudioEncoderAndroid: AudioEncoderAndroidType.AMR_NB,
  AudioSamplingRateAndroid: 44100,
  AudioChannelsAndroid: 2,
  AudioEncodingBitRateAndroid: 128000,
};

const TherapistName = ({navigation}: any) => {
  const [chats, setChats] = useState([
    {
      text: 'Hello there! you can start saying words you feel difficult to pronounce',
      isUser: false,
      audio: null,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPlay, setAudioPlay] = useState<number>();

  const {userDetail, userId} = useDataContext();

  // const userAvatar = require('../assets/images/male1.png');

  const scrollViewRef = useRef<ScrollView>(null);

  const navigateBack = () => {
    navigation.navigate('therapistProfile');
  };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('therapistProfile');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseURL}/get_user_profile/${userId}`);
        const userData = await response.json();
        console.log('User data from API:', userData);

        // Fetch avatar URL if userData contains AvatarId
        if (userData?.AvatarID) {
          const avatarId = userData.AvatarID; // Use optional chaining to safely access AvatarId
          const response = await fetch(`${BaseURL}/get_avatar/${avatarId}`);
          const avatarData = await response.json();
          if (avatarData && avatarData.AvatarURL) {
            console.log('asd', avatarData);

            setAvatarUrl(avatarData.AvatarURL);
            console.log(avatarData.avatarURL);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const avatarUrlNew = `${BaseURL}${avatarUrl}`;
  console.log(avatarUrlNew);

  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');

  const [recordStart, setRecordStart] = useState(false);
  const [playStart, setPlayStart] = useState(false);
  const [playBtnDisable, setPlayBtnDisable] = useState(true);

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
    const requestAudioPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Permission',
            message: 'App needs access to your microphone for recording audio.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Audio permission granted');
        } else {
          console.log('Audio permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestAudioPermission();
  }, []);

  const sendMessage = async () => {
    if (isLoading) {
      return;
    }
    console.log('running sendMessage');
    if (inputText.trim() !== '') {
      setChats([...chats, {text: inputText, isUser: true, audio: null}]);

      setInputText('');
      setIsLoading(true);
      // Scroll to bottom of chat
      scrollViewRef.current?.scrollToEnd({animated: true});
      try {
        const formData = new FormData();
        formData.append('text', inputText);

        const response = await fetch(BaseURL + '/text', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        console.log(data);

        if (data) {
          const message =
            data.response === '' || data.response === 'AI:'
              ? 'Sorry I did not understand!'
              : data.response.slice(4);

          setIsLoading(false);
          setChats(prevChats => [
            ...prevChats,
            {text: message, isUser: false, audio: null},
          ]);
          console.log(data);
          // Scroll to bottom after receiving a message
          scrollViewRef.current?.scrollToEnd({animated: true});
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyboardSend = () => {
    sendMessage();
    Keyboard.dismiss(); // Dismiss the keyboard after sending the message
  };

  useEffect(() => {
    if (playTime == duration) {
      setPlayStart(false);
    }
  }, [playTime]);

  const onStartRecord = async () => {
    setPlayBtnDisable(true);
    setRecordStart(true);

    setIsRecording(true);
    const result = await audioRecorderPlayer.startRecorder(path, audioSet);
    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });
    console.log(result);
  };

  const sendVoiceMessage = async () => {
    setIsRecording(false);
    setPlayBtnDisable(false);
    setRecordStart(false);

    const result = await audioRecorderPlayer.stopRecorder();

    if (isLoading) {
      return;
    }

    console.log('result: ', result);
    setChats([...chats, {text: inputText, isUser: true, audio: result}]);

    scrollViewRef.current?.scrollToEnd({animated: true});

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
      setIsLoading(true);

      const response = await fetch(BaseURL + '/audio', options);

      const data = await response.json();

      console.log('data__', data);

      if (data) {
        const message =
          data.response === ''
            ? 'Sorry, can you please say it again!'
            : data.response.slice(4);

        if (data && data.Highest_disorder_result) {
          setModalContent(data.Highest_disorder_result.Label);
          setModalScore(data.Highest_disorder_result.Score);
          setShowModal(true);

          setTimeout(() => {
            setShowModal(false);
          }, 3000);
        }

        setIsLoading(false);
        setChats(prevChats => [
          ...prevChats,
          {text: message, isUser: false, audio: null},
        ]);

        scrollViewRef.current?.scrollToEnd({animated: true});
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error sending voice message:', error);
    }
  };

  const playAudio = async (audioPath, index) => {
    try {
      setAudioPlay(index);
      await audioRecorderPlayer.startPlayer(audioPath);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          console.log('finished');
          audioRecorderPlayer.stopPlayer();
          setAudioPlay(-1);
        }
        setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      });
    } catch (error) {
      setAudioPlay(-1);

      console.log('Error playing audio: ', error);
    }
  };

  const renderMessages = ({item, index}) => {
    const isPlaying = audioPlay === index ? true : false;
    return (
      <View style={item.isUser ? styles.userContainer : styles.otherContainer}>
        <View style={styles.avatarIconView}>
          <Image
            source={
              item.isUser
                ? {uri: avatarUrlNew}
                : require('../assets/images/microphone.png')
            }
            resizeMode="stretch"
            style={styles.avatarIcon}
          />
          <Text style={styles.userName}>{item.isUser ? 'You' : 'IzzyAI'}</Text>
        </View>
        <View
          key={index}
          style={[item.isUser ? styles.userBubble : styles.otherBubble]}>
          {item.audio !== null ? (
            <View
              style={{
                width: '80%',
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                alignSelf: 'center',
                bottom: 10,
                gap: 10,
              }}>
              <View
                style={{
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <LoaderWave isAnimation={isPlaying} isDark={true} />
              </View>
              <TouchableOpacity
                disabled={isPlaying}
                onPress={() => {
                  playAudio(item.audio, index);
                }}>
                {!isPlaying ? (
                  <Image
                    source={require('../assets/images/play.png')}
                    style={{width: 20, height: 20, top: 10}}
                  />
                ) : (
                  <Image
                    source={require('../assets/images/pause.png')}
                    style={{width: 20, height: 20, top: 10}}
                  />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.chatText}>{item.text}</Text>
          )}
        </View>
      </View>
    );
  };

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('Voice Disorder');
  const [modalScore, setModalScore] = useState('0.0');

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <CustomHeader title="AI SLP" goBack={navigateBack} />
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            marginTop: 30,
          }}
          keyboardShouldPersistTaps="handled">
          <FlatList
            ref={flatListRef}
            data={chats}
            scrollEnabled={false}
            contentContainerStyle={{paddingBottom: 40}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMessages}
            onContentSizeChange={() =>
              flatListRef.current.scrollToEnd({animated: true})
            }
            onLayout={() => flatListRef.current.scrollToEnd({animated: true})}
            ListFooterComponent={
              isLoading && (
                <View style={styles.otherContainer}>
                  <View style={styles.avatarIconView}>
                    <Image
                      source={require('../assets/images/microphone.png')}
                      style={styles.avatarIcon}
                    />
                    <Text style={styles.userName}>IzzyAI</Text>
                  </View>
                  <View style={styles.otherBubble}>
                    <DotIndicator size={7} count={3} color={'#2DEEAA'} />
                  </View>
                </View>
              )
            }
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>You have</Text>
                <Text style={[styles.modalText2]}>{modalContent}</Text>
                <Text style={[styles.modalText2]}>Score: {modalScore}</Text>
              </View>
            </View>
          </Modal>
        </ScrollView>

        <View style={styles.inputContainer}>
          {!isRecording ? (
            <TextInput
              style={[
                styles.input,
                inputText.length === 40 ? {color: 'red'} : null,
              ]}
              value={inputText}
              placeholderTextColor={'black'}
              onChangeText={setInputText}
              maxLength={40}
              placeholder="Type message..."
              onSubmitEditing={handleKeyboardSend}
            />
          ) : (
            <View
              style={{
                width: '75%',
                height: 46,
                justifyContent: 'center',
                alignItems: 'center',
                bottom: 10,
                marginRight: 15,
              }}>
              <LoaderWave isAnimation={isRecording} isDark={true} />
            </View>
          )}

          {inputText === '' ? (
            !isRecording ? (
              <TouchableOpacity
                style={styles.microphoneButton}
                onPress={() => onStartRecord()}>
                <Image
                  style={styles.img}
                  source={require('../assets/images/microphone.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.sendBtn}
                onPress={() => sendVoiceMessage()}>
                <Icon name="send" size={20} style={{left: 1}} />
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={() => sendMessage()}>
              <Icon name="send" size={20} style={{left: 1}} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  otherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    gap: 15,
  },
  userContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    gap: 15,
    alignSelf: 'flex-end',
  },
  avatarIconView: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 3,
  },
  avatarIcon: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  userName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  otherBubble: {
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
    backgroundColor: '#F8F8F8',
  },
  userBubble: {
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
    backgroundColor: '#2DEEAA',
  },
  img: {
    marginTop: 0,
    width: 45,
    height: 45,
    backgroundColor: '#F0F0F0',
  },
  chatText: {
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    paddingVertical: 12,
    borderTopColor: '#ccc',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
  },
  input: {
    width: '78%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: 'black',
    marginRight: 7,
  },
  microphoneButton: {
    padding: 10,
    width: 45,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    backgroundColor: '#2DEEAA',
    borderRadius: 50,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    gap: 10,
    width: '75%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  modalText2: {
    fontSize: 26,
    textAlign: 'center',
    color: 'black',
  },
});

export default TherapistName;
