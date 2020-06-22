import React, {useState, useEffect} from 'react'

import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import * as Keychain from 'react-native-keychain'
import NextButton from '../NextButton'
import AppHeaderLarge from '../../AppHeaderLarge/index.js'
import LoadingOverlay from '../../LoadingOverlay/index.js'
import AppStyles from '@assets/styles'

function PinCreate(props) {
  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
  const [pin, setPin] = useState('')
  const [pinTwo, setPinTwo] = useState('')
  let textInput
  let secondTextInput

  const passcodeCreate = async (x) => {
    const passcode = JSON.stringify(x)
    const description = 'user authentication pin'
    await Keychain.setGenericPassword(description, passcode, {
      service: 'passcode',
    })
  }

  const confirmEntry = (x, y) => {
    if (x !== y) {
      textInput.clear()
      secondTextInput.clear()
      setPin('')
      setPinTwo('')
      Alert.alert('Pins entered do not match')
      throw new Error(`Pins don't match`)
    } else {
      passcodeCreate(x)
      setLoadingOverlayVisible(true)

      console.log('Pins Created')
      return
    }
  }

  //Next Button Mechanisms
  const [nextButtonActive, setNextButtonActive] = useState(false)

  //Continue Condition
  useEffect(() => {
    setNextButtonActive(pin.length === 6 && pinTwo.length === 6)
  }, [pin, pinTwo])

  const proceedCall = () => {
    try {
      //Component pre-continue checks
      confirmEntry(pin, pinTwo)

      props.incrementScreen()
    } catch (error) {
      console.warn('Unable to create pin', error)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        <AppHeaderLarge disabled={true} />
        <View style={[AppStyles.tab, {top: 12}]}>
          <Text
            style={[
              AppStyles.h1,
              AppStyles.textPrimary,
              AppStyles.textUpper,
              AppStyles.textCenter,
              AppStyles.marginBottomMd,
              AppStyles.lineHeightMd,
            ]}>
            First,{'\n'}Choose a Pin
          </Text>
          <View
            style={[
              AppStyles.flexView,
              AppStyles.sideMargin,
              AppStyles.spaceBetween,
              AppStyles.marginBottomMd,
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textLeft,
                {flex: 1},
              ]}>
              Choose{'\n'}6-digit pin
            </Text>
            <View style={AppStyles.labelContainer}>
              <TextInput
                autoCorrect={false}
                style={[AppStyles.formLabel, AppStyles.pinLabel]}
                maxLength={6}
                keyboardType="numeric"
                secureTextEntry={true}
                value={pin}
                ref={(input) => {
                  textInput = input
                }}
                onSubmitEditing={() => {
                  secondTextInput.focus()
                }}
                blurOnSubmit={false}
                onChangeText={(pin) => {
                  setPin(pin.replace(/[^0-9]/g, ''))
                  if (pin.length == 6) {
                    secondTextInput.focus()
                  }
                }}
              />
            </View>
          </View>
          <View
            style={[
              AppStyles.flexView,
              AppStyles.sideMargin,
              AppStyles.spaceBetween,
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textLeft,
                {flex: 1},
              ]}>
              Re-Enter{'\n'}Pin
            </Text>
            <View style={AppStyles.labelContainer}>
              <TextInput
                autoCorrect={false}
                style={[AppStyles.formLabel, AppStyles.pinLabel]}
                maxLength={6}
                keyboardType="numeric"
                secureTextEntry={true}
                value={pinTwo}
                ref={(input) => {
                  secondTextInput = input
                }}
                onChangeText={(pinTwo) => {
                  setPinTwo(pinTwo.replace(/[^0-9]/g, ''))
                  if (pinTwo.length == 6) {
                    Keyboard.dismiss()
                  }
                }}
              />
            </View>
          </View>
        </View>
        <NextButton active={nextButtonActive} continue={proceedCall} />
        {loadingOverlayVisible ? <LoadingOverlay /> : null}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default PinCreate
