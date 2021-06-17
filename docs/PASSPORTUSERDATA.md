# Passport and User Data format

```js
{
"AddressInfo": {
    "country": "USA ", 
    "state": "UT", 
    "street": "Iajahqjq"
},
"ContactInfo": {
    "email": "Jhahajanw@jsjsna.com", 
    "phone": "6494843464"
}, 
"PassportData": {
    "checkDigit": {
        "dob": [Object], 
        "documentNumber": [Object], 
        "expiry": [Object], 
        "finalCheck": [Object], 
        "personalNumber": [Object], 
        "valid": true
    }, 
    "dob": {
        "day": "17", 
        "month": "01", 
        "original": "640117", 
        "year": "1964"
    }, 
    "documentCode": "P", 
    "documentNumber": "910239248", 
    "documentType": "PASSPORT", 
    "documentTypeCode": null, 
    "expiry": {
        "day": "05", 
        "month": "12", 
        "original": "181205", 
        "year": "2018"
    }, 
    "issuer": "USA", 
    "names": {
        "lastName": "OBAMA", 
        "names": [Array]
    }, 
    "nationality": {
        "abbr": "USA", 
        "full": "United States of America"
    }, 
    "personalNumber": "900781200 1296", 
    "sex": {
        "abbr": "F", 
        "full": "Female"
    }
}, 
"UserInfo": {
    "birthDate": 1992-01-01T18:34:00.000Z, 
    "firstName": "Hshshs", 
    "gender": "male", 
    "lastName": "Hahahqj "
}
}
```


### Expected:

```js
{
    "contact_id": "1",
    "email": "john.doe@email.com",
    "phone": "1-222-345-5467",
    "address": {
        "address_1": "1234 Lane St.",
        "address_2": "",
        "city": "Rexburg",
        "state": "Idaho",
        "zip_code": "83440",
        "country": "United States"
    }
}, 
```

```js
{
    "contact_id": "44",
    "passport_number": "31195855",
    "surname": "Doe",
    "given_names": "John M.",
    "sex":"M",
    "date_of_birth": "22 Jan 1974",
    "place_of_birth":"Kansas City, Kansas",
    "nationality":"United States of America",
    "date_of_issue": "18 Sep 2005",
    "date_of_expiration":"17 Sep 2014",
    "type": "P",
    "code": "USA",
    "authority": "United States Department of State",
    "photo": "data:image/png;base64,R0lGODlhDAAMAKIFAF5LAP/zxAAAANyuAP/gaP///wAAAAAAACH5BAEAAAUALAAAAAAMAAwAAAMlWLPcGjDKFYi9lxKBOaGcF35DhWHamZUW0K4mAbiwWtuf0uxFAgA7"
}
```