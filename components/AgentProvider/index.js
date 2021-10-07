import React, {useState, useEffect} from 'react'
import Config from 'react-native-config'

import {downloadGenesis, storeGenesis} from '../../genesis-utils'

import indy from 'indy-sdk-react-native'
import {
  Agent,
  AutoAcceptCredential,
  ConnectionEventTypes,
  BasicMessageEventTypes,
  CredentialEventTypes,
  CredentialState,
  ConsoleLogger,
  LogLevel,
  WsOutboundTransport,
  MediatorPickupStrategy,
  HttpOutboundTransport,
} from '@aries-framework/core'
import {agentDependencies} from '@aries-framework/react-native'
import {getData, storeData} from '../../utils/storage'

const AgentContext = React.createContext({})

function AgentProvider(props) {
  const [agent, setAgent] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const asyncInit = async () => {
      try {
        await initAgent()
      } catch (err) {
        console.log(err)
      }
    }

    asyncInit()
  }, [])

  const initAgent = async () => {
    let agentConfig = {
      mediatorConnectionsInvite: Config.MEDIATOR_INVITE_URL,
      genesisUrl: Config.GENESIS_URL,
    }

    console.info('Initializing Agent', agentConfig)

    let genesisPath = agentConfig.genesisPath
    const genesis = await downloadGenesis(agentConfig.genesisUrl)
    genesisPath = await storeGenesis(genesis, 'genesis.txn')

    agentConfig = {
      label: 'Cardea Holder',
      walletConfig: {id: 'wallet4', key: '123'},
      autoAcceptConnections: true,
      autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
      poolName: 'test-183',
      genesisPath,
      logger: new ConsoleLogger(LogLevel.trace),
      mediatorConnectionsInvite: Config.MEDIATOR_INVITE_URL,
      mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
    }

    const newAgent = new Agent(agentConfig, agentDependencies)
    const wsTransport = new WsOutboundTransport()
    newAgent.registerOutboundTransport(wsTransport, 0)

    let outbound = new HttpOutboundTransport()
    newAgent.registerOutboundTransport(outbound, 1)

    await newAgent.initialize()

    setAgent(newAgent)
    setLoading(false)

    console.info('Agent has been initialized')

    const handleBasicMessageReceive = (event) => {
      console.log(
        `New Basic Message with verkey ${event.payload.verkey}:`,
        event.payload.message,
      )
    }
    newAgent.events.on(
      BasicMessageEventTypes.BasicMessageReceived,
      handleBasicMessageReceive,
    )

    const handleConnectionStateChange = (event) => {
      console.log(
        `connection event for: ${event.payload.connectionRecord.id}, previous state -> ${event.payload.previousState} new state: ${event.payload.connectionRecord.state}`,
      )
    }
    newAgent.events.on(
      ConnectionEventTypes.StateChanged,
      handleConnectionStateChange,
    )

    console.log('connections:', await newAgent.connections.getAll())
  }

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
