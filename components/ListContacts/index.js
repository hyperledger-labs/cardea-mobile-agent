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

import AppHeaderLarge from '../AppHeaderLarge/index.js'
import BackButton from '../BackButton/index.js'
import CurrentContact from '../CurrentContact/index.js'

import {ErrorsContext} from '../Errors/index.js'

import AppStyles from '@assets/styles'
import Images from '@assets/images.js'
import Styles from './styles'
import AgentContext from '../AgentProvider/index.js'
import {getConnectionData} from '../../utils'

function ListContacts(props) {
  let history = useHistory()

  const [viewContact, setViewContact] = useState(false)
  const [contactInfo, setContactInfo] = useState('')
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    getContacts()
  }, [])

  const agentContext = useContext(AgentContext)

  const getContacts = async () => {
    let newContacts = await agentContext.agent.connections.getAll()
    newContacts = newContacts.filter((curr) => {
      return curr.state === 'complete' && curr.alias !== 'Mediator'
    })
    newContacts = newContacts.map((curr) => {
      return getConnectionData(curr)
    })
    setContacts(newContacts)
  }

  return (
    <>
      <BackButton backPath={'/home'} />
      <View style={[AppStyles.viewFull, AppStyles.altBg]}>
        <AppHeaderLarge alt={true} />
        <View style={[Styles.credView, AppStyles.whiteTab]}>
          <Text style={[AppStyles.h4, AppStyles.textBold, AppStyles.textUpper, AppStyles.textSecondary]}>Connected To:</Text>
          <ScrollView
            style={{width: '100%'}}
            contentContainerStyle={{width: '100%'}}>
            {contacts.map((contact, i) => (
              <View key={i} style={[AppStyles.tableItem, Styles.tableItem]}>
                <View>
                  <Text
                    style={[
                      {fontSize: 18},
                      AppStyles.textSecondary,
                      AppStyles.textBold,
                    ]}>
                    {contact.name ? contact.name : 'Contact'}
                  </Text>
                  <Text style={[{fontSize: 14}, AppStyles.textSecondary]}>
                    {contact.state && contact.city
                      ? contact.city + ', ' + contact.state
                      : null}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    console.log(contact.label)
                    setContactInfo(contact)
                    setViewContact(true)
                  }}>
                  <Image source={Images.infoBlue} style={AppStyles.info} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      {viewContact ? (
        <CurrentContact
          contact={contactInfo}
          setViewContact={setViewContact}
          altColor={true}
        />
      ) : null}
    </>
  )
}

export default ListContacts
