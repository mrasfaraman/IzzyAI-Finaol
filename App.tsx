/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '@rneui/themed';
import {NativeBaseProvider, Box} from 'native-base';
import requestPermissions from './utils/permissions';
import TabNavigator from './components/TabNavigator';
import GettingStartedPageOne from './pages/GettingStartedPageOne';
import GettingStartedPageTwo from './pages/GettingStartedPageTwo';
import GettingStartedPageThree from './pages/GettingStartedPageThree';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUp';
import ProfileTypePage from './pages/ProfileType';
import TherapistProfilePage from './pages/TherapistsProfile';
import ProfileSetupSuccessPage from './pages/ProfileSetupSuccess';
import AssessmentPage from './pages/AssessmentPage';
import InstructionsPage from './pages/InstructionsPage';
import SpeechArticulationPage from './pages/SpeechArticulation';
import MyProfilesPage from './pages/MyProfilesPage';
import ReportsPage from './pages/ReportsPage';
import PassagePage from './pages/PassagePage';
import VoiceRecordingPage from './pages/VoiceRecordingPage';
import SetupProfilePage from './pages/SetupProfilePage';
import SetupProfilePage2 from './pages/SetupProfilePage2';
import SetupProfilePage3 from './pages/SetupProfilePage3';
import SetupProfilePage4 from './pages/SetupProfilePage4';
import SpeechExercisePage from './pages/SpeechExercisePage';
import PassagePageTwo from './pages/PassagePageTwo';
import BaselineQuestions from './pages/BaselineQuestions';
import ResultReportArticulation from './pages/ResultReportArticulation';
import ResultReportExercises from './pages/ResultReportExercises';
import {DataProvider} from './contexts/DataContext';
import TherapistName from './pages/TherapistName';
import SetupProfilePage1 from './pages/SetupProfilePage1';
import HomePage from './pages/main/HomePage';
import FaceAuthenticationScreen from './pages/FaceAuthenticationScreen';
import ScanFaceInstruction from './pages/ScanFaceInstruction';
import SufferingDisease from './pages/SufferingDisease';
import WaitVerifyingNew from './pages/WaitVerifyingNew';
import FaceAuthenticationScreenMain from './pages/FaceAuthenticationScreenMain';
import WaitVerifying from './pages/WaitVerifying';
import PaymentScreen from './pages/PaymentScreen';
import VoiceDisorderPage from './pages/VoiceDisordePage';
import ExercisePage from './pages/ExercisePage';
import StammeringExercisePage from './pages/StammeringExercisePage';
import VoiceExerciseGame from './pages/VoiceExerciseGame';
import OtpScreen from './pages/OtpScreen';
import NewPassword from './pages/NewPassword';
import BioDataPage from './pages/BioDataPage';
import Games from './pages/Games';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  requestPermissions();

  return (
    <SafeAreaProvider>
      <DataProvider>
        <ThemeProvider>
          <NativeBaseProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{headerShown: false}}>
              
                <Stack.Screen
                  name="startedOne"
                  component={GettingStartedPageOne}
                />
                <Stack.Screen
                  name="startedTwo"
                  component={GettingStartedPageTwo}
                />
                <Stack.Screen
                  name="startedThree"
                  component={GettingStartedPageThree}
                />
                <Stack.Screen name="signInPage" component={SignInPage} />
                <Stack.Screen name="signUpPage" component={SignUpPage} />
                <Stack.Screen name="otpScreen" component={OtpScreen} />
                <Stack.Screen name="newPassword" component={NewPassword} />
                <Stack.Screen name="profileType" component={ProfileTypePage} />
                <Stack.Screen
                  name="setupProfile"
                  component={SetupProfilePage}
                />
                <Stack.Screen
                  name="setupProfile1"
                  component={SetupProfilePage1}
                />
                <Stack.Screen
                  name="setupProfile2"
                  component={SetupProfilePage2}
                />
                <Stack.Screen
                  name="setupProfile3"
                  component={SetupProfilePage3}
                />
                {/* <Stack.Screen
                  name="ScanFaceInstruction"
                  component={ScanFaceInstruction}
                /> */}
                <Stack.Screen
                  name="setupProfile4"
                  component={SetupProfilePage4}
                />
                <Stack.Screen
                  name="baselineQuestions"
                  component={BaselineQuestions}
                />
                <Stack.Screen
                  name="voiceExerciseGame"
                  component={VoiceExerciseGame}
                />
                <Stack.Screen
                  name="profileSetupSuccess"
                  component={ProfileSetupSuccessPage}
                />
                <Stack.Screen
                  name="bioDataPage"
                  component={BioDataPage}
                />
                <Stack.Screen
                  name="sufferingDisease"
                  component={SufferingDisease}
                />
                <Stack.Screen
                  name="therapistProfile"
                  component={TherapistProfilePage}
                />
                <Stack.Screen name="therapistName" component={TherapistName} />
                <Stack.Screen
                  name="assessmentPage"
                  component={AssessmentPage}
                />
                <Stack.Screen name="passagePage" component={PassagePage} />
                <Stack.Screen name="passagePage2" component={PassagePageTwo} />
                <Stack.Screen name="games" component={Games} />


                <Stack.Screen
                  name="instructionsPage"
                  component={InstructionsPage}
                />
                <Stack.Screen
                  name="speechArticulationPage"
                  component={SpeechArticulationPage}
                />
                <Stack.Screen name="exercisePage" component={ExercisePage} />
                <Stack.Screen
                  name="speechExcercisePage"
                  component={SpeechExercisePage}
                />
                <Stack.Screen
                  name="stammeringExercisePage"
                  component={StammeringExercisePage}
                />
                
                <Stack.Screen
                  name="resultReportExercises"
                  component={ResultReportExercises}
                />
                <Stack.Screen
                  name="resultReport"
                  component={ResultReportArticulation}
                />
                <Stack.Screen
                  name="voiceDisorderPage"
                  component={VoiceDisorderPage}
                />
                <Stack.Screen
                  name="myProfilesPage"
                  component={MyProfilesPage}
                />
                <Stack.Screen name="reportsPage" component={ReportsPage} />
                <Stack.Screen
                  name="voiceRecordingPage"
                  component={VoiceRecordingPage}
                />
                <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
                <Stack.Screen
                  name="faceauthenticationscreen"
                  component={FaceAuthenticationScreen}
                />
                <Stack.Screen
                  name="faceauthenticationscreenmain"
                  component={FaceAuthenticationScreenMain}
                />
                <Stack.Screen
                  name="scanfaceInstruction"
                  component={ScanFaceInstruction}
                />
                <Stack.Screen
                  name="waitverifyingnew"
                  component={WaitVerifyingNew}
                />
                <Stack.Screen name="waitverifying" component={WaitVerifying} />
                <Stack.Screen name="home" component={HomePage} />
                {/* Bottom navigation */}
                <Stack.Screen name="main" component={TabNavigator} />
              </Stack.Navigator>
            </NavigationContainer>
          </NativeBaseProvider>
        </ThemeProvider>
      </DataProvider>
    </SafeAreaProvider>
  );
}

export default App;
