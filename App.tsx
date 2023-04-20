import {
  Agent,
  AutoAcceptCredential,
  ConsoleLogger,
  HttpOutboundTransport,
  LogLevel,
  MediatorPickupStrategy,
  WsOutboundTransport,
} from '@aries-framework/core'
import AgentProvider from '@aries-framework/react-hooks'
import { agentDependencies } from '@aries-framework/react-native'
import { default as React, useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import Config from 'react-native-config'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'

import toastConfig from './App/components/toast/ToastConfig'
import { initStoredLanguage } from './App/localization'
import RootStack from './App/navigators/RootStack'
import StoreProvider from './App/store/Store'
import { Colors } from './App/theme'
import indyLedgers from './configs/ledgers/indy'
console.disableYellowBox = true

const App = () => {
  const [agent, setAgent] = useState<Agent | undefined>(undefined)

  initStoredLanguage()

  const initAgent = async () => {
    const newAgent = new Agent(
      {
        label: 'Cardea Holder',
        mediatorConnectionsInvite: Config.MEDIATOR_URL,
        mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
        walletConfig: { id: 'wallet4', key: '123' },
        autoAcceptConnections: true,
        autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
        logger: new ConsoleLogger(LogLevel.trace),
        indyLedgers,
      },
      agentDependencies
    )

    const wsTransport = new WsOutboundTransport()
    const httpTransport = new HttpOutboundTransport()

    newAgent.registerOutboundTransport(wsTransport)
    newAgent.registerOutboundTransport(httpTransport)

    await newAgent.initialize()
    setAgent(newAgent)
  }

  useEffect(() => {
    // Hide the native splash / loading screen so that our
    // RN version can be displayed.
    SplashScreen.hide()
    initAgent()
  }, [])

  return (
    <StoreProvider>
      <AgentProvider agent={agent}>
        <StatusBar barStyle="light-content" hidden={false} backgroundColor={Colors.primary} translucent={false} />
        <RootStack />
        <Toast topOffset={15} config={toastConfig} />
      </AgentProvider>
    </StoreProvider>
  )
}

export default App
