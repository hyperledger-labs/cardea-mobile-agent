import React, {useState, useEffect, useContext} from 'react'
import Config from 'react-native-config'
import {Text, TouchableOpacity, View} from 'react-native'
import {useHistory} from 'react-router-native'
import AppHeaderLarge from '../../AppHeaderLarge/index.js'
import LoadingOverlay from '../../LoadingOverlay/index.js'
import Message from '../../Message/index.js'
import AppStyles from '@assets/styles'
import AgentContext from '../../AgentProvider/index.js'
import {storeData} from '../../../utils/storage'
import {
  ConnectionEventType,
  ConnectionState,
  decodeInvitationFromUrl,
  ProofEventType,
  ProofState,
  RequestedCredentials,
} from 'aries-framework'

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
    switch (event.proofRecord.state) {
      case ProofState.RequestReceived:
        const connectionRecord = await agentContext.agent.connections.getById(
          event.proofRecord.connectionId,
        )

        try {
          console.log(
            'Proof Request Message:',
            event.proofRecord.requestMessage,
          )
          console.log(
            'Proof Request:',
            event.proofRecord.requestMessage.indyProofRequest,
          )

          // let DOB = new Date(
          //   `${props.setupData.PassportData.dob.month}/${props.setupData.PassportData.dob.day}/${props.setupData.PassportData.dob.year}`,
          // )

          // const userData = {
          //   email: props.setupData.ContactInfo.email,
          //   phone: props.setupData.ContactInfo.phone,
          //   address: {
          //     address_1: '',
          //     address_2: '',
          //     city: '',
          //     state: props.setupData.AddressInfo.state,
          //     country: props.setupData.AddressInfo.country,
          //     zip_code: '',
          //   },
          //   passport_number: '',
          //   surname: props.setupData.PassportData.names.lastName,
          //   given_names: props.setupData.PassportData.names.names.join(' '),
          //   sex: props.setupData.PassportData.sex.full,
          //   date_of_birth: DOB.toISOString(),
          //   place_of_birth: '',
          //   nationality: '',
          //   date_of_issue: '',
          //   date_of_expiration: '',
          //   type: '',
          //   code: '',
          //   authority: '',
          //   photo: '',
          // }
          const userData = {
            email: '',
            phone: '',
            address: {
              address_1: '',
              address_2: '',
              city: '',
              state: '',
              country: '',
              zip_code: '',
            },
            passport_number: '',
            surname: '',
            given_names: '',
            sex: '',
            date_of_birth: '',
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

          let requestedCredential = new RequestedCredentials({
            selfAttestedAttributes: {
              ...userData,
            },
          })

          setUserCredential(requestedCredential)

          //Check that requested attributes are present
          let attributes = Object.entries(
            event.proofRecord.requestMessage.indyProofRequest
              .requestedAttributes,
          )

          attributes.forEach((attr) => {
            let currentAttribute = attr[0]
            if (!requestedCredential.selfAttestedAttributes[currentAttribute]) {
              console.warn('Missing required attribute: ', currentAttribute)
              setVerifiable(false)
            }
          })

          setProofId(event.proofRecord.id)

          setLoadingOverlayVisible(false)
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

    if (
      event.connectionRecord.id === connectionId &&
      event.connectionRecord.state === ConnectionState.Complete
    ) {
      try {
        console.log('Connected to government agent, sending data transfer')

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
    console.log('IMPORTANT')
    if (agentContext.agent.connections) {
      console.log('connections')
    }
  }, [])

  useEffect(() => {
    if (!agentContext.loading) {
      agentContext.agent.connections.events.on(
        ConnectionEventType.StateChanged,
        connectionEventHandler,
      )
      agentContext.agent.proofs.events.on(
        ProofEventType.StateChanged,
        proofsEventHandler,
      )
      return function () {
        agentContext.agent.connections.events.removeListener(
          ConnectionEventType.StateChanged,
          connectionEventHandler,
        )
        agentContext.agent.proofs.events.removeListener(
          ProofEventType.StateChanged,
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

  const confirmEntry = async () => {
    console.log('You are now queued to connect')
    setLoadingOverlayVisible(true)
    setQueued(true)
    console.log('IMPORTANT', agentContext.loading)
  }

  const connect = async () => {
    console.log('Invitation:', Config.GOVERNMENT_INVITATION)
    // const invitationRecord = await decodeInvitationFromUrl(
    //   Config.GOVERNMENT_INVITATION,
    // )

    const invitationRecord = await decodeInvitationFromUrl(
      'http://happy-cat-18.tun1.indiciotech.io?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiMWY0ZjdkZGUtOTMwNC00NzA3LWFjNmQtZTdjMDU4MzJmOTI1IiwgInNlcnZpY2VFbmRwb2ludCI6ICJodHRwOi8vaGFwcHktY2F0LTE4LnR1bjEuaW5kaWNpb3RlY2guaW8iLCAibGFiZWwiOiAiYm9iIiwgInJlY2lwaWVudEtleXMiOiBbIkNhNmVUQ2huU3RTVm5ZVGZjWkJMODhGWEJFMWE1REw5RnBqQUJ1MVFqNjVZIl19',
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
              Connect to{'\n'}Health Department{'\n'}
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
                Connect Now
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
