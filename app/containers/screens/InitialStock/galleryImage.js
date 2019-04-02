import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView, Image, TouchableOpacity, Animated, Dimensions, PanResponder, Platform
} from 'react-native';
import styles from './style';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { bindActionCreators } from 'redux';
import imageCacheHoc from 'react-native-image-cache-hoc';
import { changeTheme } from '../../../redux/actions/changeTheme';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import globalStyles from '../../../assets/styles/globalStyles';
import { dashboard, stock } from '../../../assets/images/map'
import { getShowModalSelectBankAccount } from '../../../redux/actions/showModalSelectBankAccount';
import DashboardNewsArticleDetail from './dashboardNewsArticleDetail'
import { CollectSaveQRCodeAsImage } from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import * as globals from '../../../lib/globals';

import categoryNewsArticle from '../Stocks/categoryNewsArticle';
import { ScrollView } from 'react-native-gesture-handler';
const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width
var TAG = "GalleryImage"
const propOverridePlaceholderObject = {
    component: Image,
    props: {
        style: styles.newsDetailTopImageView,
        source: stock.news_placeholder
    }
};

const propOverridePlaceholderObjectTrendingNews = {
    component: Image,
    props: {
        style: styles.dashboardTopTrendingHeaderPlaceHolderImage,
        source: stock.news_placeholder_trending_news
    }
};

const CacheableImage = imageCacheHoc(Image, {
    validProtocols: ['http', 'https'],
    defaultPlaceholder: propOverridePlaceholderObject
});

class GalleryImage extends Component {

    constructor(props) {
        super(props);
        this.position = new Animated.ValueXY()
        this.swipedGalleryImage = new Animated.ValueXY({ x: 0, y: -SCREEN_HEIGHT })
        this.state = {
            galleryImage: [],
        }
    }

    componentWillMount() {
        console.log(TAG + " componentWillMount")
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                console.log("onPanResponderMove")
                if (gestureState.dy > 0) {

                    this.swipedGalleryImage.setValue({
                        x: 0, y: -SCREEN_HEIGHT + gestureState.dy
                    })
                }

                else {
                    // if (this.state.isReverse) {
                    //     this.setState({isReverse: false})
                    // }
                    this.position.setValue({ y: gestureState.dy })
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                console.log("onPanResponderRelease")
                // this.tabbarTop = (globals.iPhoneX) ? new Animated.Value(-88) : new Animated.Value(-64)


                if (gestureState.dy > 1 && gestureState.vy < 10) {
                    console.log("onPanResponderRelease 1")
                    this.closeModal()

                    Animated.timing(this.swipedGalleryImage, {
                        toValue: ({ x: 0, y: 0 }),
                        duration: 100
                    }).start(() => {

                        this.swipedGalleryImage.setValue({ x: 0, y: -SCREEN_HEIGHT })
                    })
                }

                else if (-gestureState.dy > 1 && -gestureState.vy > 0.1) {
                    console.log("onPanResponderRelease 2")
                    this.closeModal()
                    Animated.timing(this.position, {
                        toValue: ({ x: 0, y: -SCREEN_HEIGHT }),
                        duration: 100
                    }).start(() => {

                        this.position.setValue({ x: 0, y: 0 })
                        console.log("RELEASE TWO " + this.state.currentIndex);

                    })
                }

                else {
                    console.log("onPanResponderRelease 3")

                    console.log("RELEASE THREE " + this.state.currentIndex);

                    Animated.parallel([
                        Animated.spring(this.position, {
                            toValue: ({ x: 0, y: 0 })
                        }),
                        Animated.spring(this.swipedGalleryImage, {
                            toValue: ({ x: 0, y: -SCREEN_HEIGHT })
                        })

                    ]).start()


                }

            }
        })
    }


    componentWillReceiveProps(nextProps) {
        // console.log("GALLERY DATA--->" +JSON.stringify(nextProps));
        let images = JSON.parse(nextProps.gallery_data)
        // console.log("GALLERY DATA REAL--->" +JSON.stringify(images));
        // let gallery = images.media;
        this.setState({ galleryImage: images.media })
    }

    closeModal() {
        if (this.props.screen_name == globals.screenTitle_dashboardNewsArticleDetail) {
            DashboardNewsArticleDetail.handleCloseModalWebview()
        }
        else {
            categoryNewsArticle.handleCloseModalWebview()
        }

    }

    renderSwiperGallery() {
        return (
            <View>{
                (Platform.OS == 'android') ?
                    <Animated.View key={1} style={this.position.getLayout()}
                        {...this.PanResponder.panHandlers}
                    >
                        <View style={{ flex: 1, position: 'absolute', height: SCREEN_HEIGHT, width: SCREEN_WIDTH }}>
                            <Swiper >
                                {this.state.galleryImage.map((item, key) => {
                                    console.log("gallery Image items" + JSON.stringify(item))
                                    return (
                                        <View key={key} style={{ flex: 1, backgroundColor: colors.blackColor, alignItems: 'center', justifyContent: 'center' }}>
                                            <CacheableImage style={{ width: '100%', height: 300 }} source={{ uri: (item.url != undefined && item.url != null && item.url != "") ? item.url : '' }} permanent={true} />
                                            {/* <View style={{ width: '100%', height: 320, position: 'absolute', backgroundColor: 'transparent', alignItems: 'flex-end' }}>

                                        </View> */}

                                        </View>
                                    )
                                })}
                            </Swiper>
                        </View>
                    </Animated.View> :
                    <ScrollView onScroll={() => this.closeModal()}>
                    <View style={{ marginTop: 20 }}>
                            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => this.closeModal()}>
                                <EvilIcons name="close-o" style={styles.closeIconModal} size={45} />
                            </TouchableOpacity>
                        </View>
                        <Swiper >
                            {this.state.galleryImage.map((item, key) => {
                                console.log("gallery Image items" + JSON.stringify(item))
                                return (
                                    <View key={key} style={{ flex: 1, backgroundColor: colors.blackColor, alignItems: 'center', justifyContent: 'center' }}>
                                        <CacheableImage style={{ width: '100%', height: 300 }} source={{ uri: (item.url != undefined && item.url != null && item.url != "") ? item.url : '' }} permanent={true} />
                                        {/* <View style={{ width: '100%', height: 320, position: 'absolute', backgroundColor: 'transparent', alignItems: 'flex-end' }}>

                                      </View> */}

                                    </View>
                                )
                            })}
                        </Swiper>
                        
                    </ScrollView>
            }

            </View>
        )
    }

    render() {
        return (

            <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: 'black' }]}>
                {
                    this.renderSwiperGallery()
                }
            </SafeAreaView>


        )
    }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
    console.log("ownProps " + JSON.stringify(state.showModalSelectBankAccount_red));
    console.log("state.showModalSelectBankAccount_red.gallery_data : " + state.showModalSelectBankAccount_red.gallery_data)

    return {
        //    theme: state.changeTheme_red.theme,
        selectBankAccount_modal: state.showModalSelectBankAccount_red.selectBankAccount_modal,
        screen_name: state.showModalSelectBankAccount_red.screen_name,
        marketStatus: state.checkMarketStatus_red.marketStatus,
        open_url: state.showModalSelectBankAccount_red.open_url,
        article_title: state.showModalSelectBankAccount_red.article_title,
        gallery_data: state.showModalSelectBankAccount_red.gallery_data

    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    changeTheme,
    getShowModalSelectBankAccount,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(GalleryImage);