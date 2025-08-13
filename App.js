import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/BuyerApp/Home/Home';
import Splash from './components/Splashscreen/Splash';
import BuyerLogin from './components/BuyerApp/SignIn/Login';
import BuyerRegister from './components/BuyerApp/SignUp/Register';
import TourOptions from './components/BuyerApp/TourSection/TourOptions';
import TourSchedule from './components/BuyerApp/TourSection/InpersonTour';
import TourDetails from './components/BuyerApp/TourSection/ScheduleDetails';
import CallTour from './components/BuyerApp/TourSection/ScheduleCallTour';
import CallDetails from './components/BuyerApp/TourSection/CallDetails';
import PropertyDetails from './components/BuyerApp/Home/PropertyDetails';
import BottomNav from './components/BuyerApp/BottomNavigation/Navigation';
import TourList from './components/BuyerApp/ScheduledTours/Schedules';
import Notification from './components/BuyerApp/Notifications/Notifaction';
import SettingsOverview from './components/BuyerApp/Settings/Overview';
import Help from './components/BuyerApp/Settings/Help&Feedback';
import Privacy from './components/BuyerApp/Settings/PrivacyPolicy';
import TermsOfUsage from './components/BuyerApp/Settings/TermsOfUsage';
import ForgotPassword from './components/BuyerApp/ForgotPassword/PasswordReset';
import Onboarding1 from './components/Splashscreen/Onboarding1';
import Onboarding2 from './components/Splashscreen/Onboarding2';
import UserType from './components/Splashscreen/UserTypeOptions';
import OwnerLogin from './components/OwnerApp/Login/OwnerLogin';
import ForgotVerification from './components/OwnerApp/OwnerForgotPassword/EmailVerification';
import OwnerPasswordReset from './components/OwnerApp/OwnerForgotPassword/OwnerPasswordReset';
import OwnerHome from './components/OwnerApp/Home/OwnerHome';
import MyProperties, { TransferPropertyScreen } from './components/OwnerApp/Home/MyProperties';
import AddProperty from './components/OwnerApp/AddPoperties/AddListing';
import OwnerNav from './components/OwnerApp/BottomNavigation/OwnerNav';
import OwnerSettings from './components/OwnerApp/Home/Settings';
import OwnerNotifications from './components/OwnerApp/Home/OwnerNotifications';
import RegisterOwner from './components/OwnerApp/OwnerRegistration/OwnerRegister';
import SecuritySettings from './components/OwnerApp/Home/SecuritySettings';
import Chatlist from './components/ChatApp/Chatlist';
import ChatMessage from './components/ChatApp/ChatMessage';
import CallScreen from './components/ChatApp/CallScreen';
import AddPropertyImages from './components/OwnerApp/AddPoperties/AddPropetyImages';
import AdditionalPropertyInfo from './components/OwnerApp/AddPoperties/AdditionalPropertyInfo'
import EnterOwnerResetEmail from './components/OwnerApp/OwnerForgotPassword/EnterOwnerEmail'
import BuyerVerification from './components/BuyerApp/SignUp/OTPVerification'
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="BuyerLogin" component={BuyerLogin} />
        <Stack.Screen name="BuyerRegister" component={BuyerRegister} />
        <Stack.Screen name="TourOptions" component={TourOptions} />
        <Stack.Screen name="TourSchedule" component={TourSchedule} />
        <Stack.Screen name="TourDetails" component={TourDetails} />
        <Stack.Screen name="CallTour" component={CallTour} />
        <Stack.Screen name="CallDetails" component={CallDetails} />
        <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
        <Stack.Screen name="BottomNav" component={BottomNav} />
        <Stack.Screen name="TourList" component={TourList} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="SettingsOverview" component={SettingsOverview} />
        <Stack.Screen name="Help" component={Help} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="TermsOfUsage" component={TermsOfUsage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        <Stack.Screen name="UserType" component={UserType} />
        <Stack.Screen name="OwnerLogin" component={OwnerLogin} />
        <Stack.Screen
          name="ForgotVerification"
          component={ForgotVerification}
        />
        <Stack.Screen
          name="OwnerPasswordReset"
          component={OwnerPasswordReset}
        />
        <Stack.Screen name="OwnerHome" component={OwnerHome} />
        <Stack.Screen name="MyProperties" component={MyProperties} />
        <Stack.Screen name="AddProperty" component={AddProperty} />
        <Stack.Screen name="OwnerNav" component={OwnerNav} />
        <Stack.Screen name="OwnerSettings" component={OwnerSettings} />
        <Stack.Screen
          name="OwnerNotifications"
          component={OwnerNotifications}
        />
        <Stack.Screen name="RegisterOwner" component={RegisterOwner} />
        <Stack.Screen name="SecuritySettings" component={SecuritySettings} />
        <Stack.Screen name="Chatlist" component={Chatlist} />
        <Stack.Screen name="ChatMessage" component={ChatMessage} />
        <Stack.Screen name="CallScreen" component={CallScreen} />
        <Stack.Screen name="AddPropertyImages" component={AddPropertyImages} />
         <Stack.Screen name="AdditionalPropertyInfo" component={AdditionalPropertyInfo} />
         <Stack.Screen name="EnterOwnerResetEmail" component={EnterOwnerResetEmail} />
         <Stack.Screen name="BuyerVerification" component={BuyerVerification} />
         <Stack.Screen
          name="TransferPropertyScreen"
          component={TransferPropertyScreen}
          options={{ headerShown: false }} // Hide header as TransferPropertyScreen has its own custom header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
