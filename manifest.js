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
      "logoUrl": "https://media.discordapp.net/attachments/675367478443900951/1266848149088239806/logo_coloured.png?ex=66a6a3c7&is=66a55247&hm=9f35c27aca5e8c88a6280679f2329b3171a329bb678dff044034ba5c26012371&=&format=webp&quality=lossless&width=467&height=467",
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
