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

import {parseSchema} from '../../../../utils'

import AppHeaderLarge from '../../../AppHeaderLarge/index.js'
import BackButton from '../../../BackButton/index.js'
import CurrentContact from '../../../CurrentContact/index.js'
import CurrentCredential from '../../../CurrentCredential/index.js'
import LoadingOverlay from '../../../LoadingOverlay/index.js'

import AgentContext from '../../../AgentProvider/'

import Images from '@assets/images'
import AppStyles from '@assets/styles'
import Styles from '../styles'

function CredentialOffered(props) {
  let history = useHistory()

  const agentContext = useContext(AgentContext)

  const [viewInfo, setViewInfo] = useState('')
  const [viewContact, setViewContact] = useState(false)
  const [viewCredential, setViewCredential] = useState(false)

  const acceptOffer = async () => {
    //Push to pending issuance screen
    history.push('/workflow/pending')

    console.log('Attempting to accept offer')
    await agentContext.agent.credentials.acceptOffer(props.credential.id)
  }

  const declineOffer = async () => {
    history.push('/home')
    console.log('Attempting to decline offer')
    await agentContext.agent.credentials.declineOffer(props.credential.id)
  }

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
              Credential from:
            </Text>
            <View style={AppStyles.tableItem}>
              <View>
                <Text
                  style={[
                    {fontSize: 20, top: 8},
                    AppStyles.textBlack,
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
            <View style={AppStyles.tableItem}>
              <View>
                <Text
                  style={[
                    {fontSize: 20, top: 8},
                    AppStyles.textBlack,
                    AppStyles.textBold,
                  ]}>
                  {/*Temporary hardcoding*/}
                  {props.credential.credentialName
                    ? props.credential.credentialName
                    : parseSchema(props.credential.metadata.schemaId)}
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
                Accept Credentials
              </Text>
              <TouchableOpacity
                onPress={() => {
                  acceptOffer()
                }}>
                <Image source={Images.receive} style={Styles.buttonIcon} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{top: 60}} onPress={declineOffer}>
              <Text style={[{fontSize: 14}, AppStyles.textGray]}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
        {viewCredential ? (
          <CurrentCredential
            credential={viewInfo}
            setViewCredential={setViewCredential}
          />
        ) : null}
        {viewContact ? (
          <CurrentContact contact={viewInfo} setViewContact={setViewContact} />
        ) : null}
      </>
    </>
  )
}

export default CredentialOffered
