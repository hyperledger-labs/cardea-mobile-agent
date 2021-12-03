import React, {useState, useEffect, useContext} from 'react'

import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {useHistory} from 'react-router-native'

import {RNCamera} from 'react-native-camera'

import AppHeaderLarge from '../../AppHeaderLarge/index.js'
import BackButton from '../../BackButton/index.js'
import LoadingOverlay from '../../LoadingOverlay/index.js'

import {ConnectionInvitationMessage} from '@aries-framework/core'
import AgentContext from '../../AgentProvider/'

import Styles from './styles'
import AppStyles from '@assets/styles'

import QRCode from 'react-native-qrcode-svg'

function QRCodeScanner(props) {
  let history = useHistory()

  //Reference to the agent context
  const agentContext = useContext(AgentContext)

  props.setWorkflowInProgress(false)

  //State to determine if we should show the camera any longer
  const [cameraActive, setCameraActive] = useState(true)
  const [scanToggle, setScanToggle] = useState(false)
  const [invitationURL, setInvitationURL] = useState('')

  const _handleBarCodeRead = async (event) => {
    setCameraActive(false)

    console.log('Scanned QR Code')
    console.log('BARCODE: ', event)

    const decodedInvitation = await ConnectionInvitationMessage.fromUrl(event.data)

    console.log('New Invitation:', decodedInvitation)

    const connectionRecord =
      await agentContext.agent.connections.receiveInvitation(
        decodedInvitation,
        {autoAcceptConnection: true},
      )

    console.log('New Connection Record', connectionRecord)

    props.setWorkflow('connecting')
  }

  const camera = (
    <RNCamera
      style={Styles.camera}
      type={RNCamera.Constants.Type.back}
      captureAudio={false}
      androidCameraPermissionOptions={{
        title: 'Permission to use camera',
        message: 'We need your permission to use your camera',
        buttonPositive: 'Ok',
        buttonNegative: 'Cancel',
      }}
      barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      onBarCodeRead={_handleBarCodeRead}></RNCamera>
  )

  const qrCode = (
    <QRCode value={invitationURL} size={300} style={Styles.camera} />
  )

  const spinner = (
    <View style={Styles.spinnerContainer}>
      <ActivityIndicator
        size="large"
        color={AppStyles.secondaryBackground.backgroundColor}
      />
      <Text
        style={[
          Styles.spinnerText,
          {color: AppStyles.secondaryBackground.backgroundColor},
        ]}>
        Loading...
      </Text>
    </View>
  )

  //Generate a new invitation URL on invitationConnection change
  useEffect(() => {
    if (props.invitationConnection.invitation) {
      const url = props.invitationConnection.invitation.toUrl({
        domain:
          agentContext.agent.agentConfig.mediatorConnectionsInvite.split('?')[0],
      })
      setInvitationURL(url)
    }
  }, [props.invitationConnection])

  if (cameraActive || (invitationURL && scanToggle)) {
    return (
      <>
        <BackButton backPath={'/home'} />
        <ScrollView style={AppStyles.viewFull} showsVerticalScrollIndicator>
          <AppHeaderLarge />
          <View style={[AppStyles.tab, Styles.container]}>
            <Text style={[AppStyles.h2, Styles.heading]}>
              {scanToggle
                ? 'Allow a contact to scan my QR Code'
                : "Scan a contact's QR Code"}
            </Text>
            {scanToggle ? (invitationURL ? qrCode : spinner) : camera}
          </View>
          <TouchableOpacity
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 25,
            }}
            onPress={() => {
              setScanToggle(!scanToggle)
            }}>
            <Text
              style={[
                AppStyles.button,
                AppStyles.confirmBackground,
                AppStyles.textWhite,
                AppStyles.h3,
                AppStyles.textCenter,
              ]}>
              {scanToggle ? "Scan a contact's QR Code" : 'Display my QR Code'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </>
    )
  } else {
    return <LoadingOverlay />
  }
}

export default QRCodeScanner
