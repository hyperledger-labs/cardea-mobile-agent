import React, {useState, useEffect, useContext} from 'react'
import Config from 'react-native-config'
import { DateTime } from 'luxon'
import {Text, TouchableOpacity, View} from 'react-native'
import {useHistory} from 'react-router-native'
import AppHeaderLarge from '../../AppHeaderLarge/index.js'
import LoadingOverlay from '../../LoadingOverlay/index.js'
import Message from '../../Message/index.js'
import AppStyles from '@assets/styles'
import AgentContext from '../../AgentProvider/index.js'
import {storeData} from '../../../utils/storage'
import {
  ConnectionEventTypes,
  ConnectionInvitationMessage,
  ConnectionState,
  ProofEventTypes,
  ProofState,
  RequestedCredentials,
} from '@aries-framework/core'

function ConnectNow(props) {
  //Reference to the agent context
  const agentContext = useContext(AgentContext)

  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(true)
  const [connectionId, setConnectionId] = useState('')
  const [proofId, setProofId] = useState('')
  const [userCredential, setUserCredential] = useState(null)
  const [verifiable, setVerifiable] = useState(true)

  const [queued, setQueued] = useState(false)

  const proofsEventHandler = async (event) => {
    console.log('- - - - EVENT: ', event)
    switch (event.payload.proofRecord.state) {
      case ProofState.RequestReceived:
        try {
          console.log(
            'Proof Request Message:',
            event.payload.proofRecord.requestMessage,
          )
          console.log(
            'Proof Request:',
            event.payload.proofRecord.requestMessage.indyProofRequest,
          )

          let DOB = DateTime.fromObject({
            day: props.setupData.PassportData.dob.day, 
            month: props.setupData.PassportData.dob.month, 
            year: props.setupData.PassportData.dob.year
          })

          // Using JSON.stringify to pass nested object to requested credential, can be refined

          const userData = {
            email: props.setupData.ContactInfo.email,
            phone: props.setupData.ContactInfo.phone,
            address: JSON.stringify({
              address_1: '',
              address_2: '',
              city: '',
              state: props.setupData.AddressInfo.state,
              country: props.setupData.AddressInfo.country,
              zip_code: '',
            }),
            passport_number: '',
            surname: props.setupData.PassportData.names.lastName,
            given_names: props.setupData.PassportData.names.names.join(' '),
            sex: props.setupData.PassportData.sex.full,
            date_of_birth: DOB.toISO({includeOffset: false}),
            place_of_birth: '',
            nationality: '',
            date_of_issue: '',
            date_of_expiration: '',
            type: '',
            code: '',
            authority: '',
            photo: '',
          }

          await storeData('userData', userData)

          let requestedCredentials = new RequestedCredentials({
            selfAttestedAttributes: {
              ...userData,
            },
          })

          setUserCredential(requestedCredentials)

          //Check to see if self attested user data would fufill this request
          let requestedAttributes = Object.keys(
            event.payload.proofRecord.requestMessage.indyProofRequest.requestedAttributes,
          )

          //Determine if user data is sufficient for proof request
          const sufficientData = requestedAttributes.every((requestedAttribute) => {
            return requestedCredentials.selfAttestedAttributes[requestedAttribute]
          })

          if(!sufficientData){
            setVerifiable(false)
          }

          setProofId(event.payload.proofRecord.id)

          setLoadingOverlayVisible(false)
          console.log("Compiled requested Credentials")
        } catch (error) {
          console.warn('Unable to create proof for request', error)
        }
        break
      case ProofState.PresentationSent:
        console.log('Presentation Sent')
        break
      case ProofState.Done:
        console.log('Presentation complete')
        break
    }
  }

  const connectionEventHandler = async (event) => {
    console.log('Connection Event', event)
    console.log('connection record: ', event.payload.connectionRecord)

    if (
      event.payload.connectionRecord.id === connectionId &&
      event.payload.connectionRecord.state === ConnectionState.Complete
    ) {
      try {
        console.log('Connected to government agent')

        console.log('Setup data:', props.setupData)

        const governmentConnectionId = connectionId

        await storeData('governmentConnectionId', governmentConnectionId)
      } catch (error) {
        console.warn('Unable to send data transfer', error)

        setLoadingOverlayVisible(false)
      }
    }
  }

  useEffect(() => {
    console.log('You are now queued to connect')
    setLoadingOverlayVisible(true)
    setQueued(true)
  }, [])

  useEffect(() => {
    if (!agentContext.loading) {
      agentContext.agent.events.on(
        ConnectionEventTypes.ConnectionStateChanged,
        connectionEventHandler,
      )
      agentContext.agent.events.on(
        ProofEventTypes.ProofStateChanged,
        proofsEventHandler,
      )
      return function () {
        agentContext.agent.events.off(
          ConnectionEventTypes.ConnectionStateChanged,
          connectionEventHandler,
        )
        agentContext.agent.events.off(
          ProofEventTypes.ProofStateChanged,
          proofsEventHandler,
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

  const connect = async () => {
    console.log('Invitation:', Config.GOVERNMENT_INVITATION)
    const invitationRecord = await ConnectionInvitationMessage.fromUrl(
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

  const presentProof = async () => {
    setLoadingOverlayVisible(true)
    try {
      console.log("Sending Presentation to Government Agent")
      await agentContext.agent.proofs.acceptRequest(proofId, userCredential)
      props.incrementScreen()
    } catch (error) {
      console.warn('Unable to create proof for request', error)
    }
  }

  return (
    <View style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      {verifiable ? (
        <>
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
              Connected to{'\n'}Health Department{'\n'}
            </Text>
            {connectionId ? <Text>Successfully connected!</Text> : null}
            <TouchableOpacity
              style={[
                AppStyles.button,
                AppStyles.confirmBackground,
                AppStyles.shadow,
                {marginTop: 30, height: 64},
              ]}
              onPress={() => {
                presentProof()
              }}>
              <Text style={[AppStyles.h2, AppStyles.textWhite]}>
                Send Data
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Message
          title={'Insufficient Credentials'}
          text={
            'Unable to verify credentials. Please contact support for more information.'
          }
          bgColor={AppStyles.grayBackground}
          defaultBg={true}
          textColor={AppStyles.textWhite}></Message>
      )}
      {loadingOverlayVisible ? <LoadingOverlay /> : null}
    </View>
  )
}

export default ConnectNow
