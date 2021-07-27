/**
 * Cardea Mobile App - Holder
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react'
import {View} from 'react-native'
import {Redirect, Route} from 'react-router-native'

import 'react-native-get-random-values'
import '@azure/core-asynciterator-polyfill'

import * as Keychain from 'react-native-keychain'
import AsyncStorage from '@react-native-community/async-storage'
import 'react-native-get-random-values'
import {AgentProvider} from './components/AgentProvider/'
import Errors from './components/Errors/index.js'
import Notifications from './components/Notifications/index.js'
import AddressInfo from './components/Registration/AddressInfo/index.js'
import Confirmed from './components/Registration/Confirmed/index.js'
import ConnectNow from './components/Registration/ConnectNow/index.js'
import ContactInfo from './components/Registration/ContactInfo/index.js'
import EntryPoint from './components/EntryPoint/index.js'
import Home from './components/Home/index.js'
import ListContacts from './components/ListContacts/index.js'
import ListCredentials from './components/ListCredentials/index.js'
import Navbar from './components/Navbar/index.js'
import PinCreate from './components/Registration/PinCreate/index.js'
import PinEnter from './components/PinEnter/index.js'
import Settings from './components/Settings/index.js'
import SetupWizard from './components/Registration/SetupWizard/index.js'
import StartScreen from './components/StartScreen/index.js'
import Terms from './components/Registration/Terms/index.js'
import Workflow from './components/Workflow/index.js'
import Passport from './components/Registration/Passport/index.js'
import {PrivacyPolicy} from '@configs/policyConfigs'
import PassportDirections from './components/Registration/PassportDirections'
import AppStyles from '@assets/styles'

const App = (props) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [connection, setConnection] = useState(undefined)
  const [credential, setCredential] = useState(undefined)

  useEffect(() => {
    const clearKeychain = async () => {
      try {
        const value = await AsyncStorage.getItem('firstLaunch')
        if (value == null) {
          // Detecting a first time launch, resetting keychain
          console.log('First launch. Clearing keychain.')
          let resetArray = [
            'passcode',
            'setupWizard',
            'governmentConnectionId',
            'demographicData',
            'passportData',
            'trustedTraveler',
          ]
          const resetVal = async (val) => {
            await Keychain.resetGenericPassword({service: val})
          }
          resetArray.forEach((val) => resetVal(val))
          await AsyncStorage.setItem('firstLaunch', 'false')
        }
      } catch (e) {
        console.warn(e)
      }
    }
    clearKeychain()
  }, [])

  /*
    /
    /home
    /start
    /pin-entry
    /pin-create
    /scan
    /workflow
    /settings
  */

  return (
    <View style={{flex: 1}}>
      <AgentProvider>
        <Errors>
          <Notifications>
            <View style={{flex: 1}}>
              <Route
                exact
                path="/"
                render={() => {
                  return <EntryPoint authenticated={authenticated} />
                }}
              />
              <Route
                exact
                path="/home"
                render={() =>
                  authenticated ? (
                    <Home
                      connection={connection}
                      setConnection={setConnection}
                      credential={credential}
                      setCredential={setCredential}
                    />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                exact
                path="/settings"
                render={() =>
                  authenticated ? <Settings /> : <Redirect to="/" />
                }
              />
              <Route
                exact
                path="/contacts"
                render={() =>
                  authenticated ? <ListContacts /> : <Redirect to="/" />
                }
              />
              <Route
                exact
                path="/credentials"
                render={() =>
                  authenticated ? <ListCredentials /> : <Redirect to="/" />
                }
              />
              <Route
                path="/workflow"
                render={() => (
                  <Workflow
                    connection={connection}
                    setConnection={setConnection}
                    credential={credential}
                    setCredential={setCredential}
                    authenticated={authenticated}
                  />
                )}
              />
              <Route
                exact
                path="/pin/enter"
                render={() => <PinEnter setAuthenticated={setAuthenticated} />}
              />
              <Route exact path="/start" render={() => <StartScreen />} />
              <Route
                path="/setup-wizard"
                render={() => (
                  <SetupWizard setAuthenticated={setAuthenticated}>
                    <Terms
                      title={PrivacyPolicy.title}
                      message={PrivacyPolicy.text}
                    />
                    <PinCreate />
                    <PassportDirections />
                    <Passport />
                    <ContactInfo />
                    <AddressInfo />
                    <ConnectNow />
                    <Confirmed />
                  </SetupWizard>
                )}
              />
            </View>
            {authenticated ? (
              <View style={{height: '10.5%'}}>
                <Navbar />
              </View>
            ) : null}
          </Notifications>
        </Errors>
      </AgentProvider>
    </View>
  )
}

export default App
