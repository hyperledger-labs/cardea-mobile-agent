import React, {useState, useEffect} from 'react'

import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import {useHistory} from 'react-router-native'

import Config from 'react-native-config'
import packageJson from '../../package.json'

import AppHeaderLarge from '../AppHeaderLarge/index.js'
import LoadingOverlay from '../LoadingOverlay/index.js'

import AppStyles from '@assets/styles'
import Styles from './styles'
import Images from '@assets/images'

function StartScreen(props) {
  let history = useHistory()

  return (
    <View style={AppStyles.viewFull}>
      <Image source={Images.logoHeaderColor} style={Styles.headerImage} />
      <View style={AppStyles.tab}>
        <Text
          style={[
            AppStyles.h1,
            AppStyles.textPrimary,
            AppStyles.textUpper,
            AppStyles.textCenter,
            AppStyles.marginBottomMd,
            AppStyles.lineHeightMd,
          ]}>
          Welcome!
        </Text>

        <TouchableOpacity
          style={[
            AppStyles.button,
            AppStyles.confirmBackground,
            AppStyles.shadow,
            Styles.startButton,
            AppStyles.marginBottomMd,
          ]}
          onPress={() => {
            history.push('/setup-wizard')
          }}>
          <Text
            style={[
              AppStyles.h2,
              AppStyles.textWhite,
              AppStyles.textCenter,
              AppStyles.textUpper,
            ]}>
            Register{'\n'}Now
          </Text>
        </TouchableOpacity>

        {Config.ENV === 'dev' && process.env['ENV'] !== 'prod' && (
          <Text
            style={[
              AppStyles.h3,
              AppStyles.textPrimary,
              AppStyles.textUpper,
              AppStyles.textCenter,
            ]}>
            {'\n'}Env - '{Config.ENV}' {'\n'}Version - {packageJson.version}
          </Text>
        )}
      </View>
    </View>
  )
}

export default StartScreen
