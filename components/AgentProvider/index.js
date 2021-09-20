import React, {useState, useEffect} from 'react'
import Config from 'react-native-config'

import {downloadGenesis, storeGenesis} from '../../genesis-utils'
import {
  HttpOutboundTransporter,
  PollingInboundTransporter,
} from '../../transporters'

import indy from 'indy-sdk-react-native'
import {
  Agent,
  ConnectionEventType,
  BasicMessageEventType,
  CredentialEventType,
  CredentialState,
  ConsoleLogger,
  LogLevel,
} from '@aries-framework/core'
import {agentDependencies} from '@aries-framework/react-native'
import {getData, storeData} from '../../utils/storage'
console.disableYellowBox = true

const AgentContext = React.createContext({})

function AgentProvider(props) {
  const [agent, setAgent] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAgent = async () => {
      let agentConfig = {
        mediatorUrl: Config.MEDIATOR_URL,
        genesisUrl: Config.GENESIS_URL,
      }

      console.info('Initializing Agent', agentConfig)

      let genesisPath = agentConfig.genesisPath
      const genesis = await downloadGenesis(agentConfig.genesisUrl)
      genesisPath = await storeGenesis(genesis, 'genesis.txn')

      agentConfig = {
        label: 'Cardea Holder',
        walletConfig: {id: 'wallet4'},
        walletCredentials: {key: '123'},
        autoAcceptConnections: true,
        poolName: 'test-183',
        ...agentConfig,
        genesisPath,
        logger: new ConsoleLogger(LogLevel.debug),
        indy,
      }

      const newAgent = new Agent(agentConfig, agentDependencies)
      const inbound = new PollingInboundTransporter()
      const outbound = new HttpOutboundTransporter(newAgent)
      newAgent.setInboundTransporter(inbound)
      newAgent.setOutboundTransporter(outbound)

      await newAgent.init()

      setAgent(newAgent)
      setLoading(false)

      console.info('Agent has been initialized')

      const handleBasicMessageReceive = (event) => {
        console.log(
          `New Basic Message with verkey ${event.verkey}:`,
          event.message,
        )
      }
      newAgent.basicMessages.events.on(
        BasicMessageEventType.MessageReceived,
        handleBasicMessageReceive,
      )

      const handleConnectionStateChange = (event) => {
        console.log(
          `connection event for: ${event.connectionRecord.id}, previous state -> ${event.previousState} new state: ${event.connectionRecord.state}`,
        )
      }
      newAgent.connections.events.on(
        ConnectionEventType.StateChanged,
        handleConnectionStateChange,
      )

      console.log('connections:', await newAgent.connections.getAll())
    }

    initAgent()
  }, [])

  return (
    <AgentContext.Provider
      value={{
        agent,
        loading,
      }}>
      {props.children}
    </AgentContext.Provider>
  )
}

export default AgentContext
export {AgentProvider}
