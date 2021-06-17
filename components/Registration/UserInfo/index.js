import React, {useState, useEffect} from 'react'
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {useHistory} from 'react-router-native'
import RNPickerSelect from 'react-native-picker-select'
import DatePicker from 'react-native-date-picker'
import AppHeaderLarge from '../../AppHeaderLarge/index.js'
import {trimObjectStrings} from '../../../utils/objects'
import LoadingOverlay from '../../LoadingOverlay/index.js'
import AppStyles from '@assets/styles'
import Images from '@assets/images'
import Styles from './styles'

function UserInfo(props) {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    gender: null,
    birthDate: null,
  })
  const [showPicker, setShowPicker] = useState(false)
  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const [birthDate, setBirthDate] = useState(createDate(26, true))

  // react-native-picker-select requires unique styling
  const pickerStyle = {
    inputAndroid: {
      width: '100%',
      height: 45,
      backgroundColor: '#ededed',
    },
  }

  useEffect(() => {
    // checks that something is entered for each field
    if (
      user.firstName.length > 2 &&
      user.lastName.length > 2 &&
      user.gender &&
      user.birthDate
    ) {
      setIsFilled(true)
    }
  }, [user])

  const createDate = (year, start) => {
    // function to generate new date from today with year offset
    let date = new Date()
    date.setFullYear(date.getFullYear() - year)
    // defaults to Jan 1 or Dec 31
    if (start) {
      date.setMonth(0)
      date.setDate(1)
    } else {
      date.setMonth(11)
      date.setDate(31)
    }
    return date
  }

  let firstName
  let lastName
  let textInput

  const confirmEntry = () => {
    setLoadingOverlayVisible(true)
    console.log('User Info Accepted')
    setLoadingOverlayVisible(false)
    props.setSetupData({...props.setupData, UserInfo: trimObjectStrings(user)})
    props.incrementScreen()
  }

  return (
    <>
      <TouchableWithoutFeedback
        style={{flexGrow: 1}}
        onPress={Keyboard.dismiss}>
        <View style={AppStyles.windowFull}>
          <AppHeaderLarge disabled={true} avoidKeyboard={true} />
          <View style={AppStyles.tab}>
            <View
              style={[
                AppStyles.flexView,
                AppStyles.barBlue,
                AppStyles.marginBottomMd,
              ]}>
              <Text
                style={[
                  AppStyles.h3,
                  AppStyles.textBlue,
                  AppStyles.textCenter,
                ]}>
                <Text style={AppStyles.textBold}>Visitor</Text> who is{' '}
                <Text style={AppStyles.textBold}>traveling</Text>
              </Text>
            </View>
            <View
              style={[
                AppStyles.flexView,
                AppStyles.sideMargin,
                AppStyles.marginBottomSm,
                AppStyles.spaceBetween,
              ]}>
              <Text
                style={[
                  AppStyles.h3,
                  AppStyles.textPrimary,
                  AppStyles.textUpper,
                  AppStyles.textLeft,
                  {flex: 1, top: 19},
                ]}>
                First Name
              </Text>
              <View style={AppStyles.labelContainer}>
                <TextInput
                  style={AppStyles.formLabel}
                  value={firstName}
                  onChangeText={(firstName) =>
                    setUser({...user, firstName: firstName})
                  }
                  onSubmitEditing={() => {
                    textInput.focus()
                  }}
                />
              </View>
            </View>
            <View
              style={[
                AppStyles.flexView,
                AppStyles.sideMargin,
                AppStyles.spaceBetween,
                AppStyles.marginBottomMd,
              ]}>
              <Text
                style={[
                  AppStyles.h3,
                  AppStyles.textPrimary,
                  AppStyles.textUpper,
                  AppStyles.textLeft,
                  {flex: 1, top: 19},
                ]}>
                Last Name
              </Text>
              <View style={AppStyles.labelContainer}>
                <TextInput
                  style={AppStyles.formLabel}
                  value={lastName}
                  onChangeText={(lastName) =>
                    setUser({...user, lastName: lastName})
                  }
                  ref={(input) => {
                    textInput = input
                  }}
                  onSubmitEditing={() => {
                    Keyboard.dismiss()
                  }}
                />
              </View>
            </View>
            <View
              style={[
                AppStyles.flexView,
                AppStyles.sideMargin,
                AppStyles.spaceBetween,
                AppStyles.marginBottomSm,
              ]}>
              <Text
                style={[
                  AppStyles.h3,
                  AppStyles.textPrimary,
                  AppStyles.textUpper,
                  AppStyles.textLeft,
                  {flex: 1, top: 8},
                ]}>
                Gender
              </Text>
              <View style={Styles.pickerView}>
                <RNPickerSelect
                  style={pickerStyle}
                  onValueChange={(value) => {
                    setUser({...user, gender: value})
                  }}
                  onOpen={() => Keyboard.dismiss()}
                  items={[
                    {label: 'Male', value: 'male'},
                    {label: 'Female', value: 'female'},
                  ]}
                />
              </View>
            </View>
            <View
              style={[
                AppStyles.flexView,
                AppStyles.sideMargin,
                AppStyles.spaceBetween,
                AppStyles.marginBottomMd,
              ]}>
              <Text
                style={[
                  AppStyles.h3,
                  AppStyles.textPrimary,
                  AppStyles.textUpper,
                  AppStyles.textLeft,
                  {flex: 1, top: 12},
                ]}>
                Date of{'\n'}Birth
              </Text>
              <TouchableOpacity
                style={Styles.picker}
                onPress={() => setShowPicker(true)}>
                {user.birthDate ? (
                  <Text style={[Styles.pickerText, AppStyles.textPrimary]}>
                    {user.birthDate.toString().slice(4, 15)}
                  </Text>
                ) : (
                  <Text style={Styles.pickerText}>Select a date...</Text>
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[AppStyles.button, AppStyles.flexView]}
              disabled={isFilled ? false : true}
              onPress={() => {
                Keyboard.dismiss()
                confirmEntry()
              }}>
              <Text
                style={[
                  AppStyles.h2,
                  AppStyles.textUpper,
                  isFilled ? AppStyles.textPrimary : {color: '#bbb'},
                ]}>
                Next
              </Text>
              <View style={{width: 46}}>
                {isFilled ? (
                  <Image source={Images.arrow} style={{marginLeft: 20}} />
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
          {loadingOverlayVisible ? <LoadingOverlay /> : null}
        </View>
      </TouchableWithoutFeedback>
      {showPicker ? (
        <TouchableOpacity
          style={Styles.opaqueScreen}
          onPress={() => {
            setShowPicker(false)
            setUser({...user, birthDate: birthDate})
          }}>
          <DatePicker
            date={birthDate}
            mode="date"
            onDateChange={(birthDate) => {
              setBirthDate(birthDate)
              //setUser({...user, birthDate: birthDate})
            }}
            style={[AppStyles.shadow, Styles.datePicker]}
            maximumDate={createDate(13, false)}
            minimumDate={createDate(110, true)}
          />
          <TouchableOpacity
            style={[
              AppStyles.button,
              AppStyles.confirmBackground,
              AppStyles.shadow,
              Styles.confirmButton,
            ]}
            onPress={() => {
              setShowPicker(false)
              setUser({...user, birthDate: birthDate})
            }}>
            <Text style={[AppStyles.h2, AppStyles.textWhite]}>Confirm</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : null}
    </>
  )
}

export default UserInfo
