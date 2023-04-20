import {CredentialState, ProofState} from '@aries-framework/core'
import {
  useCredentialByState,
  useProofByState,
} from '@aries-framework/react-hooks'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {FlatList, StyleSheet, View} from 'react-native'

import {Colors} from '../theme'

import {
  ModularView,
  NotificationCredentialListItem,
  NotificationProofListItem,
  Text,
} from 'components'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    height: '100%',
  },
})

const Home: React.FC = () => {
  const credentials = useCredentialByState(CredentialState.OfferReceived)
  const proofs = useProofByState(ProofState.RequestReceived)
  const {t} = useTranslation()

  return (
    <View style={styles.container}>
      <ModularView
        title={t('Home.Notifications')}
        content={
          <FlatList
            data={[...credentials, ...proofs]}
            keyExtractor={(item) => item.id}
            renderItem={({item}) =>
              item.type === 'CredentialRecord' ? (
                <NotificationCredentialListItem notification={item} />
              ) : (
                <NotificationProofListItem notification={item} />
              )
            }
            ListEmptyComponent={<Text>{t('Home.NoNewUpdates')}</Text>}
          />
        }
      />
    </View>
  )
}

export default Home
