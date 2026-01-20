
Hey, I made this application to help me interface with an AI chat API with my phone.
Uploading this to GitHub to show that yes, I do in fact program in my free time and am trying to use and grow my skills in a practical way.
If you are an interviewer looking at this, then thank you for taking the time to check out my code!
This program was made in 2024ish, but has received minor updates with time to deal with Mancer's changing API standards.
--Michael Mark Watson
How to launch Expo GO
npx expo start -c --tunnel

How to create a local release APK (simple)

Option A — Gradle (recommended, minimal):

```powershell
cd android
.\gradlew assembleRelease
```

Produced APK (build output): `android/app/build/outputs/apk/release/app-release.apk`
You can copy it to the project root with:

```powershell
Copy-Item android\app\build\outputs\apk\release\app-release.apk .\app-release.apk -Force
```

Option B — Expo CLI (alternative):

```powershell
npx expo run:android --variant release
```

Note: These produce an unsigned release APK unless you configure signing (keystore + `key.properties` + signingConfig). A signed APK is required for publishing to Google Play.

In this repository a release APK was built and copied to the repo root as `app-release.apk`.



# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
