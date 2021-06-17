import React, {useState, useEffect, useContext} from 'react'

import {
  Image,
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
import {trimObjectStrings} from '../../../../utils/objects'

import AppStyles from '@assets/styles'
import Images from '@assets/images'
import Styles from './styles'

function PassportConfirm(props) {
  let history = useHistory()
  let {path, url} = useRouteMatch()
  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)

  if (props.passportData) {
    const personalInfo = [
      props.passportData.names.names.join(' ') +
        ' ' +
        props.passportData.names.lastName,
      'Date of birth: ' +
        props.passportData.dob.month +
        '/' +
        props.passportData.dob.day +
        '/' +
        props.passportData.dob.year,
      props.passportData.sex.full,
      props.passportData.nationality.full,
      'Expiration date: ' +
        props.passportData.expiry.month +
        '/' +
        props.passportData.expiry.day +
        '/' +
        props.passportData.expiry.year,
      'Passport No: ' + props.passportData.documentNumber,
    ]
    return (
      <View
        style={(AppStyles.viewFull, {alignItems: 'center', height: '100%'})}>
        <AppHeaderLarge disabled={true} />
        {/* Title */}
        <Text
          style={[
            AppStyles.h1,
            AppStyles.textPrimary,
            AppStyles.textCenter,
            AppStyles.marginBottomMd,
          ]}>
          Is this you?
        </Text>

        {/* Data list */}
        {personalInfo.map((val, i) => {
          return (
            <Text
              key={i}
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textCenter,
              ]}>
              {val}
            </Text>
          )
        })}
        {/* Buttons */}
        <View style={Styles.buttonContainer}>
          <TouchableOpacity
            style={[
              AppStyles.button,
              AppStyles.confirmBackground,
              Styles.button,
            ]}
            onPress={() => {
              props.setSetupData({
                ...props.setupData,
                PassportData: trimObjectStrings(props.passportData),
              })
              props.incrementScreen()
            }}>
            <Text
              style={[AppStyles.h3, AppStyles.textWhite, AppStyles.textCenter]}>
              Yes,{'\n'}that's me!
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: 300,
              backgroundColor: '#F4C259',
              height: 1,
              margin: 10,
            }}
          />
          <TouchableOpacity>
            <Text
              style={[AppStyles.h3, AppStyles.textGray, AppStyles.textCenter]}
              onPress={() => {
                // props.setPassportData({})
                history.push(`/setup-wizard/userInfo`)
              }}>
              No, something's {'\n'}wrong here
            </Text>
          </TouchableOpacity>
        </View>

        {loadingOverlayVisible ? <LoadingOverlay /> : null}
      </View>
    )
  } else {
    history.push('/setup-wizard/scan')
    return <LoadingOverlay />
  }
}

export default PassportConfirm
