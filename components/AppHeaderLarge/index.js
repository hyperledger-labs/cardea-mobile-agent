import React, {useState, useEffect} from 'react'

import {
  Keyboard,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {useHistory} from 'react-router-native'

import Images from '@assets/images'
import AppStyles from '@assets/styles'
import Styles from './styles'

function AppHeaderLarge(props) {
  let history = useHistory()

  const [keyboardVisible, setKeyboardVisible] = useState(false)

  /* seajensen: adding keyboard listener so that the app
  can gracefully hide the header when there is too much content
  on screen to fit the keyboard */

  useEffect(() => {
    // const keyboardDidShowListener = Keyboard.addListener(
    //   'keyboardDidShow',
    //   () => {
    //     setKeyboardVisible(true) // or some other action
    //   },
    // )
    // const keyboardDidHideListener = Keyboard.addListener(
    //   'keyboardDidHide',
    //   () => {
    //     setKeyboardVisible(false) // or some other action
    //   },
    // )
    // return () => {
    //   keyboardDidHideListener.remove()
    //   keyboardDidShowListener.remove()
    // }
  }, [])

  return (
    <>
      {props.avoidKeyboard && keyboardVisible ? (
        <View style={{height: 20}} />
      ) : (
        <View style={Styles.headerLarge}>
          <TouchableOpacity
            onPress={() => {
              history.push('/home')
            }}
            disabled={props.disabled ? true : false}>
            <Image source={props.alt ? Images.logoHeader : Images.logoHeaderColor} style={Styles.headerImage} />
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}

export default AppHeaderLarge
