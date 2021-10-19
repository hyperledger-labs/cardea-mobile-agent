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

import {useHistory} from 'react-router-native'

import {parseSchema, formatDate} from '../../../../utils'

import AppHeaderLarge from '../../../AppHeaderLarge/index.js'
import BackButton from '../../../BackButton/index.js'
import CurrentContact from '../../../CurrentContact/index.js'
import CurrentRequest from '../../CurrentRequest/index.js'
import LoadingOverlay from '../../../LoadingOverlay/index.js'

import {ErrorsContext} from '../../../Errors/index.js'
import {NotificationsContext} from '../../../Notifications/index.js'

import Images from '@assets/images'
import AppStyles from '@assets/styles'
import Styles from '../styles'
import AgentContext from '../../../AgentProvider/'
import credentialConfigs from '@configs/credentialConfigs.js'

function CredentialRequested(props) {
  let history = useHistory()

  const [viewInfo, setViewInfo] = useState('')
  const [viewContact, setViewContact] = useState(false)
  const [viewCredential, setViewCredential] = useState(false)

  const errors = useContext(ErrorsContext)
  const notifications = useContext(NotificationsContext)
  const agentContext = useContext(AgentContext)

  const [credLabels, setCredLabels] = useState([])
  const [reqCredentials, setReqCredentials] = useState([])
  const [attributes, setAttributes] = useState([])

  const acceptPresentation = async () => {
    console.log('Attempting to accept presentation')
    history.push('/workflow/sending')
    await agentContext.agent.proofs.acceptRequest(
      props.proofRecord.id,
      props.requestedCredentials,
    )
    history.push('/workflow/sent')
  }

  const listCredentials = async () => {
    if (props.requestedCredentials.requestedAttributes) {
      console.log(props.requestedCredentials)
      let newCredLabels = []
      let credentialsToDisplay = []
      let credentialIds = []
      const attrCred = Object.entries(
        props.requestedCredentials.requestedAttributes,
      )
      let newArr = []
      for (const curr of attrCred) {
        let obj
        if (!credentialIds.includes(curr[1].credentialId)) {
          credentialIds.push(curr[1].credentialId)
          let credentialToDisplay = {
            ...(await curr[1].getCredentialInfo()),
            credentialId: curr[1].credentialId,
          }
          if (credentialConfigs[credentialToDisplay.metadata.schemaId]) {
            credentialToDisplay.credentialName =
              credentialConfigs[credentialToDisplay.metadata.schemaId].credentialName
          }
          obj = credentialToDisplay
          credentialsToDisplay.push(credentialToDisplay)
          newCredLabels.push([
            ...newCredLabels,
            credentialToDisplay.credentialName
              ? credentialToDisplay.credentialName
              : parseSchema(credentialToDisplay.metadata.schemaId),
          ])
        }

        if (!obj) {
          obj = credentialsToDisplay.find(
            (x) => x.credentialId === curr[1].credentialId,
          )
        }
        newArr.push({name: curr[0], value: formatDate(obj.attributes[curr[0]])})
      }
      setCredLabels(newCredLabels)
      setAttributes(newArr)
      setReqCredentials(credentialsToDisplay)
      console.log('Credentials to display:', credentialsToDisplay)
    }
  }

  useEffect(() => {
    listCredentials()
  }, [props.requestedCredentials])

  useEffect(() => {
    console.log('Attributes:', attributes)
  }, [attributes])

  useEffect(() => {
    console.log(props.contact)
  })
  return (
    <>
      <BackButton backPath={'/workflow/connect'} />
      <>
        <View style={[AppStyles.viewFull, AppStyles.altBg]}>
          <AppHeaderLarge alt={true} />
          <View
            style={[
              AppStyles.tab,
              AppStyles.grayLightBackground,
              Styles.tabView,
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textBold,
              ]}>
              Send to:
            </Text>
            <View style={AppStyles.tableItem}>
              <View>
                <Text
                  style={[
                    {fontSize: 18},
                    AppStyles.textPrimary,
                    AppStyles.textBold,
                  ]}>
                  {props.contact.name}
                </Text>
                <Text style={[{fontSize: 14}, AppStyles.textGray]}>
                  {props.contact.state && props.contact.city
                    ? props.contact.city + ', ' + props.contact.state
                    : null}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setViewInfo(props.contact)
                  setViewContact(true)
                }}>
                <Image
                  source={Images.infoBlue}
                  style={[AppStyles.info, {marginRight: 0, top: 10}]}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textBold,
              ]}>
              Data:
            </Text>
            <View style={AppStyles.tableItem}>
              <View>
                <Text
                  style={[
                    {fontSize: 18},
                    AppStyles.textPrimary,
                    AppStyles.textBold,
                  ]}>
                  Credentials:
                </Text>
                <Text style={[{fontSize: 14}, AppStyles.textGray]}>
                  {credLabels.join(', ')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setViewInfo(props.credential)
                  setViewCredential(true)
                }}>
                <Image
                  source={Images.infoBlue}
                  style={[AppStyles.info, {marginRight: 0, top: 10}]}
                />
              </TouchableOpacity>
            </View>
            <View style={Styles.buttonWrap}>
              <Text
                style={[
                  {fontSize: 18},
                  AppStyles.textPrimary,
                  AppStyles.textUpper,
                  AppStyles.textBold,
                  Styles.buttonText,
                ]}>
                Send Credentials
              </Text>
              <TouchableOpacity onPress={acceptPresentation}>
                <Image source={Images.send} style={Styles.buttonIcon} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{top: 60}}
              onPress={() => history.push('/home')}>
              <Text style={[{fontSize: 14}, AppStyles.textGray]}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
        {viewCredential ? (
          <CurrentRequest
            credential={viewInfo}
            attributes={attributes}
            setViewCredential={setViewCredential}
            title={'Credentials:'}
            credentials={credLabels.join(', ')}
          />
        ) : null}
        {viewContact ? (
          <CurrentContact contact={viewInfo} setViewContact={setViewContact} />
        ) : null}
      </>
    </>
  )
}

export default CredentialRequested
