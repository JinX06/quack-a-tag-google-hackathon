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
      "logoUrl": "https://png.pngtree.com/png-clipart/20230917/original/pngtree-tiny-cute-cartoon-duck-icon-vector-png-image_12275324.png",
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
