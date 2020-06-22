import React, {useState, useEffect, useContext} from 'react'
import GetMRZ from 'react-native-mrz'
const RNFS = require('react-native-fs')

import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {useHistory, useRouteMatch} from 'react-router-native'
import AppHeaderLarge from '../../../AppHeaderLarge/index.js'
import LoadingOverlay from '../../../LoadingOverlay/index.js'
import {RNCamera} from 'react-native-camera'
import AppStyles from '@assets/styles'
import Styles from './styles'

function PassportPhoto(props) {
  let history = useHistory()
  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
  const [error, setError] = useState(false)
  takePicture = async function (camera) {
    setLoadingOverlayVisible(true)
    const options = {
      quality: 1,
      width: 800,
      base64: false,
      orientation: 'portrait',
      fixOrientation: true,
    }
    const data = await camera.takePictureAsync(options)
    // console.log('console log: ' + data.uri.replace(/file:\/\/\//, ''))
    try {
      console.log('Getting MRZ from Passport... ')
      let start = Date.now()
      // path for image switches between iOS and Android
      const platformPath = () => (Platform.OS === 'ios' ? 'Caches' : 'cache')
      let imgPath = RNFS.CachesDirectoryPath + data.uri.split(platformPath())[1]
      const passData = await GetMRZ(imgPath)
      console.log('Passdata:', passData)
      if (!passData) {
        throw new Error('MRZ Scan Failed')
      }

      props.setPassportData(passData)
      console.log('Time to get MRZ: ' + (Date.now() - start))
      setLoadingOverlayVisible(false)
      history.push('./verify')
    } catch (err) {
      setError(true)
      setLoadingOverlayVisible(false)
      console.log(err)
    }
    setLoadingOverlayVisible(false)
  }

  const passCam = (
    <View style={[Styles.camContainer]}>
      <RNCamera
        ref={(ref) => {
          camera = ref
        }}
        style={loadingOverlayVisible ? {display: 'none'} : Styles.camera}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}></RNCamera>
    </View>
  )

  const lowerText = error ? (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: 300,
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Text
          style={[
            AppStyles.h3,
            AppStyles.textBlack,
            AppStyles.textCenter,
            AppStyles.marginBottomSm,
          ]}>
          Scan Failed
        </Text>
        <TouchableOpacity
          style={{
            width: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => takePicture(camera)}>
          <Text
            style={[
              AppStyles.button,
              AppStyles.confirmBackground,
              AppStyles.textWhite,
              AppStyles.h3,
            ]}>
            Try Again
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[AppStyles.h3, AppStyles.textGray, {marginBottom: 50}]}
          onPress={() => {
            setError(false)
            history.push('/setup-wizard/userInfo')
          }}>
          <Text
            style={[AppStyles.h3, AppStyles.textGray, AppStyles.textCenter]}>
            Enter manually
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: 300,
          borderRadius: 10,
          top: 10,
          alignItems: 'center',
        }}>
        <Text
          style={[AppStyles.textGray, AppStyles.marginBottomMd, AppStyles.h3]}>
          Tap the button to take a photo
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => takePicture(camera)}
        style={{
          width: 200,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={[
            AppStyles.button,
            AppStyles.confirmBackground,
            AppStyles.textWhite,
            AppStyles.h3,
          ]}>
          Take Photo
        </Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      }}>
      <AppHeaderLarge disabled={true} />
      {!loadingOverlayVisible ? (
        <Text
          style={[
            AppStyles.h2,
            AppStyles.textBlack,
            AppStyles.textCenter,
            AppStyles.marginBottomSm,
          ]}>
          {' '}
          Place your passport photo page in the window
        </Text>
      ) : null}
      {passCam}
      {loadingOverlayVisible ? <LoadingOverlay /> : null}
      {!loadingOverlayVisible ? lowerText : null}
    </View>
  )
}

export default PassportPhoto
