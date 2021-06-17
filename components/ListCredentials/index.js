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

import {getConnectionData, parseSchema} from '../../utils/'

import AppHeaderLarge from '../AppHeaderLarge/index.js'
import BackButton from '../BackButton/index.js'
import CurrentCredential from '../CurrentCredential/index.js'

import {ErrorsContext} from '../Errors/index.js'

import AppStyles from '@assets/styles'
import Images from '@assets/images.js'
import Styles from './styles'
import AgentContext from '../AgentProvider/index.js'
import {CredentialEventType} from 'aries-framework'
import credentialConfigs from '@configs/credentialConfigs.js'

function ListCredentials(props) {
  let history = useHistory()

  const agentContext = useContext(AgentContext)

  //Credentials list
  const [credentials, setCredentials] = useState([])
  const [viewCredential, setViewCredential] = useState(false)
  const [credentialInfo, setCredentialInfo] = useState('')

  //load credentials
  const getCredentials = async () => {
    const newCredentials = await agentContext.agent.credentials.getAll()
    let credentialsForDisplay = []
    for (const credential of newCredentials) {
      console.log('Credential:', credential)
      if (credential.state === 'done') {
        let credentialToDisplay = {
          ...(await agentContext.agent.credentials.getIndyCredential(
            credential.credentialId,
          )),
          connection: await getConnectionDataFromID(credential.connectionId),
          id: credential.id,
        }
        if (credentialConfigs[credentialToDisplay.schemaId]) {
          credentialToDisplay.credentialName =
            credentialConfigs[credentialToDisplay.schemaId].credentialName
        }
        credentialsForDisplay.push(credentialToDisplay)
      }
    }
    console.log('Credentials to display:', credentialsForDisplay)
    setCredentials(credentialsForDisplay)
  }

  //Get connection data for credential
  const getConnectionDataFromID = async (connectionID) => {
    const connection = await agentContext.agent.connections.find(connectionID)
    return getConnectionData(connection)
  }

  //Event listener
  const handleCredentialStateChange = async (event) => {
    console.info(
      `Credentials State Change, new state: "${event.credentialRecord.state}"`,
      event,
    )
    getCredentials()
  }
  //On component load
  useEffect(() => {
    if (!agentContext.loading) {
      getCredentials()
    }
  }, [agentContext.loading])

  //Event listener registration
  useEffect(() => {
    if (!agentContext.loading) {
      agentContext.agent.credentials.events.on(
        CredentialEventType.StateChanged,
        handleCredentialStateChange,
      )

      return function cleanup() {
        agentContext.agent.credentials.events.removeAllListeners(
          CredentialEventType.StateChanged,
        )
      }
    }
  }, [agentContext.loading])

  //Log credentialList changes
  useEffect(() => {
    console.log('Credential list:', credentials)
  }, [credentials])

  return (
    <>
      <BackButton backPath={'/home'} />
      <View style={[AppStyles.viewFull, AppStyles.altBg]}>
        <AppHeaderLarge alt={true} />
        <View style={[Styles.credView, AppStyles.whiteTab]}>
          <Text
            style={[
              AppStyles.h4,
              AppStyles.textBold,
              AppStyles.textUpper,
              AppStyles.textSecondary,
            ]}>
            Credentials:
          </Text>
          <ScrollView
            style={{width: '100%'}}
            contentContainerStyle={{width: '100%'}}>
            {credentials.map((credential, i) => (
              <View key={i} style={[AppStyles.tableItem, Styles.tableItem]}>
                <View>
                  <Text
                    style={[
                      {fontSize: 18},
                      AppStyles.textSecondary,
                      AppStyles.textUpper,
                    ]}>
                    {credential.credentialName
                      ? credential.credentialName
                      : parseSchema(credential.schemaId)}
                  </Text>
                  <Text style={[{fontSize: 14}, AppStyles.textSecondary]}>
                    {credential.connection.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    console.log(credential.label)
                    setCredentialInfo(credential)
                    setViewCredential(true)
                  }}>
                  <Image source={Images.infoBlue} style={AppStyles.info} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      {viewCredential ? (
        <CurrentCredential
          credential={credentialInfo}
          setViewCredential={setViewCredential}
          altColor={true}
        />
      ) : null}
    </>
  )
}

export default ListCredentials
