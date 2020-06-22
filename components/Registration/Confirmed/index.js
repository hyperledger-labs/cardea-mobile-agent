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

import AppHeaderLarge from '../../AppHeaderLarge/index.js'
import LoadingOverlay from '../../LoadingOverlay/index.js'

import AppStyles from '@assets/styles'
import Images from '@assets/images'

function Confirmed(props) {
  let history = useHistory()

  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)

  const confirmEntry = () => {
    setLoadingOverlayVisible(true)
    console.log('Setup Complete!')
    props.incrementScreen()
  }

  return (
    <View style={AppStyles.viewFull}>
      <AppHeaderLarge disabled={true} />
      <View style={AppStyles.tab}>
        <Text
          style={[
            AppStyles.h2,
            AppStyles.textPrimary,
            AppStyles.textUpper,
            AppStyles.textCenter,
            AppStyles.lineHeightMd,
            AppStyles.marginBottomLg,
            {top: 20},
          ]}>
          Confirmed!
        </Text>
        <Text
          style={[
            AppStyles.h2,
            AppStyles.textPrimary,
            AppStyles.textCenter,
            AppStyles.lineHeightMd,
            AppStyles.marginBottomSm,
          ]}>
          You're finished{'\n'}validating your{'\n'}identity!
        </Text>

        <TouchableOpacity
          style={[AppStyles.button, AppStyles.flexView, {top: 15}]}
          onPress={() => {
            confirmEntry()
          }}>
          <Text
            style={[AppStyles.h2, AppStyles.textUpper, AppStyles.textPrimary]}>
            Next
          </Text>
          <View style={{width: 46}}>
            <Image source={Images.arrow} style={{marginLeft: 20}} />
          </View>
        </TouchableOpacity>
      </View>
      {loadingOverlayVisible ? <LoadingOverlay /> : null}
    </View>
  )
}

export default Confirmed
