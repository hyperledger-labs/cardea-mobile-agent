import type { CredentialRecord } from '@aries-framework/core'

import { useConnectionById } from '@aries-framework/react-hooks'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { Colors, borderRadius, TextTheme, CredentialOfferTheme } from '../../theme'
import { parseSchema } from '../../utils/helpers'
import Text from '../texts/Text'

import { HomeStackParams } from 'types/navigators'

interface Props {
  notification: CredentialRecord
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingVertical: 10,
    paddingLeft: 10,
    borderRadius,
    backgroundColor: CredentialOfferTheme.background,
  },
})

const NotificationCredentialListItem: React.FC<Props> = ({ notification }) => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParams>>()

  const { metadata, connectionId, id } = notification

  const connection = useConnectionById(connectionId)

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Credential Offer', { credentialId: id })}
    >
      <View>
        <Text style={TextTheme.headingFour}>{parseSchema(metadata?.schemaId)}</Text>
        <Text style={TextTheme.normal}>{connection?.alias || connection?.invitation?.label}</Text>
      </View>
      <Icon name="chevron-right" color={Colors.text} size={30} />
    </TouchableOpacity>
  )
}

export default NotificationCredentialListItem
