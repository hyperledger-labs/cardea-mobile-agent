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

import packageJson from '../../package.json'

import {useHistory} from 'react-router-native'

import AppHeaderLarge from '../AppHeaderLarge/index.js'
import BackButton from '../BackButton/index.js'

import Config from 'react-native-config'

import {ErrorsContext} from '../Errors/index.js'

import AppStyles from '@assets/styles'
import Images from '@assets/images.js'
import Styles from './styles'
import * as Keychain from 'react-native-keychain'

function Settings(props) {
  let history = useHistory()
  const [isChecked, setIsChecked] = useState(false)
  const [autoKeychain, setAutoKeychain] = useState()

  const getKeychain = async () => {
    let kc = await Keychain.getGenericPassword({
      service: 'auto_send_trusted_traveler',
    })
    if (!kc) {
      await Keychain.setGenericPassword(
        'auto_send_trusted_traveler',
        JSON.stringify(false),
        {
          service: 'auto_send_trusted_traveler',
        },
      )
      kc = await Keychain.getGenericPassword({
        service: 'auto_send_trusted_traveler',
      })
    }
    setAutoKeychain(kc)
    setIsChecked(JSON.parse(kc.password))
  }

  const toggleAutoShare = async () => {
    if (autoKeychain) {
      const kc = await Keychain.getGenericPassword({
        service: 'auto_send_trusted_traveler',
      })
      const pass = JSON.parse(kc.password)
      Keychain.resetGenericPassword({service: 'auto_send_trusted_traveler'})
      await Keychain.setGenericPassword(
        'auto_send_trusted_traveler',
        JSON.stringify(!pass),
        {
          service: 'auto_send_trusted_traveler',
        },
      )
      getKeychain()
    }
  }

  useEffect(() => {
    getKeychain()
  }, [])

  return (
    <>
      <BackButton backPath={'/home'} />
      <View style={AppStyles.viewFull}>
        <AppHeaderLarge />
        <View style={[Styles.settingView, AppStyles.grayLightBackground]}>
          <TouchableOpacity
            style={AppStyles.marginBottomMd}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => history.push('/home')}>
            <Image source={Images.arrowDown} style={AppStyles.arrow} />
          </TouchableOpacity>
          <Text style={[AppStyles.textPrimary, AppStyles.h3]}>
            <Text style={AppStyles.textBold}>Version: </Text>{' '}
            {packageJson.version}
          </Text>
          {Config.ENV && (
            <Text style={[AppStyles.textPrimary, AppStyles.h3]}>
              <Text style={AppStyles.textBold}>Env: </Text> {Config.ENV}
            </Text>
          )}
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={[AppStyles.textPrimary, AppStyles.h3]}>
              <Text style={AppStyles.textBold}>
                Auto-Share Happy Traveler:{' '}
              </Text>
            </Text>
            <TouchableOpacity onPress={toggleAutoShare}>
              <View style={Styles.checkbox}>
                {isChecked ? (
                  <Image source={Images.checkmark} style={Styles.checkmark} />
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

export default Settings
