#!/bin/sh

echo "Iniciando o deploy - v$1"

echo "..."
#ionic build --prod

echo "Iniciando iOS"
ionic cordova build ios --prod --release

echo "Iniciando Android"
ionic cordova build android --prod --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore cert/keystore.jks platforms/android/build/outputs/apk/android-release-unsigned.apk dietadospontos
zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk release/dietadospontos-"$1".apk