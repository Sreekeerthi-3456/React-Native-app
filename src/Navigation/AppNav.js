import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

// screens
import AuthNav from './AuthNav';
import HomeNav from './HomeNav';

// context
import {Context} from '../Context/Context';
import {textStyle} from '../primaryStyle';

const pkg = require('../../package.json');

const AppNav = () => {
  const {isLoading, isLoggedIn, updatAvailable, s3BaseUrl} =
    useContext(Context);

  const [animationLoading, setAnimationLoading] = useState(true);

  let local_app_version = parseFloat(pkg.version);

  const fadeImageAnim = useRef(new Animated.Value(0)).current;

  const fadeInImage = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeImageAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutView = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeImageAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  async function downloadApp() {
    await Linking.openURL(`${s3BaseUrl}/apks/runexchange.apk`);
  }

  useEffect(() => {
    setAnimationLoading(true);
    fadeInImage();

    setTimeout(() => {
      fadeOutView();
      setAnimationLoading(false);
    }, 2000);
  }, []);

  // check if app is loading
  if (isLoading) {
    return (
      <>
        <StatusBar backgroundColor="rgba(0, 33, 94, 0.95)" />
        <Animated.View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            backgroundColor: 'rgba(0, 33, 94, 0.95)',
            opacity: fadeImageAnim,
          }}>
          <Animated.View style={{opacity: fadeImageAnim}}>
            <Image source={require('../assets/appLogo.png')} />
          </Animated.View>
          <Text
            style={{
              color: 'white',
              position: 'absolute',
              bottom: 10,
              right: 10,
            }}>
            {local_app_version.toFixed(2)}
          </Text>
        </Animated.View>
      </>
    );
  }

  // check if update is available
  if (updatAvailable) {
    return (
      <Modal animationType="none" transparent={true} visible={updatAvailable}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'blue',
              height: '4%',
              width: 150,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={async () => {
              await downloadApp();
            }}>
            <Text style={[textStyle, {color: 'white'}]}>
              Download Latest version
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <NavigationContainer>
      {!isLoggedIn ? <AuthNav /> : <HomeNav />}
    </NavigationContainer>
  );
};

export default AppNav;

const styles = StyleSheet.create({});
