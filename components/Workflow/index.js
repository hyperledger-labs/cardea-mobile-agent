import React, {useState, useEffect, useContext} from 'react'

import {Alert, Image, Text, View, TouchableWithoutFeedback} from 'react-native'

import {
  Prompt,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-native'

import Config from 'react-native-config'

import Images from '@assets/images'
import AppStyles from '@assets/styles'
import {Schemas} from '@configs/credentialConfigs'

import {getData, storeData} from '../../utils/storage'

import AgentContext from '../AgentProvider/'

import {
  ConnectionEventTypes,
  CredentialEventTypes,
  ProofEventTypes,
  BasicMessageEventTypes,
  ConnectionState,
  ProofState,
  JsonTransformer,
  PresentationMessage,
} from '@aries-framework/core'

import CredentialOffered from './Credential/Offered/index.js'
import CredentialRequested from './Credential/Requested/index.js'
import QRCodeScanner from './QRCodeScanner/index.js'
import Message from '../Message/index.js'
import ShareAutomatically from '../ShareAutomatically/index.js'
import credentialConfigs from '@configs/credentialConfigs.js'
import {getConnectionData} from '../../utils'

function Workflow(props) {
  let history = useHistory()
  let {url} = useRouteMatch()

  const [workflow, setWorkflow] = useState('connect')
  const [workflowInProgress, setWorkflowInProgress] = useState(true)
  const [firstRender, setFirstRender] = useState(false)

  const [invitationConnection, setInvitationConnection] = useState({})

  //On component load
  useEffect(() => {
    homeTutorial()
  }, [])

  //Deal with tutorial keychain
  const homeTutorial = async () => {
    let kc = await getData('home_tutorial')
    console.log('KC', kc)
    if (!kc) {
      storeData('home_tutorial', {seen: 'true'})
    }
  }

  //Get connection data for credential
  const getConnectionDataFromID = async (connectionID) => {
    const connection = await agentContext.agent.connections.find(connectionID)
    return getConnectionData(connection)
  }

  //Presentation information
  const [proofRecord, setProofRecord] = useState({})
  const [requestedCredentials, setRequestedCredentials] = useState({})

  //Reference to the agent context
  const agentContext = useContext(AgentContext)

  //Credential Event Callback
  const handleCredentialStateChange = async (event) => {
    console.info(
      `Credentials State Change, new state: "${event.credentialRecord.state}"`,
      event,
    )

    if (event.credentialRecord.state === 'offer-received') {
      console.log(
        'IndyCredentialOffer:',
        event.credentialRecord.offerMessage.indyCredentialOffer,
      )
      const connectionRecord = await agentContext.agent.connections.getById(
        event.credentialRecord.connectionId,
      )

      props.setConnection(connectionRecord)

      const previewAttributes =
        event.credentialRecord.offerMessage.credentialPreview.attributes

      let attributes = {}
      for (const index in previewAttributes) {
        attributes[previewAttributes[index].name] =
          previewAttributes[index].value
      }

      let credentialToDisplay = {
        attributes,
        connectionId: event.credentialRecord.connectionId,
        id: event.credentialRecord.id,
        connection: await getConnectionDataFromID(
          event.credentialRecord.connectionId,
        ),
        fullRecord: event.credentialRecord,
        full: event,
        schemaId:
          event.credentialRecord.offerMessage.indyCredentialOffer.schema_id,
      }
      //Display Credential Name if schema id is configurated
      if (credentialConfigs[credentialToDisplay.schemaId]) {
        credentialToDisplay.credentialName =
          credentialConfigs[credentialToDisplay.schemaId].credentialName
      }

      console.log('----------------------------------------')
      console.log('credentialToDisplay', credentialToDisplay)

      props.setCredential(credentialToDisplay)

      //Alternate workflows for specific schemas:
      switch (credentialToDisplay.schemaId) {
        case Schemas.TrustedTraveler:
          //Auto accept trusted traveler:
          console.log(
            'Received Credential Offer for Trusted Traveler, auto accepting',
          )

          await agentContext.agent.credentials.acceptOffer(
            credentialToDisplay.id,
          )

          break
        default:
          setWorkflow('offered')
          break
      }
    } else if (event.credentialRecord.state === 'credential-received') {
      console.log('attempting to send ack')

      await agentContext.agent.credentials.acceptCredential(
        event.credentialRecord.id,
      )

      const indyCred = await agentContext.agent.credentials.getIndyCredential(
        event.credentialRecord.credentialId,
      )
      console.log('IndyCred', indyCred)
      switch (indyCred.schemaId) {
        case Schemas.LabResult:
          console.log('Lab Result Credential Issued, pushing to status screen')

          //Add trustedTraveler action item
          await storeData('trustedTraveler', true)

          props.setCredential(indyCred)
          setWorkflow('accepted-test-result')
          break
        case Schemas.TrustedTraveler:
          console.log(
            'Trusted Traveler Credential Issued, pushing to custom status screen',
          )

          props.setCredential(indyCred)
          setWorkflow('happy-traveler')
          break
        default:
          //Push to default credential issued screen
          console.log('Credential Issued, pushing to status screen')
          setWorkflow('issued')
          break
      }
    }

    //TODO: Update Credentials List
  }

  //Presentation Event
  const handlePresentationStateChange = async (event) => {
    console.log('- - - - EVENT: ', event)

    var presentationMessage

    switch (event.proofRecord.state) {
      case ProofState.RequestReceived:
        const connectionRecord = await agentContext.agent.connections.getById(
          event.proofRecord.connectionId,
        )

        props.setConnection(connectionRecord)

        try {
          console.log(
            'Proof Request Message:',
            event.proofRecord.requestMessage,
          )
          console.log(
            'Proof Request:',
            event.proofRecord.requestMessage.indyProofRequest,
          )

          const requestedCredential =
            await agentContext.agent.proofs.getRequestedCredentialsForProofRequest(
              event.proofRecord.requestMessage.indyProofRequest,
              undefined,
            )
          console.log('Requested Credentials: ', requestedCredential)
          setRequestedCredentials(requestedCredential)
          setProofRecord(event.proofRecord)

          //Catch custom workflows
          //Check Proof Request for singular schema IDs or cred def IDs
          let schemas = []
          let credDefIds = []
          let attributes = Object.entries(
            event.proofRecord.requestMessage.indyProofRequest
              .requestedAttributes,
          )
          for (const [key, value] of attributes) {
            let schema = value.restrictions[0].schemaId
            if (schema && !schemas.includes(schema)) {
              schemas.push(schema)
            }

            let credDef = value.restrictions[0].credentialDefinitionId
            if (credDef && !credDefIds.includes(credDef)) {
              credDefIds.push(credDef)
            }
          }
          console.log('Requested Schemas:', schemas)
          console.log('Requested Credential Definitions:', credDefIds)

          if (schemas.length === 1 && schemas[0] === Schemas.TrustedTraveler) {
            //Determine if trusted traveler and if should be auto sent
            const auto = await getData('auto_send_trusted_traveler')
            if (auto) {
              setWorkflow('sending')
              console.log(
                'Request is for a Trusted Traveler, sending proof automatically',
              )
              await agentContext.agent.proofs.acceptRequest(
                event.proofRecord.id,
                requestedCredential,
              )
            } else {
              setWorkflow('requested')
            }
          } else if (
            (schemas.length === 1 && schemas[0] === Schemas.LabResult) ||
            (credDefIds.length === 1 &&
              credDefIds[0] === Config.LAB_RESULT_CRED_DEF_ID)
          ) {
            console.log(
              'Request is for a Test Result, sending proof automatically',
            )
            await agentContext.agent.proofs.acceptRequest(
              event.proofRecord.id,
              requestedCredential,
            )
          } else {
            setWorkflow('requested')
          }
        } catch (error) {
          console.warn('Unable to create proof for request', error)

          await agentContext.agent.basicMessages.sendMessage(
            connectionRecord,
            'INSUFFICIENT_CREDENTIALS',
          )
          setWorkflow('invalid')
        }
        break
      case ProofState.PresentationSent:
        console.log('Presentation Sent')

        presentationMessage = JsonTransformer.fromJSON(
          event.proofRecord.presentationMessage,
          PresentationMessage,
        )
        console.log(
          'Indy Proof',
          event.proofRecord.presentationMessage.indyProof,
          presentationMessage,
          presentationMessage.indyProof,
        )
        console.log(presentationMessage.indyProof.identifiers[0].schema_id)

        switch (presentationMessage.indyProof.identifiers[0].schema_id) {
          case Schemas.LabResult:
            console.log('Test Result Presentation Sent')

            //We have successfully sent the presentation, we should remove the Action Item card at this stage.
            await storeData('trustedTraveler', false)

            break
          default:
            setWorkflow('sent')

            break
        }

        break
      case ProofState.Done:
        console.log('Presentation complete')

        presentationMessage = JsonTransformer.fromJSON(
          event.proofRecord.presentationMessage,
          PresentationMessage,
        )
        console.log(
          'Indy Proof',
          event.proofRecord.presentationMessage.indyProof,
          presentationMessage,
          presentationMessage.indyProof,
        )
        console.log(presentationMessage.indyProof.identifiers[0].schema_id)

        switch (presentationMessage.indyProof.identifiers[0].schema_id) {
          case Schemas.LabResult:
            console.log('Test Result Acked')

            break
          default:
            setWorkflow('verified')

            break
        }

        break
    }
  }

  const handleBasicMessage = async (event) => {
    console.log('Received Basic Message Event', event)

    //TODO: Replace the following with present-proof v2 functionality
    switch (event.message.content) {
      case 'UNVERIFIED':
        console.log('Received Presentation Unverified')
        setWorkflow('unverified')

        break
      case 'INVALID_PROOF':
        console.log('Received Message that Proof was insufficient')
        setWorkflow('invalid')

        break
      default:
        console.log(`New Basic Message: '${event.message.content}'`)
        break
    }
  }

  //Genereate new invitation
  const generateInvitation = async () => {
    const invitation = await agentContext.agent.connections.createConnection(
      true,
      'Cardea Mobile Holder',
    )
    const url = invitation.invitation.toUrl(
      agentContext.agent.agentConfig.mediatorUrl,
    )
    console.log('New invitation url:', url)
    setInvitationConnection(invitation)
  }

  //Event listener for invitation connection update
  const handleConnectionsUpdate = async (event) => {
    console.log('Workflows - Connection update event:', event)
    if (event.connectionRecord.state === ConnectionState.Complete) {
      console.log('Connection is active, sending data transfer')

      const demographicData = await getData('demographicData')
      const passportData = await getData('passportData')

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

      setWorkflow('connected')
    }

    //If the connection becomes active that was used for our QR Code, generate a new invitation
    if (invitationConnection.connectionRecord) {
      console.log(
        'Invitation connection Record',
        invitationConnection.connectionRecord,
      )

      if (
        event.connectionRecord.id ===
          invitationConnection.connectionRecord.id &&
        event.connectionRecord.state === 'complete'
      ) {
        generateInvitation()
      }
    }
  }

  useEffect(() => {
    if (!agentContext.loading) {
      agentContext.agent.events.on(
        CredentialEventTypes.StateChanged,
        handleCredentialStateChange,
      )
      agentContext.agent.events.on(
        ProofEventTypes.StateChanged,
        handlePresentationStateChange,
      )
      agentContext.agent.events.on(
        BasicMessageEventTypes.BasicMessageReceived,
        handleBasicMessage,
      )
      generateInvitation()

      return function () {
        agentContext.agent.credentials.events.removeListener(
          CredentialEventTypes.StateChanged,
          handleCredentialStateChange,
        )
        agentContext.agent.proofs.events.removeListener(
          ProofEventTypes.StateChanged,
          handlePresentationStateChange,
        )
        agentContext.agent.basicMessages.events.removeListener(
          BasicMessageEventTypes.BasicMessageReceived,
          handleBasicMessage,
        )
      }
    }
  }, [agentContext.loading])

  //Invitation connection event listeners
  useEffect(() => {
    agentContext.agent.events.on(
      ConnectionEventTypes.StateChanged,
      handleConnectionsUpdate,
    )

    return function () {
      agentContext.agent.connections.events.removeListener(
        ConnectionEventTypes.StateChanged,
        handleConnectionsUpdate,
      )
    }
  }, [invitationConnection])

  useEffect(() => {
    setWorkflowInProgress(true)

    //Don't re-push the first workflow screen for back-up functionality
    //TODO: Refactor
    if (firstRender) {
      history.push(`${url}/${workflow}`)
    } else {
      setFirstRender(true)
    }
  }, [workflow])

  // Mock Credentials

  const mockCredential = {
    label: 'Covid-19 Vaccination',
    sublabel: 'Brooklyn Health Clinic',
    first_name: 'John',
    last_name: 'Doe',
    provider: 'Dr. Jane Smith',
    date_received: 'Oct 30, 2020',
    service: 'Covid-19 Vaccination',
    result: 'Vaccinated',
    cred_id: 1234567,
  }

  return (
    <View>
      <Route
        path={`${url}/connect`}
        render={() => (
          <QRCodeScanner
            setWorkflow={setWorkflow}
            setWorkflowInProgress={setWorkflowInProgress}
            invitationConnection={invitationConnection}
          />
        )}
      />
      <Route
        path={`${url}/connecting`}
        render={() => {
          return (
            <Message
              title={'Connecting'}
              bgColor={AppStyles.tertiaryBackground}
              textColor={AppStyles.textWhite}
              image={Images.whiteHexagon}></Message>
          )
        }}
      />
      <Route
        path={`${url}/connected`}
        render={() => {
          return (
            <Message
              title={`Connected\n\nPlease wait...`}
              bgColor={AppStyles.tertiaryBackground}
              textColor={AppStyles.textWhite}
              image={Images.whiteHexagon}></Message>
          )
        }}
      />
      <Route
        path={`${url}/offered`}
        render={() => (
          <CredentialOffered
            setWorkflow={setWorkflow}
            contact={getConnectionData(props.connection)}
            credential={props.credential}
          />
        )}
      />
      <Route
        path={`${url}/pending`}
        render={() => {
          return (
            <Message
              title={'Pending Issuance'}
              bgColor={'#1B2624'}
              textLight={true}
              image={Images.blueHexagon}></Message>
          )
        }}
      />
      <Route
        path={`${url}/issued`}
        render={() => {
          return (
            <Message
              title={'Credential Accepted'}
              bgColor={'#1B2624'}
              textLight={true}
              image={Images.blueHexagonCheckmark}></Message>
          )
        }}
      />
      <Route
        path={`${url}/requested`}
        render={() => (
          <CredentialRequested
            setWorkflow={setWorkflow}
            credential={mockCredential}
            contact={getConnectionData(props.connection)}
            proofRecord={proofRecord}
            requestedCredentials={requestedCredentials}
          />
        )}
      />
      <Route
        path={`${url}/sending`}
        render={() => {
          return (
            <Message
              title={'Sending Credentials'}
              bgColor={'#1B2624'}
              textLight={true}
              image={Images.blueHexagon}></Message>
          )
        }}
      />
      <Route
        path={`${url}/sent`}
        render={() => {
          return (
            <Message
              title={'Credentials Sent'}
              bgColor={'#1B2624'}
              textLight={true}
              image={Images.blueHexagonCheckmark}></Message>
          )
        }}
      />
      <Route
        path={`${url}/unverified`}
        render={() => {
          return (
            <Message
              title={'UNVERIFIED'}
              text={'Please contact support for more information.'}
              bgColor={AppStyles.grayBackground}
              textColor={AppStyles.textWhite}></Message>
          )
        }}
      />
      <Route
        path={`${url}/invalid`}
        render={() => {
          return (
            <Message
              title={'INVALID CREDENTIALS'}
              text={'Please contact support for more information.'}
              bgColor={AppStyles.grayBackground}
              textColor={AppStyles.textWhite}></Message>
          )
        }}
      />
      <Route
        path={`${url}/verified`}
        render={() => {
          return (
            <Message
              title={'Credential Verified!\n \nAPPROVED'}
              bgColor={AppStyles.greenBackground}
              image={Images.credential}
              textColor={AppStyles.textWhite}>
              <ShareAutomatically />
            </Message>
          )
        }}
      />

      <Route
        path={`${url}/accepted-test-result`}
        render={() => {
          return (
            <Message
              title={'Credential Accepted!'}
              bgColor={AppStyles.grayBackground}
              textColor={AppStyles.textWhite}
              button={{
                text: 'Share now',
                textColor: 'white',
                backgroundColor: AppStyles.tertiaryBackground.backgroundColor,
                action: async () => {
                  const governmentConnectionId = await getData(
                    'governmentConnectionId',
                  )

                  if (!governmentConnectionId) {
                    console.warn('Unable to get government connection Id')
                  }

                  console.log('Proposing presentation to government agent')

                  const credDefId = Config.LAB_RESULT_CRED_DEF_ID

                  console.log(
                    'Cred Def ID for presentation proposal:',
                    credDefId,
                  )

                  const presentationPreview = {
                    '@type':
                      'https://didcomm.org/present-proof/1.0/presentation-preview',
                    attributes: [
                      {
                        name: 'patient_first_name',
                        credentialDefinitionId: credDefId,
                        referent: 'test_results',
                      },
                      {
                        name: 'patient_last_name',
                        credentialDefinitionId: credDefId,
                        referent: 'test_results',
                      },
                      {
                        name: 'patient_date_of_birth',
                        credentialDefinitionId: credDefId,
                        referent: 'test_results',
                      },
                      {
                        name: 'result',
                        credentialDefinitionId: credDefId,
                        referent: 'test_results',
                      },
                      {
                        name: 'observation_date_time',
                        credentialDefinitionId: credDefId,
                        referent: 'test_results',
                      },
                    ],
                    predicates: [],
                  }

                  setWorkflow('sending-test-result')

                  console.log('Proposing presentation', presentationPreview)
                  await agentContext.agent.proofs.proposeProof(
                    governmentConnectionId,
                    presentationPreview,
                  )
                },
              }}></Message>
          )
        }}
      />
      <Route
        path={`${url}/sending-test-result`}
        render={() => {
          return (
            <Message
              title={'Verifying your test result....'}
              text={'Please wait for your Happy Traveler Card'}
              bgColor={AppStyles.tertiaryBackground}
              textColor={AppStyles.textWhite}></Message>
          )
        }}
      />
      <Route
        path={`${url}/happy-traveler`}
        render={() => {
          return (
            <>
              <Message
                text={
                  <>
                    You've been awarded a{' '}
                    <Text style={AppStyles.textBold}>Happy Traveler Card!</Text>
                    {'\n\n'}This card stays in your app, and allows you to share
                    your health status at Digital Health Check Sites across the
                    island, just by scanning a QR code.{'\n\n'}Best of all, it
                    protects your privacy because it contains no personal data!
                  </>
                }
                bgColor={AppStyles.tertiaryBackground}
                textColor={AppStyles.textWhite}
                button={{
                  text: 'Ok, thank you!',
                  textColor: 'white',
                  backgroundColor: AppStyles.greenBackground.backgroundColor,
                  action: () => {
                    history.push('/home')
                  },
                }}></Message>
            </>
          )
        }}
      />
    </View>
  )
}
export default Workflow
