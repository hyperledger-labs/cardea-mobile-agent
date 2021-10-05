import React, {useState, useEffect, useContext} from 'react'

import {
  Alert,
  Image,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'

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
import credentialConfigs from '@configs/credentialConfigs.js'

import {getData, storeData} from '../../utils/storage'

import AgentContext from '../AgentProvider/'

import {
  ConnectionEventTypes,
  CredentialEventTypes,
  ProofEventTypes,
  BasicMessageEventTypes,
  ConnectionState,
  CredentialState,
  ProofState,
  JsonTransformer,
  PresentationMessage,
} from '@aries-framework/core'

import CredentialOffered from './Credential/Offered/index.js'
import CredentialRequested from './Credential/Requested/index.js'
import QRCodeScanner from './QRCodeScanner/index.js'
import Message from '../Message/index.js'
import ShareAutomatically from '../ShareAutomatically/index.js'
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
  const [proofId, setProofId] = useState('')
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

    switch (event.credentialRecord.state) {
    case CredentialState.OfferReceived:
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
      break
    case CredentialState.CredentialReceived:
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
        case Schemas.Vaccination:
          console.log('Health Vaccination Credential Issued, pushing to status screen')

          //TODO: Add trustedTraveler action item
          //await storeData('trustedTraveler', true)

          props.setCredential(indyCred)
          setWorkflow('accepted-vaccination')
          break
        case Schemas.VaccinationExemption:
          console.log('Health Vaccination Exemption Credential Issued, pushing to status screen')

          //TODO: Add trustedTraveler action item
          //await storeData('trustedTraveler', true)

          props.setCredential(indyCred)
          setWorkflow('accepted-vaccination-exemption')
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
  }

  //Presentation Event
  const handlePresentationStateChange = async (event) => {
    console.log('- - - - EVENT: ', event)

    var presentationMessage

    switch (event.proofRecord.state) {
      case ProofState.RequestReceived:
        //Get Verifier Connection Record
        const connectionRecord = await agentContext.agent.connections.getById(
          event.proofRecord.connectionId,
        )

        props.setConnection(connectionRecord)

        //Try and get requested credentials for presentation request 
        try {
          console.log(
            'Proof Request Message:',
            event.proofRecord.requestMessage,
            '\nProof Request:',
            event.proofRecord.requestMessage.indyProofRequest,
          )

          const requestedCredentials = await agentContext.agent.proofs.getRequestedCredentialsForProofRequest(
            event.proofRecord.requestMessage.indyProofRequest,
            undefined,
          )
          console.log('Retrieved Requested Credentials: ', requestedCredentials)

          //Check specific presentation request cases

          let schemas = new Set()
          let credDefIds = new Set()
          let attributes = Object.entries(
            event.proofRecord.requestMessage.indyProofRequest
              .requestedAttributes,
          )
          for (const [key, value] of attributes) {
            let schema = value.restrictions[0].schemaId
            if (schema) {
              schemas.add(schema)
            }

            let credDef = value.restrictions[0].credentialDefinitionId
            if (credDef) {
              credDefIds.add(credDef)
            }
          }
          console.log('Requested Schemas:', schemas)
          console.log('Requested Credential Definitions:', credDefIds)

          
          if(schemas.size === 1 || credDefIds.size === 1){
            switch (true) {
              case (schemas.has(Schemas.TrustedTraveler)):
                //Determine if trusted traveler should be auto sent
                const auto = await getData('auto_send_trusted_traveler')
                if (auto) {
                  setWorkflow('sending')
                  console.log(
                    'Request is for a Trusted Traveler, sending proof automatically',
                  )
                  await agentContext.agent.proofs.acceptRequest(
                    event.proofRecord.id,
                    requestedCredentials,
                  )
                  return
                }
                break
              case (schemas.has(Schemas.LabResult)):
              case (schemas.has(Schemas.Vaccination)):
              case (schemas.has(Schemas.VaccinationExemption)): 
              case (credDefIds.has(Config.LAB_RESULT_CRED_DEF_ID)):
              case (credDefIds.has(Config.VACCINATION_CRED_DEF_ID)):
              case (credDefIds.has(Config.EXEMPTION_CRED_DEF_ID)):
                console.log(
                  'Request is required to get a Trusted Traveler, sending automatically',
                )
                await agentContext.agent.proofs.acceptRequest(
                  event.proofRecord.id,
                  requestedCredentials,
                )
                return
            }
          }

          //Set information for generic presentation request screen
          const connectionRecord = await agentContext.agent.connections.getById(
            event.proofRecord.connectionId,
          )
          props.setConnection(connectionRecord)

          setRequestedCredentials(requestedCredentials)
          setProofRecord(event.proofRecord)
          setWorkflow('requested')

          return
        } catch (error){
          //Error if getRequestedCredentialsForProofRequest fails
          console.log("Unable to get requested credentials for proof request", error)

          //Check to see if self attested user data would fufill this request
          const userData = await getData('userData')

          let requestedCredentials = new RequestedCredentials({
            selfAttestedAttributes: {
              ...userData,
            },
          })

          let requestedAttributes = Object.keys(
            event.proofRecord.requestMessage.indyProofRequest.requestedAttributes,
          )

          //Determine if user data is sufficient for proof request
          const sufficientData = requestedAttributes.every((requestedAttribute) => {
            return requestedCredentials.selfAttestedAttributes[requestedAttribute]
          })

          if(sufficientData){
            setRequestedCredentials(requestedCredentials)
            setProofId(event.proofRecord.id)
            setWorkflow('senddata')

            return
          }
          else{
            console.warn("Missing Required Attributes for Proof Request")
          }


          //Display error screen to user and send error message to Verifier
          agentContext.agent.basicMessages.sendMessage(
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
          case Schemas.Vaccination:
          case Schemas.VaccinationExemption:
            console.log('Presentation to get a trusted traveler Sent')

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
          case Schemas.Vaccination:
          case Schemas.VaccinationExemption:
            console.log('Presentation for Trusted Traveler Acked')

            break
          default:
            setWorkflow('verified')

            break
        }

        break
    }
  }

  const shareCredentialForTrustedTraveler = async (credDefID) => {
    console.log(`Proposing presentation to government agent using ${credDefID}`)

    const governmentConnectionId = await getData(
      'governmentConnectionId',
    )

    if (!governmentConnectionId) {
      //TODO: Change to throw an error
      console.warn('Unable to get government connection Id')
    }


    let presentationPreview

    switch (credDefID){
      case Config.LAB_RESULT_CRED_DEF_ID:
        presentationPreview = {
          '@type':
            'https://didcomm.org/present-proof/1.0/presentation-preview',
          attributes: [
            {
              name: 'patient_surnames',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_given_names',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_date_of_birth',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_gender_legal',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_country',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_email',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'lab_specimen_collected_date',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'lab_result',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'lab_observation_date_time',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
          ],
          predicates: [],
        }
    
        setWorkflow('sending-test-result')

        break
      case Config.VACCINATION_CRED_DEF_ID:
        presentationPreview = {
          '@type':
            'https://didcomm.org/present-proof/1.0/presentation-preview',
          attributes: [
            {
              name: 'patient_surnames',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_given_names',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_date_of_birth',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_gender_legal',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_country',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_email',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'vaccine_administration_date',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'vaccine_series_complete',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
          ],
          predicates: [],
        }
    
        setWorkflow('sending-vaccination')

        break
      case Config.EXEMPTION_CRED_DEF_ID:
        presentationPreview = {
          '@type':
            'https://didcomm.org/present-proof/1.0/presentation-preview',
          attributes: [
            {
              name: 'patient_surnames',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_given_names',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_date_of_birth',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_gender_legal',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_country',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'patient_email',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
            {
              name: 'exemption_expiration_date',
              credentialDefinitionId: credDefID,
              referent: 'test_results',
            },
          ],
          predicates: [],
        }
    
        setWorkflow('sending-vaccination-exemption')

        break
      default:
        console.warn(`Unknown Credential to propose presentation for by Credential Definition ID ${credDefID}`)
        return
    }

    console.log('Proposing presentation', presentationPreview)
    await agentContext.agent.proofs.proposeProof(
      governmentConnectionId,
      presentationPreview,
    )
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

  const sendRequestedData = async () => {
    setWorkflow('sending')

    try {
      await agentContext.agent.proofs.acceptRequest(
        proofId,
        requestedCredentials,
      )
      setWorkflow('connected')
    } catch (error) {
      console.warn('Unable to create proof for request', error)
    }
  }

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
        path={`${url}/senddata`}
        render={() => {
          return (
            <Message
              title={'Ready to send passport information'}
              bgColor={'#1B2624'}
              textLight={true}>
              <TouchableOpacity
                style={[
                  AppStyles.button,
                  AppStyles.confirmBackground,
                  {marginTop: 30},
                ]}
                onPress={() => sendRequestedData()}>
                <Text style={[AppStyles.h2, AppStyles.textWhite]}>
                  Send Data
                </Text>
              </TouchableOpacity>
            </Message>
          )
        }}
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
              title={
                'Credential Accepted! \n\nYou are required to share this Test Result Credential with the Aruba Health Department'
              }
              bgColor={AppStyles.grayBackground}
              textColor={AppStyles.textWhite}
              button={{
                text: 'Share now',
                textColor: 'white',
                backgroundColor: AppStyles.secondaryBackground.backgroundColor,
                action: () => shareCredentialForTrustedTraveler(Config.LAB_RESULT_CRED_DEF_ID),
              }}
            />
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
              bgColor={AppStyles.secondaryBackground}
              textColor={AppStyles.textWhite}></Message>
          )
        }}
      />

      <Route
        path={`${url}/accepted-vaccination`}
        render={() => {
          return (
            <Message
              title={
                `Credential Accepted! \n\nYou are required to share this ${credentialConfigs[Schemas.Vaccination].credentialName} Credential with the Aruba Health Department`
              }
              bgColor={AppStyles.grayBackground}
              textColor={AppStyles.textWhite}
              button={{
                text: 'Share now',
                textColor: 'white',
                backgroundColor: AppStyles.secondaryBackground.backgroundColor,
                action: () => shareCredentialForTrustedTraveler(Config.VACCINATION_CRED_DEF_ID),
              }}
            />
          )
        }}
      />
      <Route
        path={`${url}/sending-vaccination`}
        render={() => {
          return (
            <Message
              title={`Verifying your ${credentialConfigs[Schemas.Vaccination].credentialName}....`}
              text={'Please wait for your Happy Traveler Card'}
              bgColor={AppStyles.secondaryBackground}
              textColor={AppStyles.textWhite}></Message>
          )
        }}
      />

      <Route  
        path={`${url}/accepted-vaccination-exemption`}
        render={() => {
          return (
            <Message
              title={
                `Credential Accepted! \n\nYou are required to share this ${credentialConfigs[Schemas.Vaccination].credentialName} Credential with the Aruba Health Department`
              }
              bgColor={AppStyles.grayBackground}
              textColor={AppStyles.textWhite}
              button={{
                text: 'Share now',
                textColor: 'white',
                backgroundColor: AppStyles.secondaryBackground.backgroundColor,
                action: () => shareCredentialForTrustedTraveler(Config.EXEMPTION_CRED_DEF_ID),
              }}
            />
          )
        }}
      />
      <Route
        path={`${url}/sending-vaccination-exemption`}
        render={() => {
          return (
            <Message
              title={`Verifying your ${credentialConfigs[Schemas.VaccinationExemption].credentialName}....`}
              text={'Please wait for your Happy Traveler Card'}
              bgColor={AppStyles.secondaryBackground}
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
