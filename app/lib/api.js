import { AsyncStorage } from 'react-native';
import * as globals from '../lib/globals';
import moment from 'moment';

export const API = {

    user_check_registration: (onResponse, country_code, mobile_no, isHeaderRequired) => {
        console.log('234' + mobile_no)
        request(onResponse, {}, 'GET', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.user_check_registration + '?phone='+ country_code + mobile_no, buildHeader());
    },

    login: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, 'POST', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.user_link_new_device, buildHeader());
    },

    generate_bitly_url: (onResponse, query, isHeaderRequired) => {
        request(onResponse, {}, 'POST', "JSON", isHeaderRequired, globals.bitlyURL + query, buildHeader());
    },

    push_register: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, 'POST', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.push_register, buildHeaderWithTokenPushRegister(globals.mainUrl + globals.apiVersion + globals.push_register, "", 'POST'));
    },
    
    updateDeviceID: (onResponse, newDeviceId, oldDevice_ID, isHeaderRequired) => {
        request(onResponse, {}, 'GET', "TEXT", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.user_device_id + '?newDeviceId=' + newDeviceId + '&oldDeviceId=' + oldDevice_ID, buildHeaderWithSignature(globals.mainUrl + globals.apiVersion + globals.user_device_id + '?newDeviceId=' + newDeviceId + '&oldDeviceId=' + oldDevice_ID, "", 'POST'));
    },

    getNewRefreshedToken: (onResponse) => {
        requestToGetNewToken(onResponse, 'POST');
    },

    register: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, 'POST', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.user_register, buildHeader());
    },

    push_single: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, 'POST', "JSON", isHeaderRequired,  globals.mainUrl + globals.apiVersion + globals.push_single, buildHeaderWithSignatureUpdatePassword(globals.mainUrl + globals.apiVersion + globals.push_single, JSON.stringify(data), 'POST', globals.globalVars.userIdTemp_Global));
    },

    reset_password: (onResponse, user_id, otpMode, isHeaderRequired) => {
        request(onResponse, {}, 'GET', "TEXT", isHeaderRequired,  globals.mainUrl + globals.apiVersion + globals.user_reset_password+"?otpMode="+otpMode, buildHeaderWithUserIDForgot(user_id));
    },

    update_password: (onResponse, data, user_id, isHeaderRequired) => {
        request(onResponse, data, 'POST', "TEXT", isHeaderRequired,  globals.mainUrl + globals.apiVersion + globals.user_update_password, buildHeaderWithSignatureUpdatePassword(globals.mainUrl + globals.apiVersion + globals.user_update_password, JSON.stringify(data), 'POST', user_id));
    },

    login_with_authentication: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, 'POST', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.user_authenticate, buildHeaderWithSignature(globals.mainUrl + globals.apiVersion + globals.user_authenticate, JSON.stringify(data), 'POST'));
    },

    verify_bvn: (onResponse, bvn, isHeaderRequired) => {
        request(onResponse, {}, 'GET', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.verify_bvn + '?bvn=' + bvn, buildHeaderWithSignature(globals.mainUrl + globals.apiVersion + globals.verify_bvn + '?bvn=' + bvn, "", 'GET'));
    },

    getProfile: (onResponse, isHeaderRequired) => {
        request(onResponse, {}, 'GET', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.profile, buildHeaderWithSignature(globals.mainUrl + globals.apiVersion + globals.profile, "", 'GET'));
    },

    getProvider: (onResponse, isHeaderRequired) => {
        request(onResponse, {}, 'GET', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.provider, buildHeaderWithSignature(globals.mainUrl + globals.apiVersion + globals.provider, "", 'GET'));
    },

    linkAccountPost: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, 'POST', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.linkAccountPost, buildHeaderWithSignatureWithToken(globals.mainUrl + globals.apiVersion + globals.linkAccountPost, JSON.stringify(data), 'POST'));
    },

    linkAccountPut: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, 'PUT', "TEXT", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.linkAccountPost, buildHeaderWithSignatureWithToken(globals.mainUrl + globals.apiVersion + globals.linkAccountPost, JSON.stringify(data), 'PUT'));
    },

    validate_bvn: (onResponse, otp, email, isHeaderRequired) => {
        request(onResponse, {}, 'GET', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.validate_bvn + '?code=' + otp + '&email=' + email, buildHeaderWithSignature(globals.mainUrl + globals.apiVersion + globals.validate_bvn + '?code=' + otp + '&email=' + email, "", 'GET'));
    },

    market_status: (onResponse, isHeaderRequired) => {
        request(onResponse, {}, 'GET', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_status);
    },

    marketlist: (onResponse, endUrl, isHeaderRequired) => {
        request(onResponse, {}, 'GET', "JSON", isHeaderRequired, globals.mainUrl + globals.apiVersion + endUrl + '?date=' + new moment().format('YYYY-MM-DD') + '&no_of_securities=10');
    },

    marketSearch: (onResponse, endUrl, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_search + endUrl, buildHeader());
    },
    getYouTubeTitleSnippet: (onResponse, endUrl, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.youtube_api + endUrl+"&key=AIzaSyCDi-2yxRDpRZdTnb47WBUVfAPQGaUYS1s&fields=items(id,snippet(title,publishedAt,channelId))&part=snippet", buildHeader());
    },

    marketNews: (onResponse, endUrl, page, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_news + endUrl+"&page="+page);
    },

    marketGeneralNews: (onResponse, page, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_general_news +"?count=10&page="+page);
    },

    marketGeneralNewsFeed: (onResponse,  isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_general_news_feed );
    },

    marketSavePersonalizationData: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, 'POST', 'TEXT', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_save_personalization_data , buildHeaderWithUserID());
    },

    indices: (onResponse, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_indices, buildHeader());
    },

    indicesDetail: (onResponse, symbol, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_indices_detail+"?symbol="+symbol, buildHeader());
    },

    chartData: (onResponse, stock_id,date_range, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_chart_data+"?stock_id="+stock_id+"&date_range="+date_range, buildHeader());
    },

    stockInfo: (onResponse, stockId, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_stockInfo + "[\""+stockId+"\"]");
    },

    watchlistData: (onResponse, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_watchlist + '/' + globals.globalVars.userIdTemp_Global, buildHeader());
    },

    watchlistAddItem: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, 'POST', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_watchlist + '/' + globals.globalVars.userIdTemp_Global, buildHeader());
    },

    watchlistDeleteItem: (onResponse, data, isHeaderRequired) => {
        request(onResponse, data, 'DELETE', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_watchlist + '/' + globals.globalVars.userIdTemp_Global, buildHeader());
    },

    stockInfoWithCompanyInfo: (onResponse, stockId, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_stockInfoWithCompanyInfo + stockId);
    },

    stockInfoWithMarketData: (onResponse, stockId, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.market_stockInfoWithMarketData + stockId);
    },

    contactAddAPICall: (onResponse, contactsArray, isHeaderRequired) => {
        request(onResponse, contactsArray, 'POST', 'TEXT', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.contact_add, buildHeaderWithSignatureWithToken(globals.mainUrl + globals.apiVersion + globals.contact_add, JSON.stringify(contactsArray), 'POST'));
    },

    contactGetAPICall: (onResponse, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.contact_get, buildHeaderWithSignature(globals.mainUrl + globals.apiVersion + globals.contact_get, "", 'GET'));
    },

    newsSearch: (onResponse, endUrl, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.news_search + "?query=" + endUrl, buildHeader());
    },

    dashboardTopNews: (onResponse, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.dashboard_top_news );
    },
    
    dashboardMarketTrending: (onResponse, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.dashboard_market_trending );
    },

    newsUserAllArticles: (onResponse, user_id, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_all_article_user+"?topnews_flag=1", buildHeaderWithSignaturePush(globals.mainUrl + globals.apiVersion + globals.get_all_article_user+"?topnews_flag=1", '','GET') );
    },

    newsBookmarkArticles: (onResponse, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_all_article_user_bookmark, buildHeaderWithSignaturePush(globals.mainUrl + globals.apiVersion + globals.get_all_article_user_bookmark, '','GET') );
    },

    newsAllArticles: (onResponse, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_all_article+"?topnews_flag=1", buildHeader() );
    },

    getAllNewsArticles: (onResponse, isHeaderRequired, page) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_all_news_article+"?page="+page, buildHeader() );
    },
    
    newsArticlesAction: (onResponse, user_id, article_id, action, isHeaderRequired) => {
        request(onResponse, {}, 'POST', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + "news/v1/user/"+article_id+"/interaction?action="+action, buildHeaderWithSignaturePush(globals.mainUrl + globals.apiVersion + "news/v1/user/"+article_id+"/interaction?action="+action,JSON.stringify({}),'POST') );
    },

    newsArticlesGetAction: (onResponse,user_id, article_id, action, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + "news/v1/user/"+article_id+"interaction?action="+action, buildHeaderWithSignaturePush(globals.mainUrl + globals.apiVersion + "news/v1/user/"+article_id+"interaction?action="+action,'','GET') );
    },

    getAllCategories: (onResponse, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_all_category, buildHeader() );
    },

    getNewsSearchArticle: (onResponse,query, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_search_article+"?query="+query, buildHeader() );
    },

    getNewsDetail: (onResponse,news_id, userid, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_all_article+"/"+news_id, buildHeaderWithUserIDForgot(userid) );
    },

    getArticalCategoryWise: (onResponse,cat_id,userid, isHeaderRequired, page) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_all_category+"/"+cat_id+"/articles?page="+page, buildHeaderWithUserIDForgot(userid) );
    },

    getArticalTagWise: (onResponse,tag, userid, isHeaderRequired, page) => {
        if (tag === 'trending' || tag === 'topfeeds') {
            request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_article_tagwise+"/"+tag+"/articles", buildHeaderWithUserIDForgot(userid) );
        }else{
            request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_article_tagwise+"/"+tag+"/articles?page="+page, buildHeaderWithUserIDForgot(userid) );
        }
        // request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_article_tagwise+"/"+tag+"/articles?page="+page, buildHeaderWithUserIDForgot(userid) );
    },

    getUserNewsPreference: (onResponse,user_id, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_all_news_preference, buildHeaderWithSignaturePush(globals.mainUrl + globals.apiVersion + globals.get_all_news_preference,'','GET') );
    },

    setUserNewsPreference: (onResponse, data, user_id, isHeaderRequired) => {
        request(onResponse, data, 'POST', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_all_news_preference, buildHeaderWithSignaturePush( globals.mainUrl + globals.apiVersion + globals.get_all_news_preference,JSON.stringify(data),'POST') );
    },

    getNotificationStatus: (onResponse, user_id, isHeaderRequired) => {
        request(onResponse, {}, 'GET', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.get_notification_status, buildHeaderWithSignaturePush(globals.mainUrl + globals.apiVersion + globals.get_notification_status,'','GET') );
    },

    setNotificationToggle: (onResponse, user_id, isHeaderRequired) => {
        request(onResponse, {}, 'POST', 'JSON', isHeaderRequired, globals.mainUrl + globals.apiVersion + globals.set_toggle_notification, buildHeaderWithSignaturePush(globals.mainUrl + globals.apiVersion + globals.set_toggle_notification,JSON.stringify({}),'POST') );
    },


};

export const buildHeaderWithUserIDOptional = (user_id, headerParams = {}) => {
    var header;
    var ts = new Date().getTime();
    var AuthURL = mainURL;
    var uri = AuthURL.substring(AuthURL.indexOf('//') + 2);
    uri = uri.substring(uri.indexOf('/'));
    var signature = globals.createRequestSignature(uri, data, ts, globals.Authsecret);
    if (user_id != null && user_id!= undefined && user_id!= "") {
         header = {
            'Content-Type': 'application/json',
            userId: user_id,
            timestamp: "" + ts,
            signature: signature,
            "Authorization": "Bearer " + globals.globalVars.AuthAccessToken
        };
    }else{
         header = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }
    
    Object.assign(header, headerParams);
    return header;
}

export const buildHeader = (headerParams = {}) => {
    var header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
    Object.assign(header, headerParams);
    return header;
}

export const buildHeaderWithSignatureUpdatePassword = (mainURL, data, headerType, user_id, headerParams = {}) => {
    var header;
    var ts = new Date().getTime();
    var AuthURL = mainURL;
    var uri = AuthURL.substring(AuthURL.indexOf('//') + 2);
    uri = uri.substring(uri.indexOf('/'));
    // var signature = globals.createRequestSignature (uri, data, ts, globals.Authsecret);
    if (headerType === 'POST') {
        header = {
            'Content-Type': 'application/json',
            userId: user_id,
            timestamp: "" + ts,
           // signature: signature
        }
    } else {
        header = {
            'Content-Type': 'application/json',
            userId: user_id,
            timestamp: "" + ts,
            signature: signature,
            "Authorization": "Bearer " + globals.globalVars.AuthAccessToken
        }
    }
    Object.assign(header, headerParams);
    return header;
}

export const buildHeaderWithUserIDForgot = (user_id, headerParams = {}) => {
    console.log("buildHeaderWithUserIDForgot "+user_id);
    var header = null;
    if (user_id!= null) {
        header = {
            'Content-Type': 'application/json',
            userId: user_id,
        };
    }else{
        header = {
            'Content-Type': 'application/json',
        };
    }
    
    Object.assign(header, headerParams);
    return header;
}

export const buildHeaderWithUserID = (headerParams = {}) => {
    console.log("globals.globalVars.userIdTemp_Global NEWWS "+globals.globalVars.userIdTemp_Global);
    
    var header = {
        'Content-Type': 'application/json',
        userId: globals.globalVars.userIdTemp_Global,
    };
    Object.assign(header, headerParams);
    return header;
}

export const buildHeaderWithTokenPushRegister = (mainURL, data, headerType, headerParams = {}) => {
    var header;
    var ts = new Date().getTime();
    var AuthURL = mainURL;
    var uri = AuthURL.substring(AuthURL.indexOf('//') + 2);
    uri = uri.substring(uri.indexOf('/'));
    var signature = globals.createRequestSignature(uri, data, ts, globals.Authsecret);
    if (headerType === 'POST') {
        header = {
            'Content-Type': 'application/json',
            userId: globals.getMobileHash ,
            timestamp: "" + ts,
            signature: signature,
            // "Authorization": "Bearer " + globals.globalVars.AuthAccessToken
        }
    }

    Object.assign(header, headerParams);
    return header;
}


export const buildHeaderWithSignatureWithToken = (mainURL, data, headerType, headerParams = {}) => {
    var header;
    var ts = new Date().getTime();
    var AuthURL = mainURL;
    var uri = AuthURL.substring(AuthURL.indexOf('//') + 2);
    uri = uri.substring(uri.indexOf('/'));
    var signature = globals.createRequestSignature(uri, data, ts, globals.Authsecret);
    if (headerType === 'POST' || headerType === 'PUT') {
        header = {
            'Content-Type': 'application/json',
            userId: globals.globalVars.userIdTemp_Global,
            timestamp: "" + ts,
            signature: signature,
            "Authorization": "Bearer " + globals.globalVars.AuthAccessToken
        }
    }

    Object.assign(header, headerParams);
    return header;
}


export const buildHeaderWithSignaturePush = (mainURL, data, headerType, headerParams = {}) => {
    var header;
    var ts = new Date().getTime();
    var AuthURL = mainURL;
    var uri = AuthURL.substring(AuthURL.indexOf('//') + 2);
    uri = uri.substring(uri.indexOf('/'));
    var signature = globals.createRequestSignature(uri, data, ts, globals.Authsecret);

    console.log("buildHeaderWithSignaturePush URI "+uri);
    console.log("buildHeaderWithSignaturePush data "+data);
    console.log("buildHeaderWithSignaturePush timestamp "+ts);
    console.log("buildHeaderWithSignaturePush authsecret "+globals.Authsecret);
    console.log("buildHeaderWithSignaturePush signature "+signature);

    if (headerType === 'POST' || headerType === 'PUT') {
        console.log("PASDJKSDHKJS");
        
        header = {
            'Content-Type': 'application/json',
            userId: globals.globalVars.userIdTemp_Global,
            timestamp: "" + ts,
            signature: signature,
            "Authorization": "Bearer " + globals.globalVars.AuthAccessToken
        }
    } else {
        header = {
            'Content-Type': 'application/json',
            userId: globals.globalVars.userIdTemp_Global,
            timestamp: "" + ts,
            signature: signature,
            "Authorization": "Bearer " + globals.globalVars.AuthAccessToken
        }
    }
    Object.assign(header, headerParams);
    return header;
}

export const buildHeaderWithSignature = (mainURL, data, headerType, headerParams = {}) => {
    var header;
    var ts = new Date().getTime();
    var AuthURL = mainURL;
    var uri = AuthURL.substring(AuthURL.indexOf('//') + 2);
    uri = uri.substring(uri.indexOf('/'));
    var signature = globals.createRequestSignature(uri, data, ts, globals.Authsecret);
    if (headerType === 'POST') {
        header = {
            'Content-Type': 'application/json',
            userId: globals.globalVars.userIdTemp_Global,
            timestamp: "" + ts,
            signature: signature
        }
    } else {
        header = {
            'Content-Type': 'application/json',
            userId: globals.globalVars.userIdTemp_Global,
            timestamp: "" + ts,
            signature: signature,
            "Authorization": "Bearer " + globals.globalVars.AuthAccessToken
        }
    }
    Object.assign(header, headerParams);
    return header;
}

export const buildHeaderWithSignaturewithoutToken = (mainURL, data, headerType, headerParams = {}) => {
    var header;
    var ts = new Date().getTime();
    var AuthURL = mainURL;
    var uri = AuthURL.substring(AuthURL.indexOf('//') + 2);
    uri = uri.substring(uri.indexOf('/'));
    var signature = globals.createRequestSignature(uri, "", ts, globals.Authsecret);
    header = {
        'Content-Type': 'application/json',
        userId: globals.globalVars.userIdTemp_Global,
        timestamp: "" + ts,
        signature: signature
    }
    Object.assign(header, headerParams);
    return header;
}

async function request(onResponse, data, type, returnType, isHeaderRequired, featureURL, secureRequest) {
    let response = '';
    let responseJSON;
    console.log("featureURL >>> " + featureURL);
    console.log("secureRequest " + JSON.stringify(secureRequest));
    console.log("data >>> " + JSON.stringify(data));
    console.log("returnType " + returnType);
    console.log("isHeaderRequired " + isHeaderRequired);
    console.log("type " + type);

    try {
        if (type === 'GET') {
            if (isHeaderRequired) {
                console.log("Request Call get with Header");
                response = await timeout(globals.timeoutDuration, fetch(featureURL, {
                    method: type,
                    headers: secureRequest
                }));
            } else {
                console.log("Request Call get without header");
                response = await timeout(globals.timeoutDuration, fetch(featureURL, {
                    method: type,
                }));
            }
        } else {
            console.log("Request Call post with header");
            response = await timeout(globals.timeoutDuration, fetch(featureURL, {
                method: type,
                headers: secureRequest,
                body: JSON.stringify(data)
            }));
        }
        console.log("response " + JSON.stringify(response));
        console.log("response status " + response.status);
        if (returnType === 'TEXT') {
            responseJSON = await response.text();
        } else if(returnType === 'HTML')
        {
            responseJSON = await response.html();
        }
         else {
            responseJSON = await response.json();
        }
        console.log("responseJSON " + JSON.stringify(responseJSON));

        if (response.status == 200) {
            console.log("onResponse success ");
            onResponse.success(responseJSON);
        }
        else if(response.status == 404){
            onResponse.success(responseJSON);
        }
        else if(response.status == 400){
            onResponse.error(responseJSON);
        }
        else if(response.status == 401){
            onResponse.error(responseJSON);
        }
        else if(response.status == 500){
            onResponse.error(responseJSON);
        }
        else {
            console.log("onResponse error");
            onResponse.error(responseJSON);
        }
        if (onResponse.complete) {
            console.log("onResponse complete");
            onResponse.complete();
        }
    } catch (error) {
        console.log("onResponse catch error " + error);
        if(onResponse.error) {
            onResponse.error(error);
        }
        if (onResponse.complete) {
            console.log("onResponse catch complete");
            onResponse.complete();
        }
    }
}

async function requestToGetNewToken(onResponse, type) {
    var diffMins = 0;
    var isTokenTimeStampSaved = false;
    await AsyncStorage.getItem(globals.token_timeStamp).then((token_timeStamp) => {
        if (token_timeStamp !== null) {
            console.log(globals.token_timeStamp, token_timeStamp);
            diffMins = globals.getTimeDifference(token_timeStamp);
            isTokenTimeStampSaved = true;
            console.log('diffMins' + ' >>>>>>>>>>>>>>>>>>>>>>>> ' + diffMins);
        }
    });
    await AsyncStorage.getItem('@AuthenticateAccessToken:key').then((token1) => {
        if (token1 !== null) {
            console.log('@AuthenticateAccessToken:key ', token1);
            globals.globalVars.AuthAccessToken = token1;
        }
    });
    await AsyncStorage.getItem('@AuthenticateRefreshToken:key').then((token2) => {
        if (token2 !== null) {
            console.log('@AuthenticateRefreshToken:key ', token2);
            globals.globalVars.AuthRefreshToken = token2;
        }
    });

    if (diffMins <= 9.5 && isTokenTimeStampSaved == true) {
        onResponse.success('Success');
        if (onResponse.complete) {
            console.log("requestToGetNewToken onResponse complete");
            onResponse.complete();
        }
    } else {
        let requestUrl = globals.mainUrl + globals.apiVersion + globals.refresh_token;
        let response = '';
        let responseJSON;
        let featureURL = globals.mainUrl + globals.apiVersion + globals.refresh_token;
        var data = {
            accessToken: globals.globalVars.AuthAccessToken,
            refreshToken: globals.globalVars.AuthRefreshToken
        };
        secureRequest = buildHeaderWithSignature(globals.mainUrl + globals.apiVersion + globals.refresh_token, JSON.stringify(data), 'POST');
        console.log("featureURL " + featureURL);
        console.log("data " + JSON.stringify(data));

        try {
            console.log("Request Call post with header");
            response = await timeout(globals.timeoutDuration, fetch(featureURL, {
                method: type,
                headers: secureRequest,
                body: JSON.stringify(data)
            }));
            console.log("requestToGetNewToken response " + JSON.stringify(response));
            console.log("response status " + response.status);

            responseJSON = await response.json();
            console.log("requestToGetNewToken responseJSON " + JSON.stringify(responseJSON));

            if (response.status == 200) {
                console.log("requestToGetNewToken onResponse success " + responseJSON.data.token.accessToken);
                AsyncStorage.setItem('@AuthenticateAccessToken:key', responseJSON.data.token.accessToken);
                AsyncStorage.setItem('@AuthenticateRefreshToken:key', responseJSON.data.token.refreshToken);
                AsyncStorage.setItem(globals.token_timeStamp, new Date());
                globals.globalVars.AuthAccessToken = responseJSON.data.token.accessToken;
                globals.globalVars.AuthRefreshToken = responseJSON.data.token.refreshToken;
                onResponse.success(responseJSON);
            } else {
                console.log("requestToGetNewToken onResponse error");
                onResponse.error(responseJSON.description);
            }
            if (onResponse.complete) {
                console.log("requestToGetNewToken onResponse complete");
                onResponse.complete();
            }
        } catch (error) {
            console.log("requestToGetNewToken onResponse catch error " + error);
            if (onResponse.complete) {
                console.log("requestToGetNewToken onResponse catch complete");
                onResponse.complete();
            }
        }
    }
}

function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }