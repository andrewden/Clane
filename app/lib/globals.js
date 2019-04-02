import ReactNative from 'react-native';
var React = require('react-native');
import firebase from 'react-native-firebase';
  
var { PixelRatio, AsyncStorage } = React;

var CryptoJS = require("crypto-js");
import moment from 'moment'; 
import momentTimeZone from 'moment-timezone';
import SafariView from 'react-native-safari-view';
const { Dimensions, Platform, StatusBar, Image, NetInfo } = ReactNative;
import imageCacheHoc from 'react-native-image-cache-hoc';

const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https'],
});
import DeviceInfo from 'react-native-device-info';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export const WINDOW = Dimensions.get('window');
export const iPhoneX = (Platform.OS == 'ios' && Dimensions.get('window').height == 812 && Dimensions.get('window').width == 375) ? true : false;
export const SMALL_DEVICE_H = WINDOW.height < 600 ? true : false;
export const headerHeight = iPhoneX ? 180 : 160;
export const bottomTabbarHeight = iPhoneX ? 46 : 49;
export const keyboardBehaviour = (Platform.OS == 'android') ? 'height' : 'padding';
export const keyboardOffsetScreenReg = -60;
export const iPhoneXBottomSafeAreaHeight = 34;

export const timeoutDuration = 30000;
export const timeoutErrorCheck = 'Error: timeout';

export const isEmptyObject = obj => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

exports.globalVars = {
    userIdTemp_Global: '',
    userId_Global: '',

    
    AuthAccessToken: '',
    AuthRefreshToken: '',
    registrationType: '',
    isBVNVerified: false,
    dashboardTitle: '',
    bvnEmailId: '',
    statusBarColor: '',
    isFlashClicked: false,
    offlineLikeArticleData:[],
    offlineBookmarkArticleData:[],
    appForgroundCome: false,
    headerTitle: '',
    isPushTokenPermissionDone: false,
    sortedTopNewsData: [],
    userSalt: 'TOHV7eOQRAXmbe433BilgtJeCgs1rgvZ',
}

export const APP_NAME = "Clane";
export const userAuthenticates = false;
export const APPLE_TEST_USERID = "2af237ecb32b9ee171b798c27b57b467449931cda861b4fa4f743a98dffffe08";
export const APPLE_TEST_PWD = "bc70ac21a9c9588fc2dbbd68f5957ba0ddbf6e4f17ce23c13e96047d0b2746e3";
export const APPLE_TEST_PHONE = "2340000000001";
export const APPLE_TEST_SALT = "340C7A5AA5798090C5489159DBC74380";
export const APPLE_TEST_DEVICEID = "DEV-000001";
export const APPLE_TEST_SECRET = "4ab4ba6c8c08bd2d6594c9b0bbc69247d738b33cf747676c2ea0b1ceb89a0209";


 //export const mainUrl = "http://api.clane.com/api/";
 export const mainUrl = "https://api.test.clane.com/api/";
//export const mainUrl = "http://sc.test.clane.com:8080/api/";
export const APP_ERROR = "Error";
export const VarificationCodeError = "The verification code you entered was not correct, please try again.";
export const apiVersion = "v1/";
export const Authsecret = "";
export const bitlyURL = "https://api-ssl.bitly.com/v3/shorten?";
export const privacy_policy_url = "https://support.clane.com/assets/download/Clane%20Privacy%20Policy.pdf";

export const iosItunesAppUrl = "https://link.cla.ne/q9l0CDWz5S"
export const androidPlayStoreAppUrl = "https://link.cla.ne/fDh05RRz5S"
export const claneSupportLink = "https://support.clane.com/"

// export const Authsecret = "4ab4ba6c8c08bd2d6594c9b0bbc69247d738b33cf747676c2ea0b1ceb89a0209";

export const Pushsecret = "";
export const isInternetConnected = false;
export const carrierNetworkStr = "";
export const carrierNetworkTypeStr = "";
export const isLoggedIn = "false";
export const isWatchlistLoadedFirstTime = true;
export const getFCMToken = '';
export const getMobileHash = '';
 
// API endpoints
export const user_register = "user/register";
export const user_check_registration = "user/check_registration";
export const user_authenticate = "user/authenticate";
export const user_link_new_device = "user/link_new_device";
export const user_reset_password = "user/reset_password";
export const user_update_password = "user/update_password";

export const push_register = "push/register";
export const user_device_id = "user/update_device_id";
export const market_status = "stocks/market/status";
export const market_topgainers = "stocks/market/equity/topgainers";
export const market_toplosers = "stocks/market/equity/toplosers";
export const market_mostactives = "stocks/market/equity/mostactives";
export const market_stockInfo = "stocks/market/equity/stockinfo?stock_id=";
export const market_indices = "stocks/market/equity/indices";
export const market_indices_detail = "stocks/market/equity/indexmembers";
export const market_chart_data = "stocks/market/equity/chartprices";
export const market_watchlist = "stocks/watchlist";
export const market_stockInfoWithCompanyInfo = "stocks/stockinfo?stock_id=";
export const market_stockInfoWithMarketData = "stocks/market/equity/keystats?stock_id=";
export const market_search = "stocks/search/";
export const market_news = "stock-news/article";
export const market_general_news_feed = "stock-news/rssfeeds/generalnews";
export const youtube_api = "https://www.googleapis.com/youtube/v3/videos?id=";
export const push_single = "push/single";
export const news_search = "stock-news/rssfeeds/search";


// News module API endpoints
export const dashboard_top_news = "news/v1/public/tags/topnews/articles";
export const dashboard_market_trending = "stocks/market/equity/trending";
export const get_all_article_user = "news/v1/user/articles";
export const get_all_article_user_bookmark = "news/v1/user/articles/bookmark";

export const get_all_article = "news/v1/public/articles";
export const get_all_news_article = "news/v1/public/articles/all";
export const get_all_category = "news/v1/public/categories";
export const get_all_news_preference = "news/v1/user/preferences";
export const get_notification_status = "news/v1/user/notification/status";
export const set_toggle_notification = "news/v1/user/notification/toggle";
export const get_article_tagwise = "news/v1/public/tags";
export const get_search_article = "news/v1/public/search";


//dashboard - newsstock search modal 
export const searchNewsPlaceholder = "Search Market News";
export const searchMarketPlaceholder = "Search Symbol/Company";

// export const market_news_general_show_more = "stock-news/article";
export const market_general_news = "stock-news/rssfeeds";
export const market_save_personalization_data = "stock-news/save_personalization_data";
export const verify_bvn = "user/verify_bvn";
export const profile = "user/profile";
export const validate_bvn = "user/validate_bvn";
export const refresh_token = "token/refresh";
export const provider = "wallet/providers";
export const linkAccountPost = "wallet/linked_account";
export const contact_add = "contact/add";
export const contact_get = "contact/get";
export const swipeLoadMore = "Swipe up to load more";

// API alert messages and method names
export const apierror = "Something went wrong. Please try again.";
export const timeoutMessage = " We are unable to fetch data at this time. Kindly check back shortly.";
export const holdMessage ='Hold on a moment while we fetch stories for you';
export const methodGet = "GET";
export const methodPost = "POST";
export const networkNotAvailable = "No Internet connection.";
export const unableToFetchData = "Unable to fetch data.";

// API response keys and values
export const marketStatusOpen = "PREOPEN";
export const marketStatusClose = false;
export const appStatusValue = "";

// AsyncStorage Keys
export const aysnc_isLoggedIn = "isLoggedIn";
export const aysnc_loggedInNumber = "loggedInNumber";
export const aysnc_loggedInCountryCode = "loggedInCountryCode";
export const aysnc_firstAppOpen = "firstAppOpen";
export const currentNavigator = "current_navigator";
export const currentNavigatorValue = "";

export const market_status_treding = "market_status_treding";
export const market_status_timeStamp = "market_status_timeStamp";
export const market_indices_timeStamp = "market_indices_timeStamp";
export const market_stock_marketdata_timeStamp = "market_stock_marketdata_timeStamp";
export const market_stock_companydata_timeStamp = "market_stock_companydata_timeStamp";

export const market_news_timeStamp = "market_news_timeStamp";
export const market_general_news_timeStamp = "market_general_news_timeStamp";
export const market_general_news_load_more_timeStamp = "market_general_news_load_more_timeStamp";


// News module timestamp 
export const dashboard_topnews_timeStamp = "dashboard_topnews_timeStamp";
export const greetingMsgTimeInterval = "greetingMsg_timestamp";
export const dashboard_marketdata_timeStamp = "dashboard_marketdata_timeStamp";
export const category_timeStamp = "category_timeStamp";
export const general_article_timeStamp = "general_article_timeStamp";
export const article_category_timeStamp = "article_category_timeStamp";
export const article_user_timeStamp = "article_user_timeStamp";
export const article_allnews_timeStamp = "article_allnews_timeStamp";
export const article_bookmark_timeStamp = "article_bookmark_timeStamp";
export const article_tagwise_timeStamp = "article_bookmark_timeStamp_";

export const dashboard_topnews_async = "dashboard_topnews_async";
export const greetingSecondMessage = "dashboard_greeting_secondMessage";

export const earlymorningKey = "earlymorningKey";
export const morningKey = "morningKey";
export const middayKey = "middayKey";
export const noonKey = "noonKey";
export const eveningKey = "eveningKey";
export const nightKey = "nightKey";
export const weekendKey = "weekendKey";
export const fridayKey = "fridayKey";

export const dashboard_market_async = "dashboard_market_async";
export const general_article_async = "general_article_async";
export const user_article_async = "user_article_async";
export const all_news_async = "all_news_async";
export const bookmark_news_async = "bookmark_news_async";
export const article_tagwise_async = "article_tagwise_async_";

export const local_like_async = "local_like_async";
export const local_bookmark_async = "local_bookmark_async";


export const key_datasource = "datasource_";
export const key_stockInfoWithId = "stockInfoWithId_";
export const key_stockMarketData = "stockMarketData_";
export const key_stockCompanyData = "stockCompanyData_";

export const key_wholestockInfoWithId = "wholestockInfoWithId";
export const chart_timestamp = "chart_timestamp";
export const current_timestamp = "current_timestamp";
export const watchlist_timeStamp = "watchlist_timeStamp";
export const watchlist_datasource = "watchlist_datasource";
export const watchlist_added = "watchlist_added";
export const watchlist_added_ary = [];
export const user_Id = "@UserID:key";
export const user_deviceId = "deviceId";
export const user_authsecret = "authsecret";

export const token_timeStamp = "token_timeStamp";
export const fcm_token = "fcm_token";

export const market_async_indices = "market_indices";
export const market_async_news = "market_news";
export const market_async_general_news = "market_general_news";
export const market_async_news_show_more = "market_news_show_more";
export const indices_detail_timestamp = "indices_detail_timestamp";
export const indices_detail_dataSource = "indices_detail_dataSource";
export const phonebook_async_allow = "phonebook_async_allow";
export const phonebook_permission_denied = "phonebook_permission_denied";
export const market_async_open_alert = "market_async_open_alert";
export const market_async_close_alert = "market_async_close_alert";

export const categoryData = "categoryData"
export const newsPrefData = "newsPreferenceData"
// ************************* Analytics events Strings *************************

export const event_AppOpen = "AppOpen";
export const event_ArticleRead = "ArticleRead";
export const event_FirstLaunch = "FirstLaunch";
export const event_Registration = "Registration";
export const event_Registrationfailure = "RegistrationFailure";
export const event_Login = "Login";
export const event_Loginfailure = "LoginFailure";
export const event_PushNotificationofstocksinwatchlist  = "PushInWatchlist";
export const event_ReceivedOTP = "ReceivedOTP";
export const event_OTPfailure = "OTPfailure";
export const event_ForgotPassword = "ForgotPassword";
export const event_Marketpagenavigation = "Markets";
export const event_Generalnewspagenavigation = "GeneralNews";
export const event_TrendingNews = "TrendingNews"
export const event_Stockdetail = "StockDetail";
export const event_stockName = "StockDetails";
export const event_StockNewsShowMore = "StockNewsShowMore";
export const event_Indices = "Indices";
export const event_IndicesDetails = "IndicesDetails";
export const event_Addstocktowatchlist = "AddStockToWatchlist";
export const event_Removestockfromwatchlist = "RemovedStockFromWatchlist";
export const event_Sharedastockpage = "SharedStock";
export const event_Sharedanewsarticle = "SharedNewsArticle";
export const event_Watchedastockvideo = "WatchedStockVideo";
export const event_Appversion = "AppVersion";
export const event_OSType = "OSType";
export const event_OSVersion = "OSVersion";
export const event_DeviceModel = "DeviceModel";
export const event_DeviceResolution = "DeviceResolution";
export const event_DeviceLanguage = "DeviceLanguage";
export const event_CarrierName = "CarrierName";
export const event_Carriernetwork = "CarrierNetwork";
export const event_Country = "Country";
export const event_ChangePassword = "ChangePassword";
export const event_PhoneNumber = "PhoneNumber";

export const event_SessionDuration = "SessionDuration";
export const event_Appupdate = "AppUpdate";
export const event_dashboardMarketSrock = "dashboard_stockMarket";
// export const event_dashboardTopNews = "dashboard_topNews";
export const event_TopNews = "TopNews";
export const event_CategoryScreen = "Category";
export const event_Like = "Like";
export const event_Unlike = "Unlike";
export const event_Bookmark = "Bookmark";
export const event_Bookmarked = "Bookmarked";
export const event_DashboardSearch = "DashboardSearch";
export const event_DashboardPreferenace = "DashboardPreference";
export const event_NewsPreferenace = "NewsPreference";
export const event_NewsPreferenaceDone = "NewsPreferenceDone";
export const event_NewsPreferenaceEdit = "NewsPreferenceEdit";
export const event_Categories = "Categories"
export const event_tagsCategories = "TagsWiseCategories"
// ************************* Common Strings *************************

// Screen Titles
export const screenTitle_otp = "Verify";
export const screenTitle_password = "Password";
export const screenTitle_forgot_password = "Forgot Password";
export const screenTitle_reset_password = "Reset Password";
export const screenTitle_PrivacyPolicy= 'Privacy Policy';
export const screenTitle_TermsCondition = "Terms And Conditions"
export const screenTitle_TagPrefrence = "TagPref";
export const screenTitle_NewsSummary = "NewsSummary";
export const screenTitle_NewsSearchDetail = "NewsSearchDetail";
export const screenTitle_enterBVN = "BVN";
export const screenTitle_bvnOTP = "Verify";
export const screenTitle_profile = "Profile";
export const screenTitle_market = "Markets";
export const screenTitle_watchlist = "Watchlist";
export const screenTitle_notifications = "Notifications";
export const screenTitle_NewsStockSearchModal = "NewsStockSearchModal";
export const screenTitle_Category = "Category";
export const screenTitle_CategoryNewsArticle = "Category News Article Detail"
export const screenTitle_news = "News";
export const screenTitle_news_load_more = "News Load More";
export const screenTitle_news_show_more = "News Show More";
export const screenTitle_stock_news_article_detail = "Stock News Article Detail";
export const screenTitle_dashboardNewsArticleDetail = "Dashboard News Article Detail";
export const screenTitle_stockdetail = "Stock Detail";
export const screenTitle_transferUserDetail = "Transfer";
export const screenTitle_pin = "Enter Clane PIN";
export const selectAccountTitle = "Select Account";
export const screenTitle_companyInfo = "Company Info";
export const screenTitle_stockNews = "Article";
export const screenTitle_Details = "Details";
export const screenTitle_Summary = "Summary";
export const screenTitle_Transfer = "Transfer";
export const screenTitle_Payment = "Payment";
export const screenTitle_scan = "Scan";
export const screenTitle_audioQR = "Audio QR";
export const screenTitle_nearBy = "Nearby";
export const screenTitle_sendMoney = "Send Money";
export const screenTitle_details = "Details";
export const screenTitle_selectBank = "Select Bank";
export const screenTitle_selectcontact = "Select Contacts";
export const screenTitle_QRCodeDetail = "QRCodeDetail";
export const screenTitle_note = "Note";
export const screenTitle_newContact = "Contacts";
export const screenTitle_Preferences = "Preferences";
export const screenTitle_ChangePassword = "Change Password";
export const screenTitle_newsPreference = "News Preferences";
export const screenTitle_newsSearchDetail = "News search Detail"


// Genereal texts
export const cancel = "Cancel";
export const change = "Change";
export const next = "Next";
export const btnContinue = "Continue";
export const skipForNow = "Skip for now";
export const sentTo = "Sent to +";
export const didNotReceive = "I did not receive a code!";
export const resendBtn = "Resend";
export const complete = "Complete";
export const completeVerification = "Complete Verification";
export const back = "Back"
export const tryAgain = "Try Again"
export const btnPay = "Pay";
export const btnSend = "Send";
export const done = "Done";
export const close = "Close";
export const collect = "Collect";
export const marketOpenBanner = "Hurray, market is open!";
export const marketCloseBanner = "Oops, you missed the market!";

// Dashboard Lables 
export const dashboardTransfer = "Transfer";
export const dashboardEscrow = "Escrow";
export const dashboardSavings = "Savings";
export const dashboardEsusu = "Esusu";
export const dashboardInsurance = "Insurance";
export const dashboardStock = "Stocks";
export const dashboardTopup = "Top-Up";
export const dashboardInternet = "Internet";
export const dashboardFood = "Food";
export const dashboardTV = "TV";
export const dashboardMore = "More";
export const dashboardExchange = "Exchange";
export const dashboardDummytext = "Lorem Ipsum";
export const dashboardFeatured = "Featured";
export const dashboardFeatured2 = "Featured2";
export const clanePin = "Please enter your Clane PIN to \nauthorize the transaction.";
export const forgotPin = "Forgot your PIN?";

//Password screen lables and messages
export const passwordSetPasswordClaneAccount = "Please set a password for your Clane account.";
export const passwordEnterPasswordClaneAccount = "Please enter your Clane password to log into your account.";
export const passwordSingUp = "Sign Up";
export const passwordLogin = "Login";
export const passwordConfirmPasswordPlaceHolder = "Confirm Password";
export const passwordValidation = "Your password should contain \nminimum 7 characters including atleast 1 number.";
export const passwordDoesntMatch = "Passwords do not match.";
export const passwordMobilePlaceHolder = "Enter mobile number";
export const passwordEnter = "Please enter your password.";
export const passwordEnterConfirm = "Please enter confirm password.";

// PhoneOTP screen lables and messages
export const phoneOTPEnterCodeTextMessage = "Please enter the code we sent you to verify your phone number.";

// Register screen lables and messages
export const registerMobileNumberWrongLength = "Please check the length of your mobile number.";
export const registerMobileNumberEnter = "Please enter your mobile number.";
export const registerMobileNumberProperFormat = "Enter mobile number in proper format.";

export const registerChekcMobileNumber = "Please check the mobile number you have entered";
export const registerWhichMobileNumberUse = "Which mobile number do you want to use for your Clane account?";
export const registerBySigningUp = "By signing up, you agree to the";
export const registerClaneServiceAgreement = "Clane Service Agreement.";
export const registerRegisterUserSuccessful = "Registered user registration successful";
export const registerBVNUserSuccessful = "BVN user registration successful";

// forgot password lable and message 
export const forgotPasswordSixDigit = "Please enter six digit code.";
export const forgotPasswordSixDigitValid = "Please enter valid code.";
export const forgotPasswordNewPassword = "Please enter your new password.";

// Phonebook lables and messages
export const phonebookTitle = "Allow Clane to access your Phonebook";
export const phonebookMessage = "This lets you have access to your phonebook contacts";
export const phonebookAllowAccept = "Sure, I'd like that";
export const phonebookAllowDecline = "Not now";

// Add new contact lables and message
export const addContact = "Add Contact";
export const editContact = "Edit Contact";
export const pleaseFillNote = "Please fill one of the below fields";
export const pleaseMakeSureNote = "Please make sure you enter the contact phone number with the correct country code.";
export const contactPhoto = "Contact Photo";
export const placeholderEnterContactName = "Enter Contact Full Name";
export const placeholderEnterPhoneNumber = "Enter Phone Number";
export const placeholderEnterEmailAddress = "Enter email address";
export const btnSaveContact = "Save Contact";
export const contactsSuccess = "Contact successfully created";
export const btnOkay = "Okay";


// BVN ProfileSetup lables and messages
export const profileSetupTitle = "Profile Setup";
export const profileSetupDescription = "Set up your profile in one easy step to perform payments and transfers. We just need to verify your BVN.";
export const profileSetupVerifyWithBVN = "Verify with BVN";

// Enter BVN screen lables and messages
export const enterBVNheading = "Please enter your 11-digit BVN and your email address.";
export const enterBVNEmptyBNV = "Please enter your BVN.";
export const enterBVNValidBNV = "Please enter valid BVN.";
export const enterBVNEmptyEmail = "Please enter your email address.";
export const enterBVNValidEmail = "Please enter valid email address.";

// BVN Profile Complete lables and messages
export const profileSetupCompleteTitle = "Profile Setup Complete";
export const profileSetupCompleteDescription = "Want to start making payments? Add your bank account now.";
export const profileSetupAddBankAccount = "Add Bank Account";

// BVN otp verification Complete lables and messages
export const bvnOTPheading = "We sent you a code via SMS to verify your BVN-linked phone number.";

// BVN Complete Verification lables and messages
export const completeVerificationAddress = "ADDRESS";
export const completeVerificationDateOfBirth = "DATE OF BIRTH";

// Stocks lables and messages
export const topGainers = "TOP GAINERS";
export const topLosers = "TOP LOSERS";
export const mostActive = "MOST ACTIVE";
export const trendingToday = "Trending Today";
export const lastUpdated = "Last Updated:";

// WatchList lables and messages
export const noStocks = "No Stocks.";
export const watchlistEmpty = "Your watchlist is currently empty.";
export const addStock = "Add Stocks";

// Stock detail lables and messages
export const stockDetailviewCompanyInfo = "VIEW COMPANY INFO AND MORE DATA";
export const stockDetailRelatedNews = "Related News";
export const stockDetailRelatedNewsTitle = "Lafarge Africa Plc Opts for Rights Issue amidst debt restructuring";
export const stockDetailRelatedNewsAddress = "WAPCO - 06:35PM - Bloomberg";
export const stockDetailNoChartDataFound = "No chart data available for this date range.";
export const addBankAccount = "Add bank account";

// Me Select Bank screen lables and messages
export const selectBankTitle = "Select Bank";
export const selectBankLinkAccount = "Link a new bank account with Clane";
export const selectBankSearchBank = "Search Bank";
export const searchName = "Search Name";

export const selectBankChooseBank = "Choose or add an account";

// Me Contact screen lables and messages
export const searchContact = "Search Contact";

// Me your account screen lables and messages
export const yourAccountTitle = "Your Accounts";
export const yourAccountBankWallet = "accounts have been added to your Clane wallet.";
export const yourAccountSelectPrimaryAccount = "Please set a default account for sending & receiving payments. You can change that later.";
export const yourAccountSave = "Save";


// Me Account successfull screen lables and messages
export const meAccountAddSuccessfull = "Account added successfully";
export const meTransactionLinkMessage = "Your transactions are now linked,";
export const meMakePaymentMessage = "you can start making payments,";
export const meRequestMoneyMessage = "sending or requesting money,";

// Transfer Dashboard screen lables and messages
export const transferDashboardScan = "Scan";
export const transferDashboardAudioQR = "Audio";
export const transferDashboardNearby = "Nearby";
export const transferDashboardSendMoney = "Send Money";
export const transferDashboardRecent = "Recent";
export const transferDashboardOnClane = "On Clane";
export const transferDashboardPhonebook = "Phonebook";
export const transferDashboardAddNew = "Add new";

// Transfer summary screen screen lables and messages
export const transferSummaryRepeat = "Repeat";
export const transferSummarySplit = "Split";
export const transferSummaryEmail = "Email";
export const transferSummaryShowMore = "Show more";
export const transferSummaryShowLess = "Show less";
export const transferSummaryMessage = "Message";
export const transferSummaryAmount = "Amount";
export const transferSummaryTag = "Tag";
export const transferSummaryReference = "Reference";
export const transferSummaryReferenceNo = "CL9856201803300941";
export const transferSummaryTransactionDate = "Transaction Date";
export const transferSummaryStatus = "Status";
export const transferSummarySuccessfully = "Successfully";
export const transferSummarySendMoney = "Send Money";
export const transferSummaryMessageOne = "Please use this for Pizza from the other day";
export const transferSummaryYouPaid = "You paid from your";
export const transferSummaryTagOne = "JaneB";
export const transferSummaryTagTwo = "Uber";
export const transferSummaryTagThree = "SummerTime";
export const transferSummaryTagFour = "Clothing";
export const transferSummaryTagFive = "Food";
export const transferAddMessage = "Add a message";
export const transferAddPersonalNote = "Add a personal note";
export const transferSendTo = "Send to";
export const transfer234 = "+234";
export const transferBeneficary = "Beneficary";
export const transferBankDetail = "Bank Detail";

// Tags screen labels and messages
export const tagAddTag = "Add Tags";
export const tagForThisTransaction = "for this transaction";
export const tagSuggested = "Suggested";
export const tagPlaceHolder = "Add a tag and press Enter";
export const tagTransferSuccess = "Transfer successful!";

export const meDone = "Done";

export const paymentAudio = "Audio Pay";
export const paymentAudioInProgress = "Audio QR in Progress.";
export const paymentQrCodeScan = "Scan the QR code within the frame";
export const paymentQrCodeScanHelp = "Not working? Get help here";
export const paymentSupport = "Support";
export const paymentAudioHelpTextOne = "1. Locate your phone speaker";
export const paymentAudioHelpTextTwo = "2. Aim speaker to the receiving end";
export const paymentAudioHelpTextOk = "Okay, got it";
export const paymentProgress = "Payment in progress..";

// Details screen labels and messages
export const alertAddSendMessage = "Please enter message";
export const alertSendToEmail = "Please enter email";
export const alertSendToPhoneNumber = "Please enter phone number";
export const alertSendToName = "Please enter name";
export const alertSelectBankDetail = "Please select bank detail";
export const alertAccountNumber = "Please enter account number";

// QRCodeDetail lables and message
export const QRCodeDetailRawTitle = "Raw Data:";
export const QRCodeDetailBinaryTitle = "Binary Data:";
export const QRCodeDetailInvalidQRCodeMessage = "Data not parse due to invalid QR code string";

// Collect lables and message
export const CollectUseScan = "Use Scan Pay to pay me";
export const CollectUseClaneScan = "Use Clane Scan Pay to pay me";

export const CollectAddAmount = "Add an amount";
export const CollectSaveQRCodeAsImage = "Save QR Code as image";
export const CollectClearAmount = "Clear amount";
export const CollectAddNote = "Add note";
export const CollectClearNote = "Clear note";

export const BitlyGenericAccessToken = "31c0bba1aa26e9ff4a65cccff01323a9d3d76fc1";

export const createRequestSignature = function (uri, body, timestamp, generated_secret) {
    return CryptoJS.HmacSHA256(uri + body + timestamp, generated_secret).toString();
}

// export const createRequestSignatureWithoutSceret = function (uri, body, timestamp) {
//     return CryptoJS.HmacSHA256(uri + body + timestamp).toString();
// }

export const generateSecret = function (pushed_secret, sms_otp) // need to be created only once.
{
    return CryptoJS.SHA256(pushed_secret + sms_otp).toString();
}



//--------------------------------- FontSizes For Whole App -------------------------------------

//More big new
export const font_8 = (Platform.OS == 'ios') ? screenWidth * 0.0250 : screenWidth * 0.0225;//8
export const font_9 = (Platform.OS == 'ios') ? screenWidth * 0.0275 : screenWidth * 0.0250;//9
export const font_10 = (Platform.OS == 'ios') ? screenWidth * 0.0300 : screenWidth * 0.0275;//10
export const font_11 = (Platform.OS == 'ios') ? screenWidth * 0.0325 : screenWidth * 0.0300;//11
export const font_12 = (Platform.OS == 'ios') ? screenWidth * 0.0350 : screenWidth * 0.0325;//13
export const font_13 = (Platform.OS == 'ios') ? screenWidth * 0.0375 : screenWidth * 0.0350;//13
export const font_14 = (Platform.OS == 'ios') ? screenWidth * 0.0400 : screenWidth * 0.0375;//14
export const font_15 = (Platform.OS == 'ios') ? screenWidth * 0.0425 : screenWidth * 0.0400;//14
export const font_3 = (Platform.OS == 'ios') ? screenWidth * 0.0450 : screenWidth * 0.0400;//15
export const font_16 = (Platform.OS == 'ios') ? screenWidth * 0.0475 : screenWidth * 0.0425;//16
export const font_17 = (Platform.OS == 'ios') ? screenWidth * 0.0500 : screenWidth * 0.0450;//17
export const font_18 = (Platform.OS == 'ios') ? screenWidth * 0.0525 : screenWidth * 0.0475;//18

export const font_19 = screenWidth * 0.0475;//19
export const font_20 = screenWidth * 0.05;//20
export const font_22 = screenWidth * 0.055;//22

export const font_24 = screenWidth * 0.06;//24

export const font_28 = screenWidth * 0.075;//28
export const font_32 = screenWidth * 0.08;//32
export const font_36 = screenWidth * 0.09;//36





export const fontClaneAkkuratTTLight = (Platform.OS == 'ios') ? "ClaneAkkuratTT-Light" : "ClaneAkkuratTT-Light";

export const fontClaneLetteraTextTTBlack = (Platform.OS == 'ios') ? "ClaneLetteraTextTT-Black" : "ClaneLetteraTextTT-Black";

export const fontClaneLetteraTextTTBold = (Platform.OS == 'ios') ? "ClaneLetteraTextTT-Bold" : "ClaneLetteraTextTT-Bold";

export const fontClaneLetteraTextTTExtraBold = (Platform.OS == 'ios') ? "ClaneLetteraTextTT-ExtraBold" : "ClaneLetteraTextTT-ExtraBold";

export const fontClaneLetteraTextTTRegular = (Platform.OS == 'ios') ? "ClaneLetteraTextTT-Regular" : "ClaneLetteraTextTT-Regular";

export const fontSFProTextBold = (Platform.OS == 'ios') ? "SFProText-Bold" : "SFProText-Bold";
export const fontSFProTextHeavy = (Platform.OS == 'ios') ? "SFProText-Heavy" : "SFProText-Heavy";
export const fontSFProTextLight = (Platform.OS == 'ios') ? "SFProText-Light" : "SFProText-Light";
export const fontSFProTextMedium = (Platform.OS == 'ios') ? "SFProText-Medium" : "SFProText-Medium";
export const fontSFProTextRegular = (Platform.OS == 'ios') ? "SFProText-Regular" : "SFProText-Regular";
export const fontSFProTextSemibold = (Platform.OS == 'ios') ? "SFProText-Semibold" : "SFProText-Semibold";


export const checkThemeInOfflineMode = function () {
    var thememode;
    var currentdate = momentTimeZone.tz('Africa/Lagos').format('YYYY-MM-DD HH:mm:ss')
    console.log("currentdate " + currentdate);

    var date = moment(currentdate);
    var dow = date.day();
    console.log("DAyss" + dow);

    var fields = currentdate.split(' ');
    var currentTime = fields[1];
    var startTime = moment('09:30 am', "HH:mm a");
    // var startTime = moment('05:00 am', "HH:mm a");
    var endTime = moment('02:30 pm', "HH:mm a");

    console.log("currentTime " + currentTime);

    console.log("startTime " + startTime);
    console.log("endTime " + endTime);

    amIBetween = moment(currentTime, "HH:mm:ss").isBetween(startTime, endTime);
    console.log("amIBetween " + amIBetween);

    if (dow > 0 && dow <= 5) {
        if (amIBetween) {
            thememode = true;
            console.log("Working Dayss");
        } else {
            thememode = false;
            console.log("Dayss off");
        }
    } else {
        thememode = false;
        console.log("Holi Dayss");
    }

    return thememode;
}

export const convertTimestamp = function (number) {
    let dateSame = null;
    let converTime = null;
    var match = number.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/)
    var date = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6])
    converTime = date.getTime() / 1000
     
    var currentDate = moment().format('DD-MM-YYYY');
    var converted_date = moment(converTime).format('DD-MM-YYYY')
    var yesterday = new Date(new Date().setDate(new Date().getDate()-1));
    var sss = moment(yesterday).format('DD-MM-YYYY')
    var d = new Date();
    var ss =d.setDate(d.getDate() - 1);
    var yes = moment(ss).format('DD-MM-YYYY')
    console.log("yesterday "+yes);
    if (converted_date === sss) {
        console.log('The dates are yesterday!')
        dateSame = "0";
    } 
    else if (converted_date === currentDate) {
        console.log('The dates are the same!')
        dateSame = "1";
    } 
    else {
        console.log('The dates are other.')
        dateSame = "2";
    }
    return dateSame; 
    // return converTime;
}
export const checkTimeStamp = function (number) {
    var dateSame = null;
    var currentDate = moment().format('DD-MM-YYYY');
    var converted_date = moment(number).format('DD-MM-YYYY')
    var yesterday = new Date(new Date().setDate(new Date().getDate()-1));
    var sss = moment(yesterday).format('DD-MM-YYYY')
    var d = new Date();
    var ss =d.setDate(d.getDate() - 1);
    var yes = moment(ss).format('DD-MM-YYYY')
    console.log("yesterday "+yes);
    if (converted_date === sss) {
        console.log('The dates are yesterday!')
        dateSame = "0";
    } 
    else if (converted_date === currentDate) {
        console.log('The dates are the same!')
        dateSame = "1";
    } 
    else {
        console.log('The dates are other.')
        dateSame = "2";
    }
    return dateSame;
}

export const capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const checkForFloatAndRound = function (number) {
    if (number == null) {
        return 0;
    } else {
        return parseFloat(number).toFixed(2);
    }
}

export const getFCMTokens = function (){
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log("TOKEN GLOBLA" + fcmToken)
          AsyncStorage.setItem(fcm_token, fcmToken);
        } else {
          console.log("NO--TOKEN")
        }
      });
}
export const getTimeDifference = function (start) {
    var timeStart = new Date(start).getTime(),
        diffMins = (new Date().getTime() - timeStart) / 1000 / 60;
    console.log('>>>>> ' + diffMins + ' <<<<<');
    return (diffMins);
}

export const getTimeDifferenceSecond = function (start) {
    var timeStart = new Date(start).getTime(),
        diffMins = (new Date().getTime() - timeStart) / 1000;
    console.log('TIMER SECOND ' + diffMins + ' diffSecond<<<<<');
    return (diffMins);
}

export const numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  } = Dimensions.get('window');
  
  // based on iphone 5s's scale
  const scale = WINDOW.width / 320;

  export const  normalize = function (size) {
    const newSize = size * scale 
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
  }

  


  export const getFontSizeNewsTitle = function () {
    var FONT_BACK_LABEL = 0;

    if (PixelRatio.get() <= 1) {
        console.log("PixelRatio 1");
        FONT_BACK_LABEL = 18;
    }
    else if (PixelRatio.get() <= 1.5) {
        FONT_BACK_LABEL = 18;
        console.log("PixelRatio 1.5");
    }
    else if (PixelRatio.get() <= 2) {
        if (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') {
            FONT_BACK_LABEL = 16;
            console.log("PixelRatio 14");
        }
        else {
            FONT_BACK_LABEL = 18;
            console.log("PixelRatio 16");
        }
        console.log("PixelRatio 2");
    }
    else if (PixelRatio.get() <= 3) {
        FONT_BACK_LABEL = 18;
        console.log("PixelRatio 3");
    }
    else if (PixelRatio.get() <= 3.5) {
        FONT_BACK_LABEL = 18;
        console.log("PixelRatio 3.5");
    }

    return (FONT_BACK_LABEL);
}



export const getNewsTopHeaderHeight = function () {
    var FONT_BACK_LABEL = 0;

    if (PixelRatio.get() <= 1) {
        console.log("PixelRatio 1");
        FONT_BACK_LABEL = 250;
    }
    else if (PixelRatio.get() <= 1.5) {
        FONT_BACK_LABEL = 250;
        console.log("PixelRatio 1.5");
    }
    else if (PixelRatio.get() <= 2) {
        if (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') {
            FONT_BACK_LABEL = 250;
            console.log("PixelRatio 14");
        }
        else {
            FONT_BACK_LABEL = 290;
            console.log("PixelRatio 16");
        }
        console.log("PixelRatio 2");
    }
    else if (PixelRatio.get() <= 3) {
        FONT_BACK_LABEL = 354;
        console.log("PixelRatio 3");
    }
    else if (PixelRatio.get() <= 3.5) {
        FONT_BACK_LABEL = 354;
        console.log("PixelRatio 3.5");
    }

    return (FONT_BACK_LABEL);
}


export const getFontSizeDashboardTrendingTitle = function () {
    var FONT_BACK_LABEL = 0;

    if (PixelRatio.get() <= 1) {
        console.log("PixelRatio 1");
        FONT_BACK_LABEL = 20;
    }
    else if (PixelRatio.get() <= 1.5) {
        FONT_BACK_LABEL = 20;
        console.log("PixelRatio 1.5");
    }
    else if (PixelRatio.get() <= 2) {
        if (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') {
            FONT_BACK_LABEL = 20;
            console.log("PixelRatio 14");
        }
        else {
            FONT_BACK_LABEL = 25;
            console.log("PixelRatio 16");
        }
        console.log("PixelRatio 2");
    }
    else if (PixelRatio.get() <= 3) {
        FONT_BACK_LABEL = 25;
        console.log("PixelRatio 3");
    }
    else if (PixelRatio.get() <= 3.5) {
        FONT_BACK_LABEL = 25;
        console.log("PixelRatio 3.5");
    }

    return (FONT_BACK_LABEL);
}

export const getFontSizeNewsDate = function () {
    var FONT_BACK_LABEL = 0;

    if (PixelRatio.get() <= 1) {
        console.log("PixelRatio 1");
        FONT_BACK_LABEL = 10;
    }
    else if (PixelRatio.get() <= 1.5) {
        FONT_BACK_LABEL = 10;
        console.log("PixelRatio 1.5");
    }
    else if (PixelRatio.get() <= 2) {
        if (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') {
            FONT_BACK_LABEL = 9;
            console.log("PixelRatio 14");
        }
        else {
            FONT_BACK_LABEL = 10;
            console.log("PixelRatio 16");
        }
        console.log("PixelRatio 2");
    }
    else if (PixelRatio.get() <= 3) {
        FONT_BACK_LABEL = 10;
        console.log("PixelRatio 3");
    }
    else if (PixelRatio.get() <= 3.5) {
        FONT_BACK_LABEL = 10;
        console.log("PixelRatio 3.5");
    }

    return (FONT_BACK_LABEL);
}

export const getFontSizeSummary = function () {
    var FONT_BACK_LABEL = 0;

    if (PixelRatio.get() <= 1) {
        console.log("PixelRatio 1");
        FONT_BACK_LABEL = 14;
    }
    else if (PixelRatio.get() <= 1.5) {
        FONT_BACK_LABEL = 14;
        console.log("PixelRatio 1.5");
    }
    else if (PixelRatio.get() <= 2) {
        console.log("PixelRatio 2"+DeviceInfo.getModel());
        if (DeviceInfo.getModel() == 'iPhone 5' || DeviceInfo.getModel() == 'iPhone 5s' || DeviceInfo.getModel() == 'iPhone SE') {
            FONT_BACK_LABEL = 12;
            console.log("PixelRatio 14");
        }
        else {
            FONT_BACK_LABEL = 14;
            console.log("PixelRatio 16");
        }
    }
    else if (PixelRatio.get() <= 3) {
        FONT_BACK_LABEL = 16;
        console.log("PixelRatio 3");
    }
    else if (PixelRatio.get() <= 3.5) {
        FONT_BACK_LABEL = 16;
        console.log("PixelRatio 3.5");
    }

    return (FONT_BACK_LABEL);
}

export const setStatusBarForSafariView = function () {
    let showSubscription = SafariView.addEventListener(
        "onShow",
        () => {
            StatusBar.setBarStyle("dark-content");
        }
    );

    let dismissSubscription = SafariView.addEventListener(
        "onDismiss",
        () => {
             
            StatusBar.setBarStyle("light-content");
        }
    );
}

export const imageStore = function (url) {
    CacheableImage.cacheFile(encodeURI(url), true)
        .then(localFileInfo => {
            console.log("localFileInfo-->", localFileInfo);
        });
}

/**
 * function for get analytic data for firebase 
 * @param {*} carrierNetworkStr 
 * @param {*} carrierNetworkTypeStr 
 * @param {*} userID 
 */
export const getAnalyticBasicData = function(carrierNetworkStr, carrierNetworkTypeStr, userID) {

    let currentTime = new Date()
    let resolution = Dimensions.get('window').width + 'X' + Dimensions.get('window').height

    console.log('====================================');
            console.log( 'Analyticssssssss ' + JSON.stringify(Object.assign({}, { }, { 
                Date: moment(currentTime).format('MM/DD/YYYY'),
                Time: moment(currentTime).format('hh:mm A'),
                // DeviceModel : DeviceInfo.getModel(),
                DeviceResolution: resolution,
                // DeviceLanguage : DeviceInfo.getDeviceLocale(),
                // OSType : Platform.OS, 
                // OSVersion : DeviceInfo.getSystemVersion(),
                CarrierName : DeviceInfo.getCarrier(),
                CarrierNetwork : carrierNetworkStr,
                CarrierNetworkType : carrierNetworkTypeStr,
                Country : DeviceInfo.getDeviceCountry(),
                // AppVersion : DeviceInfo.getVersion(),
                UserID : userID
            })));
    console.log('====================================');

        return { 
            Date: moment(currentTime).format('MM/DD/YYYY'),
                Time: moment(currentTime).format('hh:mm A'),
                // DeviceModel : DeviceInfo.getModel(),
                DeviceResolution: resolution,
                // DeviceLanguage : DeviceInfo.getDeviceLocale(),
                // OSType : Platform.OS, 
                // OSVersion : DeviceInfo.getSystemVersion(),
                CarrierName : DeviceInfo.getCarrier(),
                CarrierNetwork : carrierNetworkStr,
                CarrierNetworkType : carrierNetworkTypeStr,
                Country : DeviceInfo.getDeviceCountry(),
                // AppVersion : DeviceInfo.getVersion(),
                UserID : userID
        }
}


export const getAnalyticBasicDataCategoryType = function(carrierNetworkStr, carrierNetworkTypeStr, userID, categoryType, timeDiff, title) {

  let currentTime = new Date()
  let resolution = Dimensions.get('window').width + 'X' + Dimensions.get('window').height

  console.log('====================================');
          console.log( 'Analyticssssssss ' + JSON.stringify(Object.assign({}, { }, { 
              Date: moment(currentTime).format('MM/DD/YYYY'),
              Time: moment(currentTime).format('hh:mm A'),
              TimeSpent : timeDiff,
              NewsTitle: title,

              // DeviceModel : DeviceInfo.getModel(),
              DeviceResolution: resolution,
              // DeviceLanguage : DeviceInfo.getDeviceLocale(),
              // OSType : Platform.OS, 
              // OSVersion : DeviceInfo.getSystemVersion(),
              CarrierName : DeviceInfo.getCarrier(),
              CarrierNetwork : carrierNetworkStr,
              CarrierNetworkType : carrierNetworkTypeStr,
              Country : DeviceInfo.getDeviceCountry(),
              // AppVersion : DeviceInfo.getVersion(),
              UserID : userID,
              categoryType : categoryType
          })));
  console.log('====================================');

      return { 
          Date: moment(currentTime).format('MM/DD/YYYY'),
              Time: moment(currentTime).format('hh:mm A'),
              TimeSpent : timeDiff,
              NewsTitle: title,
              // DeviceModel : DeviceInfo.getModel(),
              DeviceResolution: resolution,
              // DeviceLanguage : DeviceInfo.getDeviceLocale(),
              // OSType : Platform.OS, 
              // OSVersion : DeviceInfo.getSystemVersion(),
              CarrierName : DeviceInfo.getCarrier(),
              CarrierNetwork : carrierNetworkStr,
              CarrierNetworkType : carrierNetworkTypeStr,
              Country : DeviceInfo.getDeviceCountry(),
              // AppVersion : DeviceInfo.getVersion(),
              UserID : userID,
              categoryType : categoryType
      }
}



/**
 * get analytic data for countly custom events
 * @param {*} carrierNetworkStr 
 * @param {*} carrierNetworkTypeStr 
 * @param {*} userID 
 * @param {*} phoneNumber 
 */
export const getAnalyticBasicDataCountly = function(carrierNetworkStr, carrierNetworkTypeStr, userID) {

    let currentTime = new Date()
    let resolution = Dimensions.get('window').width + 'X' + Dimensions.get('window').height

    console.log('====================================');
            console.log( 'Analyticssssssss ' + JSON.stringify(Object.assign({}, { }, { 
                Date: moment(currentTime).format('MM/DD/YYYY'),
                Time: moment(currentTime).format('hh:mm A'),
                DeviceModel : DeviceInfo.getModel(),
                DeviceResolution: resolution,
                DeviceLanguage : DeviceInfo.getDeviceLocale(),
                OSType : Platform.OS, 
                OSVersion : DeviceInfo.getSystemVersion(),
                CarrierName : DeviceInfo.getCarrier(),
                CarrierNetwork : carrierNetworkStr,
                CarrierNetworkType : carrierNetworkTypeStr,
                Country : DeviceInfo.getDeviceCountry(),
                AppVersion : DeviceInfo.getVersion(),
                UserID : userID,
            })));
    console.log('====================================');
          
                return { 
                    Date: moment(currentTime).format('MM/DD/YYYY'),
                    Time: moment(currentTime).format('hh:mm A'),
                    DeviceModel : DeviceInfo.getModel(),
                    DeviceResolution: resolution,
                    DeviceLanguage : DeviceInfo.getDeviceLocale(),
                    OSType : Platform.OS, 
                    OSVersion : DeviceInfo.getSystemVersion(),
                    CarrierName : DeviceInfo.getCarrier(),
                    CarrierNetwork : carrierNetworkStr,
                    CarrierNetworkType : carrierNetworkTypeStr,
                    Country : DeviceInfo.getDeviceCountry(),
                    AppVersion : DeviceInfo.getVersion(),
                    UserID : userID
        
                }
            
        
}
