import React, {useState, useEffect, useContext} from 'react'

import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import {useHistory, useLocation} from 'react-router-native'

import AppHeaderLarge from '../AppHeaderLarge/index.js'
import BackButton from '../BackButton/index.js'
import LoadingOverlay from '../LoadingOverlay/index.js'
import PendingTasks from '../PendingTasks/index.js'

import {ErrorsContext} from '../Errors/index.js'
import {NotificationsContext} from '../Notifications/index.js'
import AgentContext from '../AgentProvider/'

import AppStyles from '@assets/styles'
import Images from '@assets/images'
import Styles from './styles'
import {getData} from '../../utils/storage'

function Home(props) {
  const ScreenHeight = Dimensions.get('window').height

  let history = useHistory()
  let location = useLocation()

  const errors = useContext(ErrorsContext)
  const notifications = useContext(NotificationsContext)

  const [tutorial, setTutorial] = useState(false)

  //Reference to the agent context
  const agentContext = useContext(AgentContext)

  const checkTutorial = async () => {
    let kc = await getData('home_tutorial')
    console.log('kc', kc)
    if (kc) {
      setTutorial(false)
    } else {
      setTutorial(true)
    }
  }

  //On load
  useEffect(() => {
    checkTutorial()
  }, [])

  const topTutorial = (
    <View style={Styles.containerContainer}>
      <View
        style={[
          Styles.tutorialContainer,
          AppStyles.grayLightBackground,
          {marginTop: 0},
        ]}>
        <Text style={[Styles.tutorialText]}>
          To begin, tap the{'\n'}
          CONNECT button{'\n'}
          <Text style={Styles.tutorialSmall}>
            Scan a QR code and send or receive your travel credentials
          </Text>
        </Text>
      </View>
    </View>
  )

  const bottomTutorial = (
    <View style={Styles.containerContainer}>
      <View style={[Styles.tutorialContainer, AppStyles.grayLightBackground]}>
        <Text style={[Styles.tutorialText]}>
          This is your to-do list!{'\n'}
          <Text style={Styles.tutorialSmall}>
            A title appears when you have a new or unresolved offer or request
            for your credentials.{'\n'}
            Tap the title to review and finish!
          </Text>
        </Text>
      </View>
    </View>
  )

  return (
    <ScrollView showsVerticalScrollIndicator>
      <BackButton backExit={true} />
      <View style={[AppStyles.viewFull, AppStyles.altBg]}>
        <AppHeaderLarge alt={true} />
        <View style={[AppStyles.tab, AppStyles.whiteTab]}>
          {tutorial ? (
            topTutorial
          ) : (
            <View style={{paddingTop: 0.146 * ScreenHeight}} />
          )}
          <TouchableOpacity
            style={[AppStyles.button, Styles.button]}
            onPress={() => {
              /*errors.setVisible(true)
            errors.setText("Workflows not\nyet created")
            errors.setPath("/home")*/
              history.push('/workflow/connect')
            }}>
            <Text
              style={[
                AppStyles.h2,
                AppStyles.textSecondary,
                AppStyles.textBold,
                AppStyles.textUpper,
              ]}>
              Connect
            </Text>
          </TouchableOpacity>
          {tutorial ? (
            bottomTutorial
          ) : (
            <View style={{paddingTop: 0.2 * ScreenHeight}} />
          )}
          <PendingTasks
            setConnection={props.setConnection}
            setCredential={props.setCredential}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default Home
