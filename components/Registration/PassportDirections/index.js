import React, {useState} from 'react'

import {Image, Text, View, ScrollView} from 'react-native'

import NextButton from '../NextButton'
import AppHeaderLarge from '../../AppHeaderLarge/index.js'
import AppStyles from '@assets/styles'
import Images from '@assets/images'
import Styles from './styles'
import {normalize} from '../../../utils/sizing'

function PassportDirections(props) {
  //Next Button Mechanisms
  const [nextButtonActive, setNextButtonActive] = useState(true)

  const proceedCall = () => {
    //Component pre-continue checks
    props.incrementScreen()
  }

  const pictureContainer = (
    <View style={Styles.camContainer}>
      <View style={Styles.imgContainer}>
        <Image
          source={Images.passport}
          style={Styles.camera}
          resizeMode="contain"
        />
      </View>
    </View>
  )

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator>
        <AppHeaderLarge disabled={true} />
        <Text
          style={[AppStyles.h2, AppStyles.textPrimary, AppStyles.textCenter]}>
          UPLOAD YOUR PASSPORT
        </Text>
        {pictureContainer}
        <Text
          style={[
            AppStyles.textPrimary,
            AppStyles.textCenter,
            {fontSize: normalize(20), width: '70%'},
          ]}>
          Confirming your identity using a government-issued identification will
          allow you to accept a health credential
        </Text>
      </ScrollView>
      <NextButton active={nextButtonActive} continue={proceedCall} />
    </View>
  )
}

export default PassportDirections
