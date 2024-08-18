{
  "timeZone": "Asia/Singapore",
  "dependencies": {
    "libraries": [
      {
        "userSymbol": "FirebaseInfo",
        "version": "0",
        "libraryId": "REPLACE_WITH_PRIVATE_APPS_SCRIPT_LIBRARY_ID",
        "developmentMode": true
      }
    ]
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.locale",
    "https://www.googleapis.com/auth/drive.addons.metadata.readonly",
    "https://www.googleapis.com/auth/userinfo.email"
  ],
  "addOns": {
    "common": {
      "name": "🦆 Quack-a-Tag! 🏷️",
      "logoUrl": "https://i.imgur.com/Qgzah2V.png",
      "useLocaleFromApp": true,
      "homepageTrigger": {
        "runFunction": "onHomepage"
      },
      "layoutProperties": {
        "primaryColor": "#ffaf51",
        "secondaryColor": ""
      }
    },
    "drive": {
      "homepageTrigger": {
        "runFunction": "onHomepage"
      },
      "onItemsSelectedTrigger": {
        "runFunction": "onItemsSelected"
      }
    }
  }
}
