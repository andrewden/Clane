import React, { Component, Fragment } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    WebView,
    ScrollView,
    Dimensions
} from 'react-native';
import styles from './style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTheme } from '../../../redux/actions/changeTheme';
import globalStyles from '../../../assets/styles/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as globals from '../../../lib/globals';
import * as colors from '../../../assets/styles/color';
import Register from './register';
 import Preferences from './preferences';
var themeStyle = null;
// import HTMLView from 'react-native-htmlview';
import HTML from 'react-native-render-html';

 


var html = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="1671.1">
  <style type="text/css">

  h1 { font-size:18px; font-weight: normal; }
  h2 { font-size: 22px; }
    p { margin-bottom:20px; line-height: 22pt;}
     p span { border-bottom: 1px solid #000;}
    .conteiner { width: 980px; margin: 0 auto;}
    ul li {line-height: 26px; padding-bottom: 20px;}

  </style>


</head>
<body>

<div class="conteiner">
<h1>PRIVACY POLICY</h1>


<h2>PRIVACY POLICY FOR CLANE NIGERIA LIMITED</h2>
<p><i>Effective Date:20/11/2018</i></p>

<h2>USER PRIVACY RIGHTS</h2>
<p>This Privacy Policy describes a user’s privacy rights regarding our collection, use, storage,
sharing and protection of personal information. </p>

<p>It applies to the Clane app and all related sites, applications, services and tools regardless of
how they are accessed or used.</p>


<h2>SCOPE AND CONSENT</h2>
<p>As a user, you accept this Privacy Policy when you sign up for, access, or use our products,
services, content, features, technologies or functions offered on our app and all related sites,
applications, and services (collectively referred to as “Clane Services”). </p>

<p>This Privacy Policy is intended to govern the use of Clane Services by users (including,
without limitation those who use these Clane Services in the daily course of their trade,
practice or business) unless otherwise agreed through contract.</p>

<p>We may amend this Privacy Policy at any time by posting a revised version on our app and
webpage. The revised version will become effective as of the published effective date.
Furthermore, if any revised version includes a substantial change in terms, users shall be
informed via a notice posted on the "Policy Updates" page of our app and website.</p>



<h2>COLLECTING PERSONAL INFORMATION</h2>
<p>We collect the following types of personal information in order to provide you with the use
of Clane Services, and to help us personalize and improve your experience. </p>

<p><span>Automatic Information: </span> When you use Clane Services, we collect information sent to us by
your computer, mobile phone or other access device. The information sent to us includes, but
is not limited to, the following: data about the pages you access, computer IP address, device
ID or unique identifier, device type, geo-location information, computer and connection
information, mobile network information, statistics on page views, traffic to and from the
sites, referral URL, ad data, and standard web log data and other information. We also collect
anonymous information through our use of cookies and web beacons.</p>

<p><span>Provided Information: </span>We may collect and store any information you provide us when you
use Clane Services, including when you add information on a web form, add or update your
account information, participate in community discussions, chats, or dispute resolutions, or
when you otherwise correspond with us regarding Clane Services.</p>

<p>When you use Clane Services, we also collect information about your transactions and your
activities. In addition, if you open a Clane account or use Clame Services, we may collect the
following types of information:</p>

<p>Contact information, such as your name, address, phone, email and other similar information.</p>

<p>Financial information, such as the full bank account numbers and/or credit card numbers that
you link to your Clane account or give us when you use Clane Services.</p>

<p>We may also collect information from or about you from other sources, such as your results
when you respond to a survey, your interactions with members of our partner organisations
(subject to their privacy policies and applicable law), and from other accounts we have reason
to believe you control (whether in part or in whole). </p>

<p>Additionally, for quality and training purposes or for its own protection, Clane may monitor
or record its telephone conversations with you (or anyone acting on your behalf. By
communicating with Clane, you acknowledge that your communication may be overheard,
monitored, or recorded without further notice or warning.</p>


<p><span>Third Party Sources: </span>We may also obtain information about you from third parties such as
credit bureaus and identity verification services.</p>

<p>Users may also choose to provide us with access to certain personal information stored by
third parties such as social media sites (e.g., Facebook and Twitter). However, the
information we may receive varies by site and is controlled by that site. By associating a third
party account managed by a third party with your Clane account and authorizing Clane to
have access to this information, you agree that Clane may collect, store and use this
information in accordance with this Privacy Policy.</p>

<p><span>Authentication and Fraud Detection: </span> In order to help protect you from fraud and misuse of
your personal information, we may collect information about you and your interactions with
Clane Services.</p>

<p><span>Mobile Devices: </span> We would offer you the ability to connect with Clane Services using the
Clane mobile app. The provisions of this Privacy Policy apply to all such mobile access and
use of mobile devices.</p>

<p>When you download or use our mobile application, we may receive information about your
location and your mobile device, including a unique identifier for your device. We may use
this information to provide you with location-based services, such as advertising, search
results, and other personalized content. Most mobile devices allow you to control or disable
location services in the device's setting's menu. If you have questions about how to disable
your device's location services, we recommend you contact your mobile service carrier or the
manufacture of your particular device.</p>



<h2>USING PERSONAL INFORMATION</h2>
<p>Clane collects personal information in order to provide users with a secure, smooth, efficient,
and customized experience. Furthermore, the information collected may also be used to:
provide Clane Services and customer support; process transactions and send notices about 
your transactions; verify your identity, including during account creation and password reset
processes; resolve disputes, collect fees, and troubleshoot problems; manage risk, or to
detect, prevent, and/or remediate fraud or other potentially prohibited or illegal activities;
detect, prevent or remediate violations of policies or applicable user agreements; improve the
Clane Services by customizing your user experience; measure the performance of the Clane
Services and improve their content and layout; manage and protect our information
technology infrastructure; provide targeted marketing and advertising, provide service update
notices, and deliver promotional offers based on your communication preferences; contact
you at any telephone number, by placing a voice call or through text (SMS) or email
messaging; perform creditworthiness and solvency checks, and compare information for
accuracy and verify it with third parties. </p>

<p>Additionally we may contact you via electronic means to notify you regarding your account,
to troubleshoot problems with your account, to resolve a dispute, to collect fees or monies
owed, to poll your opinions through surveys or questionnaires, or as otherwise necessary to
service your account. Furthermore, we may contact you to offer coupons, discounts and
promotions, and inform you about Clane Services or its group services.</p>

<p>Finally, we may contact you as necessary to enforce our policies, applicable law, or any
agreement we may have with you. When contacting you via phone, to reach you as efficiently
as possible we may use, and you consent to receive, autodialled or pre-recorded calls and text
messages. Where applicable and permitted by law, you may decline to receive certain
communications.</p>


<h2>MARKETING</h2>
<p>We do not sell or rent your personal information to third parties for their marketing purposes
without your explicit consent. We may combine your information with information we
collect from other companies and use it to improve and personalize Clane Services, content,
and advertising.</p>

<h2>PROTECTION AND SORAGE OF PERSONAL INFORMATION</h2>
<p>Throughout this Privacy Policy, we use the term "personal information" to describe
information that can be associated with a specific person and can be used to identify that
person. We do not consider personal information to include information that has been made
anonymous so that it does not identify a specific user.</p>
<p>We store and process your personal information where our facilities are located. We protect
your information using physical, technical, and administrative security measures to reduce
the risks of loss, misuse, unauthorized access, disclosure and alteration. Some of the
safeguards we use are firewalls and data encryption, physical access controls to our data
centres, and information access authorization controls.</p>

<h2>SHARING PERSONAL INFORMATION WITH OTHER CLANE USERS<</h2>
<p>When transacting with others, we may provide those parties with information about you
necessary to complete the transaction, such as your name, account ID, contact details,
shipping and billing address, or other information needed to promote the reliability and 
security of the transaction. If a transaction is held, fails, or is later invalidated, we may also
provide details of the unsuccessful transaction.</p>

<p>To facilitate dispute resolution eg when you use our Escrow services, we may provide a
buyer with the seller’s address so that goods can be returned to the seller. The receiving party
is not allowed to use this information for unrelated purposes, such as to directly market to
you, unless you have agreed to it. Contacting users with unwanted or threatening messages is
not authorised by Clane..</p>

<p>If someone is sending you money and enters your email address or phone number, we will
provide them your registered name so they can verify they are sending the money to the
correct account.</p>

<p>We work with third parties, including merchants, to enable them to accept or send payments
from or to you using Clane Services. In doing so, a third party may share information about
you with us, such as your email address or mobile phone number, to inform you that a
payment has been sent to you or when you attempt to pay a merchant or third party. We use
this information to confirm that you are a Clane customer and that Clane as a form of
payment can be enabled, or to send you notification of payment status. Also, if you request
that we validate your status as a Clane customer with a third party, we will do so.</p>

<p>If you link your loyalty or gift card of a Clane related merchant to your account, your card
number may be available for your use with that merchant when you pay using Clane
Services.</p>

<p>Please note that merchants, sellers, and users you buy from or contract with have their own
privacy policies, and Clane does not allow the other transacting party to use this information
for anything other than providing Clane Services, Clane is not responsible for their actions,
including their information protection practices.</p>

<p>Notwithstanding, we will not disclose your credit/debit card number or bank account number
to anyone you have paid or who has paid you using Clane Services, or with the third parties
that offer or use Clane Services, except with your express permission or if we are required to
do so to comply with credit/debit card rules, a subpoena, or other legal processes.</p>

<h2>SHARING PERSONAL INFORMATION WITH THIRD PARTIES</h2>
<p>We may share your personal information with:</p>
<ul>
  <li>Members of Clane Company Nigeria Limited to provide joint content, products, and
services (such as registration, transactions and customer support), to help detect and
prevent potentially illegal acts and violations of our policies, and to guide decisions
about their products, services, and communications. Members of the group will use
this information to send you marketing communications only if you have requested
their services. </li>
  <li>Financial institutions that we partner with to jointly create and offer a product. These
financial institutions may only use this information to market Clane related products,
unless you have given consent for other uses. 
</li>
  <li>Credit bureaus and collection agencies to report account information, as permitted by
law. </li>
  <li>Banking partners as required by credit/debit card association rules for inclusion on
their list of terminated merchants. 
</li>
  <li>Companies that we plan to merge with or are acquired by. (Should such a
combination occur, we will require that the new combined entity follow this Privacy
Policy with respect to your personal information. If your personal information could
be used contrary to this policy, you will receive prior notice.) </li>
  <li>Law enforcement, government officials, or other third parties pursuant to a subpoena,
court order, or other legal process or requirement applicable to Clane or one of its
affiliates; when we need to do so to comply with law or credit/debit card rules; or
when we believe, in our sole discretion, that the disclosure of personal information is
necessary to prevent physical harm or financial loss, to report suspected illegal
activity or to investigate violations of our User Agreement. </li>
  <li>Other unaffiliated third parties, for the following purposes:
      <ul>
        <li>Fraud Prevention and Risk Management: to help prevent fraud or assess and
manage risk. 
</li>
        <li>Customer Service: for customer service purposes, including to help service
your accounts or resolve disputes. </li>
        <li>Shipping: in connection with shipping and related services for purchases made
using Clane Services. </li>
        <li> Legal Compliance: to help them comply with anti-money laundering and
counter-terrorist financing verification requirements. </li>
        <li>Service Providers: to enable service providers under contract with us to
support our business operations, such as fraud prevention, bill collection,
marketing, customer service and technology services. Our contracts dictate
that these service providers only use your information in connection with the
services they perform for us and not for their own benefit. </li>
      </ul>
    </li>
    <li>Other third parties with your consent or direction to do so</li>
</ul>

<p>Please note that these third parties may be in other countries where the laws on processing
personal information may be less stringent than in your country.</p>

<h2>CONTACT US ABOUT PRIVACY QUESTIONS AND YOUR INFORMATION</h2>
<p>If you have questions or concerns regarding this Privacy Policy, or you need information
concerning your Personal Information, you should contact us by using the contact
information provided on the Clane app or website.</p>
</div>

</body>
</html>
`


var htmlTerms = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html><head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="1671.1">
  <style type="text/css">

  h1 { font-size:26px; }
  h2 { font-size: 22px; }
    p { margin-bottom:20px; line-height: 22pt;}
     p span { border-bottom: 1px solid #000;}
    .conteiner { width: 980px; margin: 0 auto;}
    ul li {line-height: 26px; padding-bottom: 20px;}
    ol li { list-style-type: none;  line-height: 26px; padding-bottom: 20px; color: #cc0000;}
  </style>


</head>
<body>

<div class="conteiner">
<h1 style="text-align: center">TERMS AND CONDITIONS AGREEMENT</h1>
<p>These terms and conditions are made between the User of the Clane Mobile Application and Clane Company Nigeria Limited, a company duly incorporated under the laws of the Federal Republic of Nigeria and 
the Owner of the Clane Mobile Application (“the Clane App”). The terms and conditions of use (“Terms”) creates a legally binding agreement (“Agreement”) between the User and the Company (“Clane Company Nigeria Limited” or “Clane”). The Company therefore 
insists the User reads the Terms before clicking on the accept bar.In the event that the User has any questions about any of the Terms listed here below, such User may contact Clane at _______ (insert info email) and such queries shall be attended to by Clane.  </p>

<h2>DEFINITIONS AND INTERPRETATION</h2>
<p>These terms are made between Clane Company Nigeria Limited (the Company) and the User to govern the use of the Clane Mobile Application (the Clane App). These Terms of Use create a legally binding 
agreement between User and the Company, the Company therefore insists the User reads the Terms of Use before clicking the accept icon as they affect the User’s legal rights. </p>
<ul style="margin:0; padding:0;">
  <li><strong>“User”</strong> means a user of the Clane App who is a natural person and has accepted this Agreement in order to download and use the Clane App;</li>
  <li><strong>“The App”</strong> means the mobile platform downloadable Clane Mobile Application owned by the Company, including any subsequent updates thereof;</li>
  <li><strong>“Service”</strong> means any products and service feature provided to the User on the App by the Company; </li>
  <li><strong>“Content”</strong> means all information whether text, visual, audio, or otherwise appearing on or available to the User through the App. For the avoidance of doubt, content shall not include advertisements and promotions not sponsored by the Company.</li>
  <li><strong>“Access code, Passcode, Username and Password”</strong> means the enabling code with which you access the system and which is known to the User only.</li>
  <li><strong>“Email Address”</strong> means the User’s email address on the Clane App</li>
  <li><strong>“Third Party Terms of Service”</strong> means terms of service which applies to the use of third party applications and platforms</li>
  <li><strong>Third Party</strong> means any person- natural, corporation- or any platform other than the Parties to this Terms of Use Agreement. For the avoidance of doubt, Third Party shall include Google Play Store, App Store by Apple and any other platform from which the Clane App is available for download. </li>
</ul>
<h2>THE PASSCODE/ACCESS CODE/PASSWORD </h2>
<p>The User understands that his/her Passcode, Access Code/ Password is used to access and give instructions on the Clane App, thus the User undertakes: </p>
<ul style="margin:0; padding:0;">
  <li>That under no circumstances shall the Passcode, Access Code/ Password be disclosed to a Third Party.</li>
  <li>Not to write the Passcode, Access Code/Password in an open place in order to avoid a Third Party coming across same.</li>
  <li>The User instructs and authorizes the Clane App to comply with any instructions given to it through the use of the Service.</li>
  <li>The Clane App is exempted from any form of liability whatsoever for complying with any or all instruction(s) given by means of the User’s Passcode, Access code if by any means the, Access code becomes known to a Third Party.
  </li>
</ul>
<p>Any reference to the singular includes a reference to the plural and vice versa, and any reference to one gender includes a reference to other gender(s), unless explicitly provided for.</p>
<p>Headings and captions are used for convenience only and not for interpretation of the Agreement.</p>
<p>Any reference to a natural person shall, include his/her heirs, executors and permitted assignees and any reference to a juristic person shall, include its affiliates, successors and permitted assignees, unless repugnant to the context.</p>
<h2>USER APPROVAL</h2>
<p>The User accepts and approves this Agreement by: </p>
<ol style="margin:0; padding:0;">
  <li>downloading and/or installing the App on his/her device; or</li>
  <li>accessing or using the App or any of the Services on the App from any device.</li>
</ol>
<p>The User can accept this Agreement only if:</p>
<ol style="margin:0; padding:0;">
  <li>the User is of legal age, eligible and mentally capable of forming a binding contract with Clane pursuant to the use of the App; and</li>
  <li>the User is not legally barred from using the App.</li>
</ol>
<p>The User understands that Clane is not desirous to have a User who does not understand or agree to any or all of the Terms of Use specified in this Agreement. The User is therefore requested to read these Terms and Privacy Policy carefully and understand the Agreement before accepting to be bound by it</p>
<h2>PROVISION OF THE CLANE APP</h2> 
<p>The Clane App is designed to provide the User with the Services. However, it is important for the User to note that; (a) the stock information supplied on the App is not generated by Clane, but sourced from the live updates on the Nigerian Stock Exchange; (b) the Clane App does not per se provide any news, content or information; but provides a brief summary 
of the content available in public domain by aggregating such content 
within one platform for easy access by the User and to assist the User 
in discovering content which correspond with the User’s interest. (c) 
The Clane App does not host, display or transmit any content owned by 
Third Parties on its servers, unless Clane either holds a license or
is not prohibited under the applicable law to do same. </p>

<p>When the User clicks on a news item, the User may be linked to the online 
source of such news item. The User thus agrees and acknowledges that the 
Clane App does not report and/or broadcast any content (including news) 
on its own accord and as such is not responsible or liable for the 
content or accuracy of the content accessed by the User through the 
Clane App. The User further agrees and acknowledges that Clane is not 
a stockbroker, neither does it generate stock data and information 
and shall thus not be liable for content and accuracy of the stock 
information accessed by the User through the App.</p>

<p>The Clane App may include links to other mobile applications and/or 
websites (some of which may be automated search results) which 
may contain objectionable materials, inaccurate or unlawful 
materials. Clane does not endorse or support these links or the 
products and services they provide or advertise; these links are 
provided for the User’s convenience only. Clane is therefore not 
responsible or liable for the content or accuracy of such links.</p> 


<p>In order to make the Clane App available to the User, Clane may 
request the User to register and/or provide information about 
him/herself. Cane trusts and believes that any information provided 
by the User will always be true, accurate, complete and updated.</p>

<p>The content displayed on the Clane App is for the User’s non-commercial 
and personal use. The User is not allowed to copy, reproduce, alter, 
modify, create derivative works of, or publicly display any content 
displayed on the App. 
Clane may stop provision of the App (or any part of the Clane App), 
permanently or temporarily, to Users generally or may modify or change 
the nature of the Clane App and/or these Terms of Use at its sole 
discretion, without any prior notice to the User. The User’s use of 
the Clane App following any such modification constitutes the User’s 
deemed acceptance to be bound by the Agreement (or as it may be modified)</p>

<h2>USER’S COVENANTS</h2>
<p>A violation of this Agreement may result in a legal liability upon the 
User and that nothing in this Agreement shall be construed to confer 
any rights to any Third Party. The User is responsible for his/her 
conduct and activities while using the App, and for any consequences thereof.</p>

<p>Where any provision of this Agreement is found to be unenforceable 
under the applicable law, it will not affect the enforceability of 
the other provisions of this Agreement. If any provision of this 
Agreement is held to be invalid or unenforceable, such provision 
shall be deemed superseded by a valid enforceable provision that 
most closely matches the intent of the original provision and the 
remaining provisions shall be enforced.</p>

<p>Clane may elect not to act with respect to a breach of this Agreement 
by the User or a Third Party, such election does not bar Clane from 
taking action with respect to subsequent or similar breaches. Our 
intended or unintended failure to exercise or enforce any provision 
of this Agreement shall not constitute a waiver of such right or provision</p>

<h2>USE OF THE CLANE APP </h2>

<p>The User shall download and install the Clane App from the Available 
App Store for use. The User shall also download and install the most 
recent versions of the App and any relevant updates provided by Clane 
to enjoy continued access to the App.</p>
<p>While the Clane App is available to the User at no cost, Clane may 
amend the Terms of Use creating a cost for the use and download of 
the App in future. The User understands and acknowledges that Clane 
is not obliged to provide a notice to the User prior to the 
introduction of charges on the Clane App.</p>
<p>The User agrees and acknowledges to use the Clane App only for such 
purposes as is permitted by (a) this Agreement; and (b) any law, 
regulation or generally accepted practices or guidelines applicable 
in the country of which the User is a citizen, in which the User is 
resident or from where the User uses the App.</p>
<p>The User is granted a limited, non-exclusive, non-transferable right 
to install and use the Clane App on a supported device. However, the 
User shall not copy the App or any of its components, except for the 
purpose of making a single archival back up copy. </p>
<p>Clane also grants the User a non-exclusive, non-transferable license 
to access such content on the App which is owned by Clane. The User 
understands and acknowledges that he/she requires a license from a 
Third Party to use access or modify information supplied by the Third 
Party. Clane does not license such content to the User and the User’s 
use of content owned by a Third Party is governed by applicable terms 
and conditions prescribed by such Third Party</p>


<h2>RESTRICTIONS ON THE USE OF THE CLANE APP</h2>
<p>The User shall not use the Clane App or any content provided thereof 
for any illegal, unlawful or such other act or purpose prohibited by 
this Agreement or any applicable law. 
The Use shall not access (or attempt to access) content provided through 
the Clane App by any means other than through the App, unless such User 
has been specifically permitted or licensed to do so in a separate 
written agreement with Clane.</p>

<p>The User shall not redistribute, sublicense, rent, publish, sell, 
assign, lease, market, transfer, or otherwise make the Clane App 
or any component or content thereof, available to Third Parties.</p> 

<p>The User shall not circumvent or disable any digital rights management
,usage rules, or other security features of the Clane App; remove,
alter, or obscure any proprietary notices (including copyright notices)
on any portion of the App; and shall not use the App in a manner which 
threatens or is likely to threaten the integrity, performance, or 
availability of the Clane App.</p>

<p>The User shall not attempt to or engage in any activity that may:</p>
<ol style="margin:0; padding:0;">
  <li> reverse engineer, decompile or otherwise extract the source code related to the Clane App or any part thereof, unless there is a written 
express permission granted by Clane to such User or the act is required 
by the applicable law;</li>
  <li> use any robot, spider, retrieval application, or other device to retrieve or index any portion of the Clane App or content thereof;</li>
  <li> collect information about other Users of the Clane App for any illegal or unlawful purpose;</li>
  <li> create any User accounts by automated means or under false or fraudulent pretences for using the App;</li>
  <li> transmit any viruses, worms, defects, trojan horses, or any items of a destructive nature through the Clane App;</li>
  <li> use the Clane App in any manner that may possibly damage, disable, overburden, impair, or undertake any action which is harmful or potentially harmful to, any of the servers, networks, computer 
  systems or resources connected to any of the servers connected, directly or indirectly to the Clane App, or interfere with any other Third Party's use and enjoyment of the App;</li>
  <li> carry out any denial of service (DoS, DDoS) or any other harmful attacks on the Clane App or; disrupt or place unreasonable burdens or excessive loads on, or interfere with or attempt to make, or attempt any unauthorized access to the App or any part of the App or any user of the App;</li>
  <li> forge headers or otherwise manipulate identifiers in order to disguise the origin of any content transmitted through the Clane App; or</li>
  <li> obtain any materials or information through any means intentionally made unavailable, in the opinion of Clane, through the App</li>
  <li> impersonate another person or impersonate, guide or host on behalf 
of, or falsely state or otherwise misrepresent the User’s affiliation 
with any person or entity, including, but not limited to Clane officials, 
employees, agents, partners, affiliates, dealers and franchisees.</li>
</ol>

<h2>TERMINATION</h2>
<p>The User’s access to the Clane App may be terminated if:</p>
<ol>
  <li> The User voluntarily uninstalls the Clane App from the User’s device;</li>
  <li> The User knowingly or unknowingly causes direct or indirect breach, as ascertained by Clane, of these Terms of Use or Privacy Policy as a whole or in part; or</li>
  <li> The User does not pay the requisite fee, if any, should Clane establish a charge for use of the App.</li>
</ol>

<p>Clane may have to terminate the User’s access to the Clane App if:</p>
<ol style="margin:0; padding:0;">
  <li> Clane is required to do so by law (for example, where the access to and/or provision of the App to the User becomes, unlawful);</li>
  <li> The Third Party, if any, with whom Clane offered the App to the User has terminated its relationship with Clane or ceased to offer the related services to Clane or to the User;</li>
  <li> The provision of App to You, is no longer commercially viable or feasible for Us; or</li>
  <li> The User is a repeat infringer of this Agreement.</li>
</ol>

<p>Clane may terminate this Agreement at any time, with or without notice and may procure disabling the User’s access to the App and/or barring the User from any future use of the App.</p>

<p>The User may terminate this Agreement at any time by terminating his/her access to the App. However, certain obligations of the User under this Agreement shall continue to prevail even upon such termination.</p>
<p>When this Agreement comes to an end, all of the legal rights, obligations and liabilities the User and Clane benefited from, been subject to (or which have accrued over time whilst the Agreement has been in force) or which are expressed to continue indefinitely, shall be unaffected by this cessation, and shall continue to apply to such rights, obligations 
and liabilities indefinitely.</p>


<h2>INTELLECTUAL PROPERTY</h2>
<p>The User’s use of the Clane App is, and at all times shall be, governed by and subject to the laws regarding copyright, trademark, patent, and 
trade secret ownership and use of intellectual property. The User agrees 
to abide by laws regarding copyright, trademark, patent, and trade secret 
ownership and use of intellectual property, and shall be solely responsible 
for any violations of any laws and for any infringements of any intellectual 
property rights caused by the User’s use of the App through the User device.</p>

<p>Clane owns and retains all the intellectual property rights to the 
content made available to the User through the App by Clane but does 
not claim ownership rights to the original sources of information, 
which are instead held by the sites to which the App may link the User to. </p>

<p>All trademarks, brands and service marks of the Clane App are the property 
of Clane only. Clane owns all of the copyrights and database in relation 
to the App.</p>
<p>The Clane App and any underlying technology or software used in connection 
with the App may contain rights of Clane or its affiliates or any Third 
Party. For use of any Third Party’s intellectual property, the User may 
need to obtain permission directly from the owner of the intellectual property.</p>
<p>Any intellectual property which is not specifically mentioned to be 
owned by Clane is owned by their respective owners and the owners have 
a right to take appropriate actions against a User for any violation, 
infringement or passing off.</p>
<p>Clane respects the intellectual property rights of others and does not 
hold any responsibility for any violations of any intellectual property 
rights by any User.</p>

<h2>PRIVACY</h2>
<p>The Clane Privacy Policy explains how Clane treats the personal data 
of Users and protects the privacy of the Users of Clane App. By using 
the App, you agree that We can use such data according to Privacy Policy.</p>
<p>The User is responsible for maintaining the confidentiality of passwords 
associated with any device used to access the App. Accordingly, the User 
is solely responsible for all activities that occur with the User’s device. 
If a User becomes aware of any unauthorized use of his/her device, such User 
is advised to notify the relevant authorities as soon as possible</p>


<h2>LIMITATION OF LIABILITY AND INDEMNIFICATION</h2>
<p>The User’s use of the Clane App or any content available thereof is 
entirely at the User’s own risk and Clane shall not be liable for 
any direct, indirect, incidental, consequential, special, exemplary, 
punitive, monetary or any other damages, fees, fines, penalties or 
liabilities whatsoever arising out of or relating to the use of the 
App by any User.</p>
<p>The User may terminate his/her access to the App if such User is not 
satisfied with the Services on the App. </p>
<p>The User shall defend, indemnify and hold Clane, its officers, directors, 
employees, representatives and agents harmless from and against any 
claims, actions, demands, liabilities, judgments, and settlements, including 
without limitation to reasonable legal fee that may result from or 
alleged to result from (a) The User’s use of the App; or (b) User’s 
breach of any rules, regulations and/or orders under any applicable law.</p>
<p>The User is also responsible for any breach of User obligations under 
the Agreement and/or for the consequences of any such breach</p>


<h2>NO WARRANTIES</h2>
<p>Clane shall make its best efforts to ensure the Clane App is available 
to Users in the best possible manner. However, Clane disclaims all 
warranties in relation to the App, whether express or implied, 
including but not limited to:</p>
<ol style="margin:0; padding:0;">
  <li> the Clane App being constantly available or available at all; </li>
  <li> installation or un-installation choices in relation to the Clane App being successfully executed in all cases; </li>
  <li> that Clane App will always function without disruptions, delay or errors; </li>
  <li> User’s personal ability to use the App; </li>
  <li> User’s satisfaction with the operation of the Clane App; </li>
  <li> the accuracy of the data provided by the App;  </li>
  <li> the security and privacy of User’s data; </li>
  <li> that all bugs or errors in relation to the Clane App will be corrected; </li>
  <li> that the Clane App will be compatible with all devices and all networks; </li>
  <li> that the Clane App is fit for a particular purpose or use; or </li>
  <li> that the Clane App and the contents thereof are accessible in every location. </li>
</ol>

<p>Clane, its officers, directors, employees, affiliates and agents and any other   
service provider responsible for providing access to the App in connection 
with this Agreement will not be liable for any acts or omissions, including 
of a Third Party, and including those vendors participating in Clane’s 
offerings made to Users, or for any unauthorized interception of data or 
breaches of this Agreement attributable in part to the acts or omissions 
of Third Parties, or for damages associated with Clane, or equipment that 
it does not furnish, or for damages resulting from the operation systems, 
equipment, facilities or services provided by Third Parties that are 
interconnected with Clane.</p>

<h2>GOVERNING LAW AND DISPUTE RESOLUTION</h2>
<p>The Clane App may be controlled and operated through any country and 
may be subject to the laws of that country in which they are controlled 
and operated. A User using the App from any location, the User shall be 
responsible for compliance with the local laws applicable to such User. </p>
<p>This Agreement shall be governed by and shall be construed in accordance 
with the laws of Nigeria. All disputes relating to this Agreement shall 
be settled in accordance with the Arbitration and Conciliation Act and 
courts of competent jurisdiction within the Federal Republic of Nigeria 
shall have the power to adjudicate over matters arising from or in 
connection with this Agreement. </p>
<p>The User and Clane agree that any cause of action arising out of the User’s 
use of the App must be commenced within 3 (three) months after the cause 
of action arises or the User becomes aware of the facts giving rise to 
the cause of action, whichever is later. Otherwise, such cause of action 
shall be permanently barred.</p>

<h2>NOTICES</h2>
<p>Clane may post notices within the Clane App or send notices to Users on 
the e-mail address or the telephone number shared with Clane. The User 
shall be deemed to have received notices issued in accordance with the 
provision of this section within 3 (three) days of the notice being sent 
out by Clane. Where the User continues to use the Clane App on the 
expiry of such 3 (three) days of Clane sending the notice shall constitute 
due receipt and acceptance of the notices sent to the User.</p>

<h2>DISCLAIMER</h2>
<p>The contents provided through the Clane App may include technical inaccuracies 
or typographical errors. Clane may make changes or improvements to the App at 
any time. The contents or any information available on the App is provided 
"as is" and “as available” and without warranties of any kind either expressed 
or implied, to the fullest extent permissible pursuant to applicable law. 
Clane does not warrant that the functions contained in the contents will be 
uninterrupted or error-free, that defects will be corrected, or the servers 
that make them available, are free of viruses or other harmful components. 
Clane makes no commitment to update the materials on the interface. 
The above exclusion may not apply to You, to the extent that applicable law may 
not allow the exclusion of implied warranties. Clane shall not be liable for 
any misuse or data theft as a consequence of the User’s use of the App. </p>


<p>THE USER EXPRESSLY REPRESENTS AND WARRANTS THAT HE/SHE SHALL NOT USE THE 
CLANE APP WHERE THE USER DOES NOT UNDERSTAND, AGREE TO BECOME A PARTY TO, 
AND ABIDE BY ALL THE TERMS SPECIFIED IN THIS AGREEMENT. ANY VIOLATION OF 
THIS AGREEMENT MAY RESULT IN LEGAL LIABILITY AGAINST THE USER. NOTHING 
IN THE AGREEMENT SHOULD BE CONSTRUED TO CONFER ANY RIGHTS TO ANY THIRD 
PARTY OR ANY OTHER PERSON</p>

</div>
</body></html>
`



class Agreement extends Component {



    constructor(props) {
        super(props);
        themeStyle = this.props.theme;
        isCategory = this.props.isCategory
        
    }
    componentDidMount(){
        console.log("PROPER AGRRE "+JSON.stringify(this.props));
        // console.log('isCategory :-->' + this.state.isCategory)
    }

    closeModal() {
        if (this.props.isFrom == 'setting' && this.props.isCategory == 'PrivacyPolicy') {
            Preferences.closeAgreement()
            console.log("CALL SETTING");
            
        }
        else if(this.props.isFrom == 'setting' && this.props.isCategory == 'TermsConditions'){
          Preferences.closeTermsCondtions()
          console.log("CALL SETTING");
        }
        else{
            console.log("CALL  REGI");
            Register.closeAgreement()
        }
    }

    
    render() {
        const resourceType = 'base64';
        return (
            <Fragment>
                <SafeAreaView style={{ flex: 0, backgroundColor: colors.blue }} />

                <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: colors.white }]}>
                     <View style={{ backgroundColor: colors.blue, padding: 10, flexDirection: 'row' }}>
                        <TouchableOpacity style={{ justifyContent: 'flex-start', marginLeft: 15, }} onPress={() => this.closeModal()}>
                            <Ionicons name="ios-arrow-back" size={30} color={colors.white} />
                        </TouchableOpacity>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={[styles.headerTitle, { color: colors.white }]}>{(this.props.isCategory == 'PrivacyPolicy') ? globals.screenTitle_PrivacyPolicy : globals.screenTitle_TermsCondition}</Text>
                        </View>
                    </View>  
                     
                    <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, paddingLeft:20, paddingRight:20, paddingBottom:30, marginBottom:(globals.iPhoneX) ? 10 : 0 }}>
                            <HTML html={(this.props.isCategory == 'PrivacyPolicy') ? html : htmlTerms} imagesMaxWidth={Dimensions.get('window').width} />
                    </ScrollView>
                    {/* <WebView
                            source={{ html: html }}
                     /> */}

                    {/* <HtmlText html={html}></HtmlText> */}
                        {/* <PDFView
                            fadeInDuration={250.0}
                            style={{ flex: 1, backgroundColor: colors.white }}
                            resource={resources[resourceType]}
                            resourceType={resourceType}
                            onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
                            onError={() => console.log('Cannot render PDF')}
                        /> */}

                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

 

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
    return {
        theme: state.changeTheme_red.theme,
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    changeTheme,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Agreement);