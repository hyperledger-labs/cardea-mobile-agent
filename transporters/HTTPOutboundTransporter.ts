/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { OutboundTransporter, Agent, OutboundPackage } from '@aries-framework/core'
import axios from 'axios'

class HttpOutboundTransporter implements OutboundTransporter {
  private agent: Agent

  public constructor(agent: Agent) {
    this.agent = agent
  }
  public async sendMessage(outboundPackage: OutboundPackage, receiveReply: boolean) {
    const { payload, endpoint } = outboundPackage

    if (!endpoint) {
      throw new Error(`Missing endpoint. I don't know how and where to send the message.`)
    }

    console.log(`Sending outbound message to connection ${outboundPackage.connection.id}`, outboundPackage.payload)

    if (receiveReply) {
      const response = await post(`${endpoint}`, JSON.stringify(payload))
      if (response) {
        console.log(`Response received:\n ${response}`)
        const wireMessage = JSON.parse(response)
        this.agent.receiveMessage(wireMessage)
      } else {
        console.log(`No response received.`)
      }
    } else {
      await post(`${endpoint}`, JSON.stringify(payload))
    }
  }
}

export {HttpOutboundTransporter}
export async function post(url: string, body: string) {
  console.log(`HTTP POST request: '${url},`)
  const response = await axios.post(url,
    body, 
    {
      headers: {'content-type': 'application/ssi-agent-wire'}
    }
  )
  console.log(`HTTP POST response status: ${response.status} - ${response.statusText}`)
  return JSON.stringify(response.data)
}