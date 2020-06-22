import { Agent, InboundTransporter } from 'aries-framework'
import axios  from 'axios'

class PollingInboundTransporter implements InboundTransporter {
  public stop: boolean

  public constructor() {
    this.stop = false
  }
  public async start(agent: Agent) {
    await this.registerMediator(agent)
  }

  public async registerMediator(agent: Agent) {
    const mediatorUrl = agent.getMediatorUrl() || ''
    const mediatorInvitationUrl = await get(`${mediatorUrl}/invitation`)
    const { verkey: mediatorVerkey } = JSON.parse(await get(`${mediatorUrl}/`))
    console.log("verkey:", mediatorVerkey)
    await agent.routing.provision({
      verkey: mediatorVerkey,
      invitationUrl: mediatorInvitationUrl,
    })
    this.pollDownloadMessages(agent)
  }

  private pollDownloadMessages(agent: Agent) {
    setInterval(async()=>{
      if(!this.stop){
        await agent.routing.downloadMessages()
 
      }    
    }, 2000)
  }
}

export { PollingInboundTransporter }
export async function get(url: string) {
  console.log(`HTTP GET request: '${url}'`)
  const response = await axios.get(url)
  console.log(`HTTP GET response status: ${response.status} - ${response.statusText}`)
  return JSON.stringify(response.data)
}