import React, {useState, useEffect} from 'react'

import {
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import {useHistory} from 'react-router-native'
import AppHeaderLarge from '../../AppHeaderLarge/index.js'
import LoadingOverlay from '../../LoadingOverlay/index.js'
import {trimObjectStrings} from '../../../utils/objects'
import NextButton from '../NextButton/index.js'
import AppStyles from '@assets/styles'
import Styles from './styles'

function ContactInfo(props) {
  const [contact, setContact] = useState({
    phone: '',
    email: '',
  })
  const [formError, setFormError] = useState({
    phone: false,
    email: false,
  })
  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)

  //Next button mechanisms
  const [nextButtonActive, setNextButtonActive] = useState(false)

  const proceedCall = () => {
    //Component pre-continue checks
    Keyboard.dismiss()
    setLoadingOverlayVisible(true)
    console.log('Contact Info Received')
    props.setSetupData({
      ...props.setupData,
      ContactInfo: trimObjectStrings(contact),
    })
    props.incrementScreen()
  }

  useEffect(() => {
    // checks that phone and email are valid
    if (
      contact.phone.length > 6 &&
      contact.email.length > 5 &&
      !formError.phone &&
      !formError.email
    ) {
      setNextButtonActive(true)
    } else {
      setNextButtonActive(false)
    }
  }, [contact, formError])

  let phone
  let email
  let textInput

  return (
    <TouchableWithoutFeedback style={{flexGrow: 1}} onPress={Keyboard.dismiss}>
      <View style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        <AppHeaderLarge disabled={true} avoidKeyboard={true} />
        <View style={AppStyles.tab}>
          <View
            style={[
              AppStyles.flexView,
              AppStyles.barBlue,
              AppStyles.marginBottomMd,
            ]}>
            <Text
              style={[AppStyles.h3, AppStyles.textBlue, AppStyles.textCenter]}>
              <Text style={AppStyles.textBold}>Visitor</Text> who is{' '}
              <Text style={AppStyles.textBold}>traveling</Text>
            </Text>
          </View>
          <Text
            style={[
              AppStyles.h1,
              AppStyles.textPrimary,
              AppStyles.textUpper,
              AppStyles.textCenter,
              AppStyles.marginBottomMd,
            ]}>
            Contact information
          </Text>
          <View
            style={[
              AppStyles.flexView,
              AppStyles.sideMargin,
              AppStyles.spaceBetween,
              AppStyles.marginBottomSm,
              {flex: 1},
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textLeft,
                {flex: 1, top: 19},
              ]}>
              Phone
            </Text>
            <View style={Styles.contactView}>
              <TextInput
                style={[
                  AppStyles.formLabel,
                  formError.phone ? AppStyles.errorForm : null,
                ]}
                value={phone}
                keyboardType="phone-pad"
                onChangeText={(phone) => setContact({...contact, phone: phone})}
                onSubmitEditing={() => {
                  textInput.focus()
                }}
                onBlur={() => {
                  // Check that phone is valid
                  if (
                    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+[0-9]{6,}$/.test(
                      contact.phone.trim(),
                    )
                  ) {
                    // valid phone
                    setFormError({...formError, phone: false})
                  } else {
                    // invalid phone
                    setFormError({...formError, phone: true})
                  }
                }}
              />
              {formError.phone ? (
                <Text style={[AppStyles.textSmall, AppStyles.textError]}>
                  Not a valid phone number
                </Text>
              ) : (
                <View style={AppStyles.formSpace} />
              )}
            </View>
          </View>
          <View
            style={[
              AppStyles.flexView,
              AppStyles.sideMargin,
              AppStyles.spaceBetween,
              AppStyles.marginBottomMd,
              {flex: 1},
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textLeft,
                {flex: 1, top: 19},
              ]}>
              Email
            </Text>
            <View style={Styles.contactView}>
              <TextInput
                style={[
                  AppStyles.formLabel,
                  Styles.contactLabel,
                  formError.email ? AppStyles.errorForm : null,
                ]}
                value={email}
                keyboardType="email-address"
                ref={(input) => {
                  textInput = input
                }}
                onChangeText={(email) => setContact({...contact, email: email})}
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                }}
                onBlur={() => {
                  // Check that email is valid
                  if (/(.+)@(.+){2,}\.(.+){2,}/.test(contact.email)) {
                    // valid email
                    setFormError({...formError, email: false})
                  } else {
                    // invalid email
                    setFormError({...formError, email: true})
                  }
                }}
              />
              {formError.email ? (
                <Text style={[AppStyles.textSmall, AppStyles.textError]}>
                  Email address is not valid
                </Text>
              ) : (
                <View style={AppStyles.formSpace} />
              )}
            </View>
          </View>
          <NextButton active={nextButtonActive} continue={proceedCall} />
        </View>
        {loadingOverlayVisible ? <LoadingOverlay /> : null}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ContactInfo
