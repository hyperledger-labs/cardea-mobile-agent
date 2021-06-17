import React, {useState, useEffect} from 'react'

import {
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import {useHistory} from 'react-router-native'
import AppHeaderLarge from '../../AppHeaderLarge/index.js'
import LoadingOverlay from '../../LoadingOverlay/index.js'
import NextButton from '../NextButton/index.js'
import AppStyles from '@assets/styles'
import Autocomplete from './Autocomplete'
import axios from 'axios'
import {trimObjectStrings} from '../../../utils/objects'

function AddressInfo(props) {
  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
  const [address, setAddress] = useState({
    street: '',
    state: '',
    country: '',
  })
  const [formError, setFormError] = useState({
    street: false,
    state: false,
    country: false,
  })
  const [streets, setStreets] = useState([])
  const [streetValid, setStreetValid] = useState(false)
  const [showAuto, setShowAuto] = useState(false)
  const [streetError, setStreetError] = useState(false)
  const [street, setStreet] = useState('')

  //Next button mechanisms
  const [nextButtonActive, setNextButtonActive] = useState(false)

  const proceedCall = () => {
    setLoadingOverlayVisible(true)
    console.log('Address Entered')
    props.setSetupData({
      ...props.setupData,
      AddressInfo: trimObjectStrings(address),
    })
    props.incrementScreen()
  }

  //Get list of streets
  const getStreet = async (query) => {
    if (query.length > 2) {
      console.log(
        `https://tourist.dvgapp.org/street-names?streetName_contains=${query.toLowerCase()}&_limit=10`,
      )
      axios
        .get(
          `https://tourist.dvgapp.org/street-names?streetName_contains=${query.toLowerCase()}&_limit=10`,
        )
        .then((res) => {
          console.log('Street name results:', res.data)
          setStreets(res.data)
        })
    } else {
      setStreets([])
    }
  }

  //Validate street selection
  const checkStreet = async (street) => {
    axios
      .get(`https://tourist.dvgapp.org/street-names?streetName=${street}`)
      .then((res) => {
        console.log('Check street:', res.data.length > 0)
        setStreetValid(res.data.length > 0)
        if (res.data.length > 0) {
          setStreetError(false)
        } else {
          setStreetError(true)
        }
      })
  }

  //Check street valid
  useEffect(() => {
    checkStreet(street)
    setAddress({...address, street: street})
  }, [street])

  useEffect(() => {
    if (
      streetValid &&
      address.state.length > 1 &&
      address.country.length > 2 &&
      !formError.state &&
      !formError.country
    ) {
      setNextButtonActive(true)
    } else {
      setNextButtonActive(false)
    }
  }, [address, formError])

  //empty variables for text input
  let state
  let country

  // empty variables to shift focus to next text input
  let secondTextInput

  return (
    <TouchableWithoutFeedback style={{flexGrow: 1}} onPress={Keyboard.dismiss}>
      <View style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        <AppHeaderLarge disabled={true} avoidKeyboard={true} />
        <View style={AppStyles.tab}>
          <View
            style={[
              AppStyles.flexView,
              AppStyles.barBlue,
              AppStyles.marginBottomMd,
            ]}>
            <Text
              style={[AppStyles.h3, AppStyles.textBlue, AppStyles.textCenter]}>
              <Text style={AppStyles.textBold}>Visitor</Text> who is{' '}
              <Text style={AppStyles.textBold}>traveling</Text>
            </Text>
          </View>
          <View
            style={[
              AppStyles.flexView,
              AppStyles.sideMargin,
              AppStyles.spaceBetween,
              AppStyles.marginBottomSm,
              {flex: 1},
              Platform.OS === 'ios' ? {zIndex: 10} : null,
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textLeft,
                {flex: 1, top: 10},
              ]}>
              Street{'\n'}Name*
            </Text>
            <View
              style={[
                AppStyles.labelContainer,
                {
                  flex: 1,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  zIndex: 1,
                  padding: 0,
                  borderWidth: 0,
                },
              ]}>
              <Autocomplete
                inputContainerStyle={[
                  AppStyles.formLabel,
                  {
                    borderWidth: 0,
                    // backgroundColor: 'pink'
                  },
                ]}
                backgroundColor={'#F9FCF8'}
                listContainerStyle={{maxHeight: 150, padding: 0}}
                listStyle={{margin: 0}}
                data={streets}
                value={street}
                onChangeText={(newStreet) => {
                  setStreet(newStreet)
                  getStreet(newStreet)
                  setShowAuto(true)
                }}
                onEndEditing={() => setShowAuto(false)}
                hideResults={!showAuto}
                flatListProps={{
                  renderItem: ({item}) => (
                    <TouchableOpacity
                      onPress={() => {
                        setStreet(item.streetName)
                        setStreetValid(true)
                        setShowAuto(false)
                      }}>
                      <Text style={{borderColor: 'black', borderWidth: 0.5}}>
                        {item.streetName}
                      </Text>
                    </TouchableOpacity>
                  ),
                  keyboardShouldPersistTaps: 'always',
                }}
              />
              <View
                style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                {streetError && !showAuto ? (
                  <Text
                    style={[
                      AppStyles.textSmall,
                      AppStyles.textError,
                      {flex: 1},
                    ]}>
                    Invalid Street
                  </Text>
                ) : (
                  <View style={AppStyles.formSpace} />
                )}
              </View>
            </View>
          </View>
          <View
            style={[
              AppStyles.flexView,
              AppStyles.sideMargin,
              AppStyles.spaceBetween,
              AppStyles.marginBottomMd,
              {flex: 1},
              Platform.OS === 'ios' ? {zIndex: 1} : null,
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textLeft,
                {flex: 1, top: 10},
              ]}>
              State of{'\n'}Residency
            </Text>
            <View style={AppStyles.labelContainer}>
              <TextInput
                style={[
                  AppStyles.formLabel,
                  formError.state ? AppStyles.errorForm : null,
                ]}
                value={state}
                keyboardType="default"
                onChangeText={(state) => setAddress({...address, state: state})}
                ref={(input) => {
                  textInput = input
                }}
                onSubmitEditing={() => {
                  secondTextInput.focus()
                }}
                onBlur={() => {
                  // Check that state is valid
                  if (/^[a-z]+$/i.test(address.state.trim())) {
                    // valid state
                    setFormError({...formError, state: false})
                  } else {
                    // invalid state
                    setFormError({...formError, state: true})
                  }
                }}
              />
              {formError.state ? (
                <Text style={[AppStyles.textSmall, AppStyles.textError]}>
                  Not a valid state name
                </Text>
              ) : (
                <View style={AppStyles.formSpace} />
              )}
            </View>
          </View>
          <View
            style={[
              AppStyles.flexView,
              AppStyles.sideMargin,
              AppStyles.spaceBetween,
              AppStyles.marginBottomMd,
              {flex: 1},
              Platform.OS === 'ios' ? {zIndex: 1} : null,
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textLeft,
                {flex: 1, top: 12},
              ]}>
              Country of{'\n'}Residency
            </Text>
            <View style={AppStyles.labelContainer}>
              <TextInput
                style={[
                  AppStyles.formLabel,
                  formError.country ? AppStyles.errorForm : null,
                ]}
                value={country}
                keyboardType="default"
                onChangeText={(country) =>
                  setAddress({...address, country: country})
                }
                ref={(input) => {
                  secondTextInput = input
                }}
                onBlur={() => {
                  // Check that country is valid
                  if (/^[a-z]+$/i.test(address.country.trim())) {
                    // valid country
                    setFormError({...formError, country: false})
                  } else {
                    // invalid country
                    setFormError({...formError, country: true})
                  }
                }}
              />
              {formError.country ? (
                <Text style={[AppStyles.textSmall, AppStyles.textError]}>
                  Not a valid country name
                </Text>
              ) : (
                <View style={AppStyles.formSpace} />
              )}
            </View>
          </View>
          <NextButton active={nextButtonActive} continue={proceedCall} />
        </View>
        {loadingOverlayVisible ? <LoadingOverlay /> : null}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default AddressInfo
