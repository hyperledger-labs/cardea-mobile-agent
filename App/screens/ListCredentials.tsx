import type { CredentialRecord } from '@aries-framework/core'

import { useCredentials } from '@aries-framework/react-hooks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'

import { Colors } from '../theme'

import { CredentialListItem, Text } from 'components'

const ListCredentials: React.FC = () => {
  const { credentials } = useCredentials()
  const { t } = useTranslation()

  const emptyListComponent = () => <Text style={{ textAlign: 'center', marginTop: 100 }}>{t('Global.NoneYet!')}</Text>

  const keyForItem = (item: CredentialRecord) => String(item.credentialId)

  return (
    <FlatList
      data={credentials.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())}
      style={{ backgroundColor: Colors.background }}
      keyExtractor={keyForItem}
      ListEmptyComponent={emptyListComponent}
      renderItem={({ item }) => <CredentialListItem credential={item} />}
    />
  )
}

export default ListCredentials
