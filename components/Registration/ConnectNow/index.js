import React, {useState, useEffect, useContext} from 'react'
import Config from 'react-native-config'
import {Text, TouchableOpacity, View} from 'react-native'
import {useHistory} from 'react-router-native'
import AppHeaderLarge from '../../AppHeaderLarge/index.js'
import LoadingOverlay from '../../LoadingOverlay/index.js'
import AppStyles from '@assets/styles'
import AgentContext from '../../AgentProvider/index.js'
import {storeData} from '../../../utils/storage'
import {
  ConnectionEventType,
  ConnectionState,
  decodeInvitationFromUrl,
} from '@aries-framework/core'

function ConnectNow(props) {
  //Reference to the agent context
  const agentContext = useContext(AgentContext)

  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
  const [connectionId, setConnectionId] = useState('')

  const [queued, setQueued] = useState(false)

  const connectionEventHandler = async (event) => {
    console.log('Connection Event', event)

    if (
      event.connectionRecord.id === connectionId &&
      event.connectionRecord.state === ConnectionState.Complete
    ) {
      try {
        console.log('Connected to government agent, sending data transfer')

        console.log('Setup data:', props.setupData)

        const governmentConnectionId = connectionId

        await storeData('governmentConnectionId', governmentConnectionId)

        const demographicData = {
          email: props.setupData.ContactInfo.email,
          phone: props.setupData.ContactInfo.phone,
          address: {
            address_1: '',
            address_2: '',
            city: '',
            state: props.setupData.AddressInfo.state,
            country: props.setupData.AddressInfo.country,
            zip_code: '',
          },
        }

        await storeData('demographicData', demographicData)

        let DOB = new Date(
          `${props.setupData.PassportData.dob.month}/${props.setupData.PassportData.dob.day}/${props.setupData.PassportData.dob.year}`,
        )

        const passportData = {
          passport_number: '',
          surname: props.setupData.PassportData.names.lastName,
          given_names: props.setupData.PassportData.names.names.join(' '),
          sex: props.setupData.PassportData.sex.full,
          date_of_birth: DOB.toISOString(),
          place_of_birth: '',
          nationality: '',
          date_of_issue: '',
          date_of_expiration: '',
          type: '',
          code: '',
          authority: '',
          photo: '',
        }

        console.log('PassportData:', passportData)

        await storeData('passportData', passportData)

        await agentContext.agent.dataTransfer.sendData(
          demographicData,
          event.connectionRecord.id,
          'transfer.demographicdata',
          'demographic data attachment',
        )

        await agentContext.agent.dataTransfer.sendData(
          passportData,
          event.connectionRecord.id,
          'transfer.passportdata',
          'passport data attachment',
        )

        props.incrementScreen()
      } catch (error) {
        console.warn('Unable to send data transfer', error)

        setLoadingOverlayVisible(false)
      }
    }
  }

  useEffect(() => {
    if (!agentContext.loading) {
      agentContext.agent.connections.events.on(
        ConnectionEventType.StateChanged,
        connectionEventHandler,
      )

      return function () {
        agentContext.agent.connections.events.removeListener(
          ConnectionEventType.StateChanged,
          connectionEventHandler,
        )
      }
    }
  })

  useEffect(() => {
    if (!agentContext.loading && queued) {
      console.log('Agent connected and you are ready to connect')
      setQueued(false)
      connect()
    }
  })

  const confirmEntry = async () => {
    console.log('You are now queued to connect')
    setLoadingOverlayVisible(true)
    setQueued(true)
  }

  const connect = async () => {
    console.log('Invitation:', Config.GOVERNMENT_INVITATION)
    const invitationRecord = await decodeInvitationFromUrl(
      Config.GOVERNMENT_INVITATION,
    )

    console.log('New Invitation:', invitationRecord)

    const connectionRecord =
      await agentContext.agent.connections.receiveInvitation(invitationRecord, {
        autoAcceptConnection: true,
      })

    console.log('New Connection Record', connectionRecord)
    setConnectionId(connectionRecord.id)
  }

  return (
    <View style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <AppHeaderLarge disabled={true} />
      <View style={AppStyles.tab}>
        <Text
          style={[
            AppStyles.h2,
            AppStyles.textPrimary,
            AppStyles.textCenter,
            AppStyles.marginBottomMd,
            AppStyles.lineHeightMd,
          ]}>
          Connect to{'\n'}Health Department{'\n'}
        </Text>

        <TouchableOpacity
          style={[
            AppStyles.button,
            AppStyles.confirmBackground,
            AppStyles.shadow,
            {marginTop: 30, height: 64},
          ]}
          onPress={() => {
            confirmEntry()
          }}>
          <Text style={[AppStyles.h2, AppStyles.textWhite]}>Connect Now</Text>
        </TouchableOpacity>
      </View>
      {loadingOverlayVisible ? <LoadingOverlay /> : null}
    </View>
  )
}

export default ConnectNow
