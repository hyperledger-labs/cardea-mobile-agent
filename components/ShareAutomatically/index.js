import React, {useState, useEffect} from 'react'

import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {useHistory} from 'react-router-native'

import AppHeaderLarge from '../AppHeaderLarge/index.js'
import LoadingOverlay from '../LoadingOverlay/index.js'

import Images from '@assets/images'
import AppStyles from '@assets/styles'
import Styles from './styles'
import * as Keychain from 'react-native-keychain'

function ShareAutomatically(props) {
  let history = useHistory()
  const [service, setService] = useState()
  const [decision, setDecision] = useState(false)

  useEffect(() => {
    getKeychain()
  }, [])

  const getKeychain = async () => {
    const serv = await Keychain.getGenericPassword({
      service: 'auto_send_trusted_traveler',
    })
    setService(serv)
  }

  const accept = async () => {
    setDecision(true)
    if (service) {
      Keychain.resetGenericPassword({service: 'auto_send_trusted_traveler'})
    }
    await Keychain.setGenericPassword(
      'auto_send_trusted_traveler',
      JSON.stringify(true),
      {
        service: 'auto_send_trusted_traveler',
      },
    )
    getKeychain()
  }

  const deny = async () => {
    setDecision(true)
    if (service) {
      Keychain.resetGenericPassword({service: 'auto_send_trusted_traveler'})
    }
    await Keychain.setGenericPassword(
      'auto_send_trusted_traveler',
      JSON.stringify(false),
      {
        service: 'auto_send_trusted_traveler',
      },
    )
    getKeychain()
  }
  return (
    <View style={Styles.container}>
      {service ? (
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            marginTop: 10,
            textAlign: 'center',
          }}>
          You can enable/disable auto sharing of your trusted traveler in the
          settings page.
        </Text>
      ) : (
        <>
          <Text style={Styles.label}>
            <Text>Share this credential automatically next time?</Text>
          </Text>
          <View style={Styles.buttonContainer}>
            <TouchableOpacity
              onPress={accept}
              style={[AppStyles.button, Styles.confirm]}>
              <Text style={Styles.buttonText}>
                YES{'\n'}
                <Text style={Styles.buttonSub}>Share automatically</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={deny}
              style={[AppStyles.button, Styles.deny]}>
              <Text style={Styles.buttonText}>
                NO{'\n'}
                <Text style={Styles.buttonSub}>
                  I'll review and share each time
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

export default ShareAutomatically
