import React, {useState, useEffect, useRef} from 'react'

import {
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
import AppHeaderLarge from '../../../AppHeaderLarge/index.js'
import LoadingOverlay from '../../../LoadingOverlay/index.js'
import NextButton from '../../NextButton/index.js'
import AppStyles from '@assets/styles'
import Styles from './styles'

function UserInfo(props) {
  let history = useHistory()
  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
  const [birthDate, setBirthDate] = useState()
  const [showPicker, setShowPicker] = useState(false)
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: null,
  })

  //Next button mechanisms
  const [nextButtonActive, setNextButtonActive] = useState(false)

  const proceedCall = () => {
    //Component pre-continue checks
    Keyboard.dismiss()
    setLoadingOverlayVisible(true)

    console.log('User Info Accepted')
    console.log('birthDate:', birthDate)
    setUser({...user, birthDate: birthDate})

    let bDay = birthDate.getDate().toString(),
      bMonth = (birthDate.getMonth() + 1).toString(),
      bYear = birthDate.getFullYear().toString()
    if (bDay.length < 2) bDay = `0${bDay}`
    if (bMonth.length < 2) bMonth = `0${bMonth}`

    props.setPassportData({
      ...props.passportData,
      dob: {
        day: +bDay, //DD
        month: +bMonth, //MM
        original: +`${bYear.slice(-2)}${bMonth}${bDay}`, //YYMMDD
        year: +bYear, //YYYY
      },
      names: {
        lastName: user.lastName.trim(),
        names: user.firstName.trim().split(' '),
      },
      sex: {
        full: user.gender,
        abbr: user.gender.charAt(0),
      },
    })
    setLoadingOverlayVisible(false)
    history.push(`/setup-wizard/passportInfo`)
  }

  //Auto population
  useEffect(() => {
    console.log('passportData:', props.passportData)
    const newUser = {...user}
    if (typeof props.passportData.names !== 'undefined') {
      if (props.passportData.names.names) {
        newUser.firstName = props.passportData.names.names.join(' ')
      }
      if (props.passportData.names.lastName) {
        newUser.lastName = props.passportData.names.lastName
      }
      if (props.passportData.sex.full) {
        newUser.gender = props.passportData.sex.full
      }
    }
    console.log('newUser:', newUser)
    setUser(newUser)
    setBirthDate(getBirthDate(newUser))
  }, [])

  useEffect(() => {
    console.log('User:', user)
    // checks that something is entered for each field
    if (
      user.firstName.length > 2 &&
      user.lastName.length > 2 &&
      user.gender &&
      user.birthDate
    ) {
      setNextButtonActive(true)
    } else {
      setNextButtonActive(false)
    }
  }, [user])

  const createDate = (year) => {
    // function to generate new date from today with year offset
    let date = new Date()
    date.setFullYear(date.getFullYear() - year)
    return date
  }

  const getBirthDate = (newUser) => {
    let date = new Date()
    console.log('passportData:', props.passportData)
    if (typeof props.passportData.names !== 'undefined') {
      if (props.passportData.dob.year) {
        date.setFullYear(props.passportData.dob.year)
        date.setMonth(props.passportData.dob.month - 1)
        date.setDate(props.passportData.dob.day)
      }
    } else {
      date = createDate(30)
    }
    setUser({...newUser, birthDate: date})
    return date
  }

  let textInput

  return (
    <>
      <View
        style={{flex: 1, display: 'flex', flexDirection: 'column'}}
        onLayout={(event) => {
          var {x, y, width, height} = event.nativeEvent.layout
          console.log('PassportUserInfo:', height)
        }}>
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
              <Text style={AppStyles.textBold}>Visitor's Passport</Text>
            </Text>
          </View>
          <View
            style={[
              AppStyles.flexView,
              AppStyles.alignEnd,
              AppStyles.sideMargin,
              AppStyles.marginBottomSm,
              AppStyles.spaceBetween,
              {flex: 1},
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textLeft,
                {flex: 1},
              ]}>
              Given Names
            </Text>
            <View style={AppStyles.labelContainer}>
              <TextInput
                style={AppStyles.formLabel}
                value={user.firstName}
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
              AppStyles.alignEnd,
              AppStyles.sideMargin,
              AppStyles.spaceBetween,
              AppStyles.marginBottomMd,
              {flex: 1},
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textLeft,
                {flex: 1},
              ]}>
              Surname
            </Text>
            <View style={AppStyles.labelContainer}>
              <TextInput
                style={AppStyles.formLabel}
                value={user.lastName}
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
              AppStyles.alignEnd,
              AppStyles.sideMargin,
              AppStyles.spaceBetween,
              AppStyles.marginBottomSm,
              {flex: 1},
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textLeft,
                {flex: 1},
              ]}>
              Gender
            </Text>
            <View style={{width: '58%', height: 46}}>
              <RNPickerSelect
                style={Styles}
                onValueChange={(value) => {
                  setUser({...user, gender: value})
                }}
                // useNativeAndroidPickerStyle={false}
                placeholder={{label: 'Select...', value: null}}
                onOpen={() => Keyboard.dismiss()}
                items={[
                  {label: 'Male', value: 'Male'},
                  {label: 'Female', value: 'Female'},
                ]}
              />
            </View>
          </View>
          <View
            style={[
              AppStyles.flexView,
              AppStyles.alignEnd,
              AppStyles.sideMargin,
              AppStyles.spaceBetween,
              AppStyles.marginBottomMd,
              {flex: 1},
            ]}>
            <Text
              style={[
                AppStyles.h3,
                AppStyles.textPrimary,
                AppStyles.textUpper,
                AppStyles.textLeft,
                {flex: 1},
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
          <NextButton active={nextButtonActive} continue={proceedCall} />
        </View>
        {loadingOverlayVisible ? <LoadingOverlay /> : null}
      </View>
      {showPicker ? (
        <TouchableOpacity
          style={Styles.opaqueScreen}
          onPress={() => {
            setShowPicker(false)
          }}>
          <DatePicker
            date={birthDate}
            mode="date"
            onDateChange={(birthDate) => {
              setBirthDate(birthDate)
              setUser({...user, birthDate: birthDate})
            }}
            style={Styles.datePicker}
            maximumDate={createDate(18)}
            minimumDate={createDate(110)}
          />
        </TouchableOpacity>
      ) : null}
    </>
  )
}

export default UserInfo
