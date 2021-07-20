# Cardea Mobile Holder

The Cardea Mobile Holder is an open-source UI agent for mobile devices, allowing users to manage self-sovereign identity (SSI) credentials on one or more Hyperledger Aries networks. It’s built using React Native to make the project approachable to a large community of developers, to ease portability between platforms, and to afford code reuse.

For an introduction to self-sovereign identity (SSI), please see [Phil Windley's article](https://www.windley.com/archives/2018/09/multi-source_and_self-sovereign_identity.shtml) on the topic.

To learn more about Aries and to connect with the Hyperledger Aries community, please visit the [Hyperledger Aries Wiki](https://wiki.hyperledger.org/display/ARIES/Hyperledger+Aries)

## Installation

- Installing<br>
  `git clone https://github.com/Indicio-tech/sita-mobile-app-holder.git`<br>
  OR (with ssh key)<br>
  `git clone git@github.com:Indicio-tech/sita-mobile-app-holder.git`<br>
- Install dependencies<br>
  `npm install`
- Install cocoapods in ios directory<br>
  `cd ios`<br>
  `pod install`<br>
  `cd ..`<br>
- Create Env file<br>
  add a `.env` to the root of the project<br>
  copy this into `.env`

  ```
  MEDIATOR_URL=http://afj5.mediator.indiciotech.io:3002
GENESIS_URL=https://raw.githubusercontent.com/Indicio-tech/indicio-network/main/genesis_files/pool_transactions_testnet_genesis
GOVERNMENT_INVITATION=http://3.131.58.36:3006?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiZGY3NWFjN2EtZTQ1My00NzhmLWExYWEtMzlkN2JjMDEwYTk2IiwgInJlY2lwaWVudEtleXMiOiBbIkZSZG5yMkJmRW4xaThGSzE5V1RYcHQ4a0p0c2ltNUwzMTR2YTdqQU55b1dUIl0sICJzZXJ2aWNlRW5kcG9pbnQiOiAiaHR0cDovLzMuMTMxLjU4LjM2OjMwMDYiLCAibGFiZWwiOiAiQXJ1YmEgRGVwYXJ0bWVudCBvZiBQdWJsaWMgSGVhbHRoIn0=
LAB_RESULT_CRED_DEF_ID=9qoWwDY4vKiRzs7y723NrW:3:CL:65:default
  ```

- OS requirements

  > iOS >= 10.<br>
  > node >= 12<br>
  > xCode 12.4 (12.5 may now be available)<br>

- iOS setup

  > In xCode with the project opened under `Signing & Capabilities`, use the dropdown to select your dev team, and change the `Bundle Identifier` to anything. This will change the project's `project.pbxproj` file, changes to this file should not be pushed, please undo them before submitting PRs.

- Start UP

  > iOS won't work on simulators, so plug in an iOS device, you can get it running through a terminal or open up `cardeaholder.xcworkspace` in xCode

  In Terminal:<br>
  `npm start`<br>
  Then in Second Terminal:<br>
  `npm run ios`<br>
  For Android (works on simulator):<br>
  `npm run android`<br>

## Deployment

To build the Android packages, follow the instructions under _React Native CLI Quickstart_ in the official guide:

https://reactnative.dev/docs/environment-setup

### Side-loading an APK

When the release packages are built, they must be signed using the release key stored in `android/app/release.keystore`. The keystore and key are protected with a password that must be set as a gradle parameter named `RELEASE_SIGNING_KEY_PWD`, as demonstrated below.

Avoid entering the password in any way that will be logged, and only use the password on a hardened machine with strict access controls and full disk encryption (including swap space). The password must be stored in a secure, encrypted location at rest and should never be shared over insecure channels (esp. email).

```bash
#!/bin/bash

pushd ./android

read -s -p "Password for keystore and signing key: " PWD

# Build APK and output to app/build/outputs/apk/release
./gradlew assembleRelease -PRELEASE_SIGNING_KEY_PWD=$PWD

# Build AAB and output to app/build/outputs/bundle/release
./gradlew bundleRelease -PRELEASE_SIGNING_KEY_PWD=$PWD
```

A gradle property may also be specified by setting an environment variable that is named using the `ORG_GRADLE_PROJECT_` well-known prefix, e.g.:

```bash
ORG_GRADLE_PROJECT_RELEASE_SIGNING_KEY_PWD=$PWD /gradlew bundleRelease
```

Run the following:

```bash
cd android
./build-release
```

This will output APKs to `app/build/outputs/apk/release` and AABs to `app/build/outputs/bundle/release`. Then you can side-load the APK or manually submit the AAB to an app store as desired.

## Contributing

If you are a new contributor to the project, please read our [contribution guide](./CONTRIBUTING.md) at least once; it will save you a few review cycles!

## License

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at: [http://www.apache.org/licenses/LICENSE-2.0] (http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Developer Certificate of Origin (DCO)

Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
1 Letterman Drive
Suite D4700
San Francisco, CA, 94129

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
have the right to submit it under the open source license
indicated in the file; or

(b) The contribution is based upon previous work that, to the best
of my knowledge, is covered under an appropriate open source
license and I have the right under that license to submit that
work with modifications, whether created in whole or in part
by me, under the same open source license (unless I am
permitted to submit under a different license), as indicated
in the file; or

(c) The contribution was provided directly to me by some other
person who certified (a), (b) or (c) and I have not modified
it.

(d) I understand and agree that this project and the contribution
are public and that a record of the contribution (including all
personal information I submit with it, including my sign-off) is
maintained indefinitely and may be redistributed consistent with
this project or the open source license(s) involved.