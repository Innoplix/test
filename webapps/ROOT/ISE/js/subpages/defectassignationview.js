 var defectassignationview = {	
	clusterData1:{"took":6,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":2292,"max_score":1,"hits":[{"_index":"defect_collection","_type":"UCA_Client","_id":"MN00362290","_score":1,"_source":{"title":"Programmed buttons do not function."},"fields":{"description":["Problem Description:  When we program ‘Answer’ and ‘Hangup’ button  on Voip Phone(voip voice: model no.: v654sk and FCC id: DYFV654), and receive a call using programmed ‘Answer’ button then call is not received. Same case with ‘Hangup’ button also.\n\nSetup: UCA 4.0.14, windows: xp\n\nSteps to Reproduce: \n1.Go to admin portal and click the 'Account' tab. \n2.Choose particular user and Enable the checkbox 'User can manage USB device profiles'. Click save.\n3.Start up the UC client with a user mentioned in step#2.\n4.Connect the USB device(voip voice: model no.: v654sk and FCC id: DYFV654) on a system.\n5.Open the Tools->Configuration window.\n6.Click on the 'USB Device Programming' tab.\n7.Select an available USB device and click on the 'Add' button.\n8.Click the 'Apply' button, or the 'OK' button to close the Configuration window.\n    Select the USB device in the list, and click on the 'Configure' button.\n9.Program one or more buttons (like Answer and Hangup) and click 'OK'.\n10Call to that user to check the functionality of programmed button.\n\nExpected Result: \nProgrammed button functionality should work properly.\n\nActual Result: \nProgrammed buttons are not working(programmed answer button and  when call is ringing on that user then click on answer button.Not able to receive call through programmed button).\nSame is the case with Hangup button,call does not hangs by clicking on that button."],"title":["Programmed buttons do not function."]}},{"_index":"defect_collection","_type":"UCA_Client","_id":"MN00362459","_score":1,"_source":{"title":"UCA IFT: 4.0.14.0 - Lines in tray icon menu not showing properly"},"fields":{"description":["The list of lines that appears in the tray client menu show the extension of the EHDU rather than the number like the communications view."],"title":["UCA IFT: 4.0.14.0 - Lines in tray icon menu not showing properly"]}},{"_index":"defect_collection","_type":"UCA_Client","_id":"MN00362480","_score":1,"_source":{"title":"Collaboration types (Web, Audio, Video) disabled on UCA client when starting a conference from the main menu."},"fields":{"description":["Description: Collaboration types (Web, Audio, Video) disabled on UCA client when starting a conference from the main menu.\n\nSetup: UCA 4.0.14.0\nBrowser: IE7\n\nSteps to Reproduce:\n1.Login to UCA client. \n2.From the main menu, click on “Collaboration”, start Instant Conference. \n3.Enter “Topic”.\n\nExpected Behavior: The “web, audio, video” conference checkbox should be enabled.\n\nActual Behavior: The “web, audio, video” conference checkbox is disabled.\n\nPS: We also checked the same scenario by right clicking on a contact and starting collaboration, it worked perfectly fine."],"title":["Collaboration types (Web, Audio, Video) disabled on UCA client when starting a conference from the main menu."]}},{"_index":"defect_collection","_type":"UCA_Client","_id":"MN00362492","_score":1,"_source":{"title":"Error prompt does not disappear even when call is made."},"fields":{"description":["Problem description:While validating DPAR MN00355470,i observed error message is coming and call is made but the error message does not disappears even when call is made.\n\n1.  unplug the ethernet to the AWC server\n2.  click the video presence icon for a contact in the Contact View.\n\nresult: An error message pops-up \"Unknown server fault, Please try again later\" and no audio call is established,would you like to make an audio call.\n\nUser clicks yes,audio call is made but that popup remains there.Find attached the screenshot and logs."],"title":["Error prompt does not disappear even when call is made."]}},{"_index":"defect_collection","_type":"UCA_Client","_id":"MN00362543","_score":1,"_source":{"title":"UCA IFT: 4.0.14.0 - client crashed when changing dynamic status."},"fields":{"description":["Issue reported by user on UCTRIALS.MITEL.COM.\nChanged their dynamic status in use and the UCA client crashed.\nUser ID:  unknown\n\nProduct:  Unified Communicator Advanced 4.0\nVersion:  4.0.14.0\n\nSummary:  \n\nDescription:\nChanging dynamic status to working at home.  Got this error message\n\nFiles attached to the problem report:\nfeedback/20101112173544-unknown/ucc.log.gz\nfeedback/20101112173544-unknown/SipSubscriber.txt.gz\nfeedback/20101112173544-unknown/uca.dmp.gz"],"title":["UCA IFT: 4.0.14.0 - client crashed when changing dynamic status."]}},{"_index":"defect_collection","_type":"UCA_Client","_id":"MN00362562","_score":1,"_source":{"title":"UCA IFT: 4.0.14.0 - placing a video call crashed UCA client."},"fields":{"description":["Reported on UCTRIALS.MITEL.COM\nSummary:  video call with Fred causes my UCA to crash\n\nDescription:\nHappened twice in a row\n\nI had knowledge management for Fred turned on\n\nFiles attached to the problem report:\nfeedback/20101115125044-spence/ucc.log.gz\nfeedback/20101115125044-spence/ucc.log.bak.gz\nfeedback/20101115125044-spence/SipSubscriber.txt.gz\nfeedback/20101115125044-spence/SipSubscriber.txt.1.gz\nfeedback/20101115125044-spence/SipSubscriber.txt.2.gz\nfeedback/20101115125044-spence/SipSubscriber.txt.3.gz\nfeedback/20101115125044-spence/SipSubscriber.txt.4.gz\nfeedback/20101115125044-spence/SipSubscriber.txt.5.gz\nfeedback/20101115125044-spence/uca.dmp.gz\nfeedback/20101115125044-spence/Softphonemanager.log.gz"],"title":["UCA IFT: 4.0.14.0 - placing a video call crashed UCA client."]}},{"_index":"defect_collection","_type":"UCA_Client","_id":"MN00362579","_score":1,"_source":{"title":"Presence not displayed on 53xx for federated contacts"},"fields":{"description":["Program speed dial button for Federated contact (OCS) and enable presence.\n\nPresence is not shown on the 53xx."],"title":["Presence not displayed on 53xx for federated contacts"]}},{"_index":"defect_collection","_type":"UCA_Client","_id":"MN00362581","_score":1,"_source":{"title":"UCA IFT: 4.0.14.0 - UCA crashed on launch"},"fields":{"description":["A Mitel Unified Communicator Advanced user has submitted a problem report.\n\nUser ID:  unknown\n\nProduct:  Unified Communicator Advanced 4.0\nVersion:  4.0.14.0\n\nDescription:\nproblem reporting tool popped up. I don't know why. Two windows are available for input. This one is the standard UCA problem window. The other windows is called \"Promblem Reporting Tool\" and it is hung.\n\n\nFiles attached to the problem report:\nfeedback/20101115100444-unknown/ucc.log.gz\nfeedback/20101115100444-unknown/ucc.log.bak.gz\nfeedback/20101115100444-unknown/SipSubscriber.txt.gz\nfeedback/20101115100444-unknown/SipSubscriber.txt.1.gz\nfeedback/20101115100444-unknown/SipSubscriber.txt.2.gz\nfeedback/20101115100444-unknown/SipSubscriber.txt.3.gz\nfeedback/20101115100444-unknown/SipSubscriber.txt.4.gz\nfeedback/20101115100444-unknown/SipSubscriber.txt.5.gz\nfeedback/20101115100444-unknown/uca.dmp.gz\nfeedback/20101115100444-unknown/Softphonemanager.log.gz"],"title":["UCA IFT: 4.0.14.0 - UCA crashed on launch"]}},{"_index":"defect_collection","_type":"UCA_Client","_id":"MN00363368","_score":1,"_source":{"title":"UCA Soft phone rang Perpetually."},"fields":{"description":["Summary: [IFT] UCA Soft Phone rang Perpetually.\n\nDetails: \n\nThursday, November 18, 2010 12:13 PM\nkwame_musonda@ift-uca.mitel.com\nVersion:  4.0.14.0\n\nUCA Softphone Rang Perpetually\n\nI received a call while I was on a call on my Deskphone. The caller hung up but the UCA app continued to ring for about an hour through my call. It wasn't until I placed a call to the softphone and answered it that the ringing in my speakers stopped. \n\nFiles attached to the problem report:\nfeedback/20101118121321-kwame_musonda/ucc.log.gz\nfeedback/20101118121321-kwame_musonda/ucc.log.bak.gz\nfeedback/20101118121321-kwame_musonda/SipSubscriber.txt.gz\nfeedback/20101118121321-kwame_musonda/SipSubscriber.txt.1.gz\nfeedback/20101118121321-kwame_musonda/SipSubscriber.txt.2.gz\nfeedback/20101118121321-kwame_musonda/SipSubscriber.txt.3.gz\nfeedback/20101118121321-kwame_musonda/SipSubscriber.txt.4.gz\nfeedback/20101118121321-kwame_musonda/SipSubscriber.txt.5.gz\nfeedback/20101118121321-kwame_musonda/SipSubscriber0.txt.gz\nfeedback/20101118121321-kwame_musonda/SipSubscriber1.txt.gz\nfeedback/20101118121321-kwame_musonda/SipSubscriber2.txt.gz\nfeedback/20101118121321-kwame_musonda/SipSubscriber3.txt.gz\nfeedback/20101118121321-kwame_musonda/uca.dmp.gz\nfeedback/20101118121321-kwame_musonda/Softphonemanager.log.gz\n\n\nVersion: 4.0.14.0\n\n\nVersion Type: IFT\n\nPriority:  Level 2"],"title":["UCA Soft phone rang Perpetually."]}},{"_index":"defect_collection","_type":"UCA_Client","_id":"MN00362942","_score":1,"_source":{"title":"Error message is received by user if Phone is answered first (video call)"},"fields":{"description":["Summary: [IFT] UCA There is no clean way to join a video conference if Phone is answered first.\n\nDetails: \n\nTuesday, November 16, 2010 10:50 AM\nmark_strickland@ift-uca.mitel.com\nUnified Communicator Advanced 4.0\n4.0.14.0\n\n1.  There is no clean way to join a video conference if you answer it as a phone call first\n2.  An error message is received by the initiator when the user that answered with the phone joins the video. call.\n\nIf user A initiates a video call to user B and user B answers by picking up his phone there is no clean way for user B to join the video portion.  If user B relized it was a video call and hits the video icon within the active call user B does join a video call.  User A then gets an error message about alreadying being in a call and after the error message user A is is the video call.    \n\nFiles attached to the problem report:\nfeedback/20101116104936-mark_strickland/ucc.log.gz\nfeedback/20101116104936-mark_strickland/ucc.log.bak.gz\nfeedback/20101116104936-mark_strickland/SipSubscriber.txt.gz\nfeedback/20101116104936-mark_strickland/SipSubscriber.txt.1.gz\nfeedback/20101116104936-mark_strickland/SipSubscriber.txt.2.gz\nfeedback/20101116104936-mark_strickland/SipSubscriber.txt.3.gz\nfeedback/20101116104936-mark_strickland/SipSubscriber.txt.4.gz\nfeedback/20101116104936-mark_strickland/SipSubscriber.txt.5.gz\n\n\n\nVersion: 4.0.14.0\n\n\nVersion Type: IFT\n\nPriority:  Level 2"],"title":["Error message is received by user if Phone is answered first (video call)"]}}]},"clusters":[{"id":0,"score":6.5784914939610655,"label":"SipSubscriber.txt.2.gz Feedback","phrases":["SipSubscriber.txt.2.gz Feedback"],"documents":["MN00362543","MN00362562","MN00362581","MN00363368","MN00362942"]},{"id":1,"score":8.451263643574924,"label":"Phone is Answered","phrases":["Phone is Answered"],"documents":["MN00362290","MN00363368","MN00362942"]},{"id":2,"score":8.210304637379238,"label":"Audio","phrases":["Audio"],"documents":["MN00362480","MN00362492"]},{"id":3,"score":12.207320142821517,"label":"Client Crashed","phrases":["Client Crashed"],"documents":["MN00362543","MN00362562"]},{"id":4,"score":11.768442066549085,"label":"Presence","phrases":["Presence"],"documents":["MN00362492","MN00362579"]},{"id":5,"score":21.331485618654977,"label":"Programmed Button","phrases":["Programmed Button"],"documents":["MN00362290","MN00362579"]},{"id":6,"score":14.465040619057786,"label":"Video Conference","phrases":["Video Conference"],"documents":["MN00362480","MN00362942"]},{"id":7,"score":0,"label":"Other Topics","phrases":["Other Topics"],"other_topics":true,"documents":["MN00362459"]}],"info":{"algorithm":"lingo","search-millis":"5","clustering-millis":"61","total-millis":"68","include-hits":"true","max-hits":""}},

	clusterData: {"took":96,"timed_out":false,"_shards":{"total":5,"successful":5,"failed":0},"hits":{"total":93,"max_score":1.3193833,"hits":[{"_index":"test","_type":"test","_id":"6","_score":1.3193833,"fields":{"content":["... complete data mining customer ... Data mining applications, on the other hand, embed ... it, our daily lives are influenced by data mining applications. ..."],"title":["Data Mining Software, Data Mining Applications and Data Mining Solutions"],"url":["http://www.spss.com/data_mining/"]}},{"_index":"test","_type":"test","_id":"44","_score":1.2927263,"fields":{"content":["Data mining terms concisely defined. ... Accuracy is an important factor in assessing the success of data mining. ... data mining ..."],"title":["Two Crows: Data mining glossary"],"url":["http://www.twocrows.com/glossary.htm"]}},{"_index":"test","_type":"test","_id":"55","_score":1.2792994,"fields":{"content":[""],"title":["data mining institute"],"url":["http://www.datamining.org/"]}},{"_index":"test","_type":"test","_id":"35","_score":1.231297,"fields":{"content":["... Sapphire-a semiautomated, flexible data-mining software infrastructure. ... Data mining is not a new field. ... scale, scientific data-mining efforts such ..."],"title":["Data Mining"],"url":["http://www.llnl.gov/str/Kamath.html"]}},{"_index":"test","_type":"test","_id":"84","_score":1.160878,"fields":{"content":["... Walmart, Fundraising Data Mining, Data Mining Activities, Web-based Data Mining, ... in many industries makes us the best choice for your data mining needs. ..."],"title":["Data Mining, Data Mining Process, Data Mining Techniques, Outsourcing Mining Data Services"],"url":["http://www.dataentryindia.com/data_processing/data_mining.php"]}},{"_index":"test","_type":"test","_id":"66","_score":1.1488158,"fields":{"content":["... business intelligence, data warehousing, data mining, CRM, analytics, ... M2007 Data Mining Conference Hitting 10th Year and Going Strong ..."],"title":["Data Mining"],"url":["http://www.dmreview.com/channels/data_mining.html"]}},{"_index":"test","_type":"test","_id":"18","_score":1.1195338,"fields":{"content":["... high performance networking, internet computing, data mining and related areas. ... Peter Stengard, Oracle Data Mining Technologies. prudsys AG, Chemnitz, ..."],"title":["Data Mining Group - DMG"],"url":["http://www.dmg.org/"]}},{"_index":"test","_type":"test","_id":"2","_score":1.1138744,"fields":{"content":["Newsletter on the data mining and knowledge industries, offering information on data mining, knowledge discovery, text mining, and web mining software, courses, jobs, publications, and meetings."],"title":["KDnuggets: Data Mining, Web Mining, and Knowledge Discovery"],"url":["http://www.kdnuggets.com/"]}},{"_index":"test","_type":"test","_id":"7","_score":1.1138744,"fields":{"content":["Commentary on text mining, data mining, social media and data visualization. ... Opinion Mining Startups ... in sentiment mining, deriving tuples of ..."],"title":["Data Mining: Text Mining, Visualization and Social Media"],"url":["http://datamining.typepad.com/data_mining/"]}},{"_index":"test","_type":"test","_id":"71","_score":1.1073165,"fields":{"content":["Data Mining is the automated extraction of hidden predictive information from databases. ... The data mining tools can make this leap. ..."],"title":["Data Mining | NetworkDictionary"],"url":["http://www.networkdictionary.com/software/DataMining.php"]}},{"_index":"test","_type":"test","_id":"23","_score":1.086637,"fields":{"content":["A community about data mining. Tag and discover new products. ... Data Mining (Paperback) Data Mining: Practical Machine Learning Tools and Techniques, Second Edition ..."],"title":["Amazon.com: data mining"],"url":["http://www.amazon.com/tag/data%20mining"]}},{"_index":"test","_type":"test","_id":"39","_score":1.086637,"fields":{"content":["Some example application areas are listed under Applications Of Data Mining ... Crows Introduction - \"Introduction to Data Mining and Knowledge Discovery\"- http: ..."],"title":["Data Mining - Introduction To Data Mining (Misc)"],"url":["http://www.the-data-mine.com/bin/view/Misc/IntroductionToDataMining"]}},{"_index":"test","_type":"test","_id":"22","_score":1.086637,"fields":{"content":["Using data mining functionality embedded in ... Oracle Data Mining JDeveloper and SQL Developer ... Oracle Magazine: Using the Oracle Data Mining API ..."],"title":["Oracle Data Mining"],"url":["http://www.oracle.com/solutions/business_intelligence/data-mining.html"]}},{"_index":"test","_type":"test","_id":"85","_score":1.0831139,"fields":{"content":["Shop for Data Mining V: Data Mining, Text Mining and Their Business Applications : Fifth International Conference on Data Mining (Management Information System) at"],"title":["Data Mining V: Data Mining, Text Mining... [Hardcover] | Target.com"],"url":["http://www.target.com/Data-Mining-Applications-International-Information/dp/1853127299"]}},{"_index":"test","_type":"test","_id":"65","_score":1.0663345,"fields":{"content":["... Website for Data Mining Methods and ... data mining at Central Connecticut State University, he ... also provides data mining consulting and statistical ..."],"title":["DataMiningConsultant.com"],"url":["http://www.dataminingconsultant.com/"]}},{"_index":"test","_type":"test","_id":"36","_score":1.0660828,"fields":{"content":["SQL Server Data Mining Portal ... information about our exciting data mining features. ... CTP of Microsoft SQL Server 2008 Data Mining Add-Ins for Office 2007 ..."],"title":["SQL Server Data Mining > Home"],"url":["http://www.sqlserverdatamining.com/"]}},{"_index":"test","_type":"test","_id":"14","_score":1.0570233,"fields":{"content":["From data mining tutorials to data warehousing techniques, you will find it all! ... Administration Design Development Data Mining Database Training Careers Reviews ..."],"title":["Data Mining and Data Warehousing"],"url":["http://databases.about.com/od/datamining/Data_Mining_and_Data_Warehousing.htm"]}},{"_index":"test","_type":"test","_id":"61","_score":1.0260808,"fields":{"content":["St@tServ Data Mining page ... Data mining in molecular biology, by Alvis Brazma. Graham Williams page. Knowledge Discovery and Data Mining Resources, ..."],"title":["St@tServ - About Data Mining"],"url":["http://www.statserv.com/datamining.html"]}},{"_index":"test","_type":"test","_id":"47","_score":1.0260808,"fields":{"content":["Inductis offers high-level data mining services to assist management decisions ... The Data Mining Shootout ...more>> ISOTech 2006 - The Insurance Technology ..."],"title":["Data Mining | Focused Data Mining For Discovery To Assist Management"],"url":["http://www.inductis.com/"]}},{"_index":"test","_type":"test","_id":"28","_score":1.0260808,"fields":{"content":[""],"title":["itsc data mining solutions center"],"url":["http://datamining.itsc.uah.edu/"]}},{"_index":"test","_type":"test","_id":"27","_score":1.0260808,"fields":{"content":["Data Mining Technology from Megaputer ... Typical tasks addressed by data mining include: ... Yet, data mining requires far more than just machine learning. ..."],"title":["Data Mining Technology - Megaputer"],"url":["http://www.megaputer.com/data_mining.php"]}},{"_index":"test","_type":"test","_id":"15","_score":1.0260808,"fields":{"content":["Oracle Data Mining Product Center ... Using data mining functionality embedded in Oracle Database 10g, you can find ... Mining High-Dimensional Data for ..."],"title":["Oracle Data Mining"],"url":["http://www.oracle.com/technology/products/bi/odm/index.html"]}},{"_index":"test","_type":"test","_id":"3","_score":1.0260808,"fields":{"content":["Data mining is considered a subfield within the Computer Science field of knowledge discovery. ... claim to perform \"data mining\" by automating the creation ..."],"title":["Data mining - Wikipedia, the free encyclopedia"],"url":["http://en.wikipedia.org/wiki/Data-mining"]}},{"_index":"test","_type":"test","_id":"68","_score":1.0168147,"fields":{"content":["Data mining consultancy; services include predictive modeling, consulting, and seminars."],"title":["Data Miners Inc. We wrote the book on data mining!"],"url":["http://www.data-miners.com/"]}},{"_index":"test","_type":"test","_id":"59","_score":1.0157682,"fields":{"content":["datamining2: Data Mining Club - 1600+ members!"],"title":["datamining2 : Data Mining Club - 1600+ members!!"],"url":["http://clubs.yahoo.com/clubs/datamining"]}},{"_index":"test","_type":"test","_id":"48","_score":1.0062535,"fields":{"content":["Provides consulting and short courses in data mining and pattern discovery patterns in data."],"title":["Elder Research: Predictive Analytics & Data Mining Consulting"],"url":["http://www.datamininglab.com/"]}},{"_index":"test","_type":"test","_id":"38","_score":1.0057182,"fields":{"content":["Describes the goals, methodology, and timing of the Data mining project."],"title":["Data mining [OCLC - Projects]"],"url":["http://www.oclc.org/research/projects/mining"]}},{"_index":"test","_type":"test","_id":"13","_score":1.0051084,"fields":{"content":["Data mining is the process of selecting, exploring and modeling large amounts of ... The knowledge gleaned from data and text mining can be used to fuel ..."],"title":["Data Mining Software and Text Mining | SAS"],"url":["http://www.sas.com/technologies/analytics/datamining/index.html"]}},{"_index":"test","_type":"test","_id":"81","_score":0.99466884,"fields":{"content":["Text Mining for Clementine from SPSS enables you to use text data to improve the accuracy of predictive models. ... and about data mining in general. ..."],"title":["Text Mining for Clementine | Improve the accuracy of data mining"],"url":["http://www.spss.com/text_mining_for_clementine/"]}},{"_index":"test","_type":"test","_id":"5","_score":0.99466884,"fields":{"content":["Provides information about data mining also known as knowledge discovery in databases (KDD) or simply knowledge discovery. List software, events, organizations, and people working in data mining."],"title":["Data Mining - Home Page (Misc)"],"url":["http://www.the-data-mine.com/"]}},{"_index":"test","_type":"test","_id":"45","_score":0.99413973,"fields":{"content":["MSHA accident, injury, employment, and production data files in SPSS and dBase formats ... Data files on mining accidents, injuries, fatalities, employment, ..."],"title":["NIOSH Mining: MSHA Data File Downloads | CDC/NIOSH"],"url":["http://www.cdc.gov/niosh/mining/data/"]}},{"_index":"test","_type":"test","_id":"64","_score":0.99413973,"fields":{"content":["Data Mining Institute at UW-Madison ... The Data Mining Institute (DMI) was ... Corporation with the support of the Data Mining Group of Microsoft Research. ..."],"title":["DMI:Data Mining Institute"],"url":["http://www.cs.wisc.edu/dmi/"]}},{"_index":"test","_type":"test","_id":"26","_score":0.99413973,"fields":{"content":["Data Mining or Data Snooping is the practice of searching for relationships and ... up by making a case study in data mining out of the Motley Fools Foolish Four. ..."],"title":["Investor Home - Data Mining"],"url":["http://www.investorhome.com/mining.htm"]}},{"_index":"test","_type":"test","_id":"82","_score":0.9329448,"fields":{"content":["Without data mining, a merchant isnt even close to leveraging what customers want and will buy. ... Data mining is to be found in applications like bio ..."],"title":["Data Mining"],"url":["http://www.open-mag.com/features/Vol_16/datamining/datamining.htm"]}},{"_index":"test","_type":"test","_id":"37","_score":0.9329448,"fields":{"content":["As recently as two years ago, data mining was a new concept for many people. Data mining products were new and marred by unpolished interfaces. ..."],"title":["DBMS - DBMS Data Mining Solutions Supplement"],"url":["http://www.dbmsmag.com/9807m01.html"]}},{"_index":"test","_type":"test","_id":"56","_score":0.9329448,"fields":{"content":["Next Generation Data Mining Tools: Power laws and self-similarity for graphs, ... Parallel session 4 - Hands-on section Data mining with R. Luis Torgo. 1 comment ..."],"title":["Videolectures category: Data Mining"],"url":["http://videolectures.net/Top/Computer_Science/Data_Mining/"]}},{"_index":"test","_type":"test","_id":"63","_score":0.9329448,"fields":{"content":["Data mining is frequently described as &quot;the process of extracting ... Creating a data mining model is a dynamic and iterative process. ..."],"title":["Data Mining Concepts"],"url":["http://msdn2.microsoft.com/en-us/library/ms174949.aspx"]}},{"_index":"test","_type":"test","_id":"25","_score":0.9329448,"fields":{"content":["Data Mining and Knowledge Discovery - A peer-reviewed journal publishing ... In assessing the potential of data mining based marketing campaigns one needs to ..."],"title":["Open Directory - Computers: Software: Databases: Data Mining"],"url":["http://www.dmoz.org/Computers/Software/Databases/Data_Mining/"]}},{"_index":"test","_type":"test","_id":"32","_score":0.9329448,"fields":{"content":["Data Mining Services provide customers with tools to quickly sift through the ... into Datapult Central for use with Data Mining tools and other Datapult products. ..."],"title":["Data Mining"],"url":["http://www.datapult.com/Data_Mining.htm"]}},{"_index":"test","_type":"test","_id":"1","_score":0.9329448,"fields":{"content":["A collection of Data Mining links edited by the Central Connecticut State University ... Graduate Certificate Program. Data Mining Resources. Resources. Groups ..."],"title":["CCSU - Data Mining"],"url":["http://www.ccsu.edu/datamining/resources.html"]}},{"_index":"test","_type":"test","_id":"86","_score":0.9232548,"fields":{"content":["... varying degrees of success, the data mining tools developed thus far, by and ... (a) we should recognize that data mining is a multi-step process, and that (b) ..."],"title":["Data Mining"],"url":["http://www.cs.ubc.ca/~rng/research/datamining/data_mining.htm"]}},{"_index":"test","_type":"test","_id":"67","_score":0.9232548,"fields":{"content":["What is the current state of data mining? The immediate future ... Data Mining is the process of extracting knowledge hidden from large volumes of ..."],"title":["Data Mining"],"url":["http://www.unc.edu/~xluan/258/datamining.html"]}},{"_index":"test","_type":"test","_id":"50","_score":0.9232548,"fields":{"content":["Recognizing outstanding practical contributions in the field of data mining. ... case studies are one of the most discussed topics at data mining conferences. ..."],"title":["Data Mining Case Studies"],"url":["http://www.dataminingcasestudies.com/"]}},{"_index":"test","_type":"test","_id":"17","_score":0.9232548,"fields":{"content":["A long term Knowledge Discovery and Data Mining project which has the current ... Read more about how data mining is integrated into SQL server. Contact Us ..."],"title":["Data Mining Project"],"url":["http://research.microsoft.com/dmx/DataMining/default.aspx"]}},{"_index":"test","_type":"test","_id":"88","_score":0.9227637,"fields":{"content":["Although data mining by itself is not going to get the Celtics to the playoffs, ... then, firms that specialize in data-mining software have been developing a ..."],"title":["Regional Review: Mining Data"],"url":["http://www.bos.frb.org/economic/nerr/rr2000/q3/mining.htm"]}},{"_index":"test","_type":"test","_id":"90","_score":0.9227637,"fields":{"content":["Companion Website for Data Mining Methods and Models ... \"This is an excellent introductory book on data mining. ... An Introduction to Data Mining at Amazon.com ..."],"title":["DataMiningConsultant.com"],"url":["http://www.dataminingconsultant.com/DKD.htm"]}},{"_index":"test","_type":"test","_id":"40","_score":0.9227637,"fields":{"content":["... (BI) to the next level by adding data mining and workflow to the mix. ... Pentaho Data Mining is differentiated by its open, standards-compliant nature, ..."],"title":["Pentaho Commercial Open Source Business Intelligence: Data Mining"],"url":["http://www.pentaho.com/products/data_mining/"]}},{"_index":"test","_type":"test","_id":"52","_score":0.9227637,"fields":{"content":["Book. Data Mining: Practical Machine Learning Tools and Techniques (Second Edition) ... Explains how data mining algorithms work. ..."],"title":["Data Mining: Practical Machine Learning Tools and Techniques"],"url":["http://www.cs.waikato.ac.nz/~ml/weka/book.html"]}},{"_index":"test","_type":"test","_id":"76","_score":0.9227637,"fields":{"content":["\"Web usage mining: discovery and applications of web usage patterns from web data\" ... Patterns and Trends by Applying OLAP and Data Mining Technology on Web Logs. ..."],"title":["E-commerce Technology: Data Mining"],"url":["http://ecommerce.ncsu.edu/technology/topic_Datamining.html"]}},{"_index":"test","_type":"test","_id":"21","_score":0.9227637,"fields":{"content":["Data mining, the extraction of hidden predictive information from large ... prospective analyses offered by data mining move beyond the analyses of ..."],"title":["An Introduction to Data Mining"],"url":["http://www.thearling.com/text/dmwhite/dmwhite.htm"]}},{"_index":"test","_type":"test","_id":"33","_score":0.9227637,"fields":{"content":["SIAM International Conference on Data Mining, co-Sponsored by AHPCRC and ... Clustering High Dimensional Data and its Applications. Mining Scientific Datasets ..."],"title":["SIAM International Conference on Data Mining"],"url":["http://www.siam.org/meetings/sdm02/"]}},{"_index":"test","_type":"test","_id":"83","_score":0.9041201,"fields":{"content":["Association of companies and organizations working to identify \"best in class\" data mining processes through benchmarking studies."],"title":["Benchmarking- Data Mining Benchmarking Association"],"url":["http://www.dmbenchmarking.com/"]}},{"_index":"test","_type":"test","_id":"19","_score":0.9027195,"fields":{"content":["Commentary on text mining, data mining, social media and data visualization. ... Data Mining points to the latest papers from the 3rd International Workshop on ..."],"title":["Data Mining: Text Mining, Visualization and Social Media: The Truth About Blogs"],"url":["http://datamining.typepad.com/data_mining/2006/05/the_truth_about.html"]}},{"_index":"test","_type":"test","_id":"20","_score":0.90093124,"fields":{"content":["Data mining is the analysis of data for relationships that have not previously been discovered. ... Data mining techniques are used in a many research areas, ..."],"title":["What is data mining? - a definition from Whatis.com - see also: data miner, data analysis"],"url":["http://searchsqlserver.techtarget.com/sDefinition/0,,sid87_gci211901,00.html"]}},{"_index":"test","_type":"test","_id":"92","_score":0.88861203,"fields":{"content":["... conducting research in various areas in data mining and other related fields. ... on Data Mining (SDM 08), (full paper), Atlanta, GA, April 2007. ..."],"title":["Data Mining Research Group"],"url":["http://dm1.cs.uiuc.edu/"]}},{"_index":"test","_type":"test","_id":"73","_score":0.88861203,"fields":{"content":["Chapter 4. Data Mining Primitives, Languages, and System Architectures ... Chapter 9. Mining Complex Types of Data ... to Microsofts OLE DB for Data Mining ..."],"title":["Book page"],"url":["http://www.cs.sfu.ca/~han/DM_Book.html"]}},{"_index":"test","_type":"test","_id":"80","_score":0.88861203,"fields":{"content":["2 - Data Mining Functions. 2.1 - Classification. 2.2 - Associations ... 5 - Data Mining Examples. 5.1 - Bass Brewers. 5.2 - Northern Bank. 5.3 - TSB Group PLC ..."],"title":["Data Mining Student Notes, QUB"],"url":["http://www.pcc.qub.ac.uk/tec/courses/datamining/stu_notes/dm_book_1.html"]}},{"_index":"test","_type":"test","_id":"42","_score":0.88861203,"fields":{"content":["data mining software & predictive modeling sold online by statsoft.com. ... of automated and ready-to-deploy data mining solutions for a wide variety of ..."],"title":["Data Mining Software & Predictive Modeling Solutions"],"url":["http://www.statsoft.com/products/dataminer.htm"]}},{"_index":"test","_type":"test","_id":"54","_score":0.88861203,"fields":{"content":["... and business who ask these questions are finding solutions through data mining. ... Data mining is the process of discovering previously unknown relationships in ..."],"title":["SRA International - Data Mining Solutions"],"url":["http://www.sra.com/services/index.asp?id=153"]}},{"_index":"test","_type":"test","_id":"30","_score":0.88861203,"fields":{"content":["The Data Management Exploration and Mining Group (DMX) ... Our research effort in data mining focuses on ensuring that traditional ..."],"title":["Data Management, Exploration and Mining- Home"],"url":["http://research.microsoft.com/dmx/"]}},{"_index":"test","_type":"test","_id":"41","_score":0.88861203,"fields":{"content":["This course approaches data mining topics from an Artificial Intelligence ... The course will also cover Applications and Trends in Data Mining. Textbook: ..."],"title":["Data Mining"],"url":["http://www.unf.edu/~selfayou/html/data_mining.html"]}},{"_index":"test","_type":"test","_id":"58","_score":0.88861203,"fields":{"content":["... the purchases of customers, a data mining system could identify those customers ... A simple example of data mining, often called Market Basket Analysis, ..."],"title":["what is data mining?"],"url":["http://answers.yahoo.com/question/index?qid=20070227091350AAVDlI1"]}},{"_index":"test","_type":"test","_id":"60","_score":0.88861203,"fields":{"content":["The field of data mining draws upon extensive work in areas such as statistics, ... recent results in data mining, including applications, algorithms, software, ..."],"title":["First SIAM International Conference on Data Mining"],"url":["http://www.siam.org/meetings/sdm01/"]}},{"_index":"test","_type":"test","_id":"72","_score":0.88861203,"fields":{"content":["Association Labratory President and CEO Dean West discusses Data Mining and how it can be applied to associations. ... Data Mining Association Forum Dean West ..."],"title":["YouTube - What is Data Mining? - February 19, 2008"],"url":["http://www.youtube.com/watch?v=wqpMyQMi0to"]}},{"_index":"test","_type":"test","_id":"77","_score":0.88861203,"fields":{"content":["... a high-powered analytic warehouse that streamlines the data mining process. ... while building the analytic model using your favorite data mining tool. ..."],"title":["Teradata Data Mining Warehouse Solution"],"url":["http://www.teradata.com/t/page/106002/index.html"]}},{"_index":"test","_type":"test","_id":"10","_score":0.88861203,"fields":{"content":["Details on how to apply to the Master of Science in data mining may be found here. ... All data mining majors are classified for business purposes as part-time ..."],"title":["CCSU - Data Mining"],"url":["http://www.ccsu.edu/datamining/master.html"]}},{"_index":"test","_type":"test","_id":"34","_score":0.88861203,"fields":{"content":["Learn about data mining and knowledge discovery, the process of finding patterns ... Cross Industry Standard Process for Data Mining (CRISP-DM) ..."],"title":["Data Mining in the Yahoo! Directory"],"url":["http://dir.yahoo.com/Computers_and_Internet/Software/Databases/Data_Mining/"]}},{"_index":"test","_type":"test","_id":"8","_score":0.8758148,"fields":{"content":["Outlines the crucial concepts in data mining, defines the data warehousing process, and offers examples of computational and graphical exploratory data analysis techniques."],"title":["Data Mining Techniques"],"url":["http://www.statsoft.com/textbook/stdatmin.html"]}},{"_index":"test","_type":"test","_id":"78","_score":0.87065846,"fields":{"content":["Apa yang bisa dan tidak bisa dilakukan data mining ? ... Iko Pramudiono \"&raquo ... Apa itu data mining ? Iko Pramudiono \"&raquo. artikel lainnya \" tutorial ..."],"title":["Indo Datamining"],"url":["http://datamining.japati.net/"]}},{"_index":"test","_type":"test","_id":"49","_score":0.8473455,"fields":{"content":["Microsoft SQL Server Data Mining helps you explore your business data and discover patterns to reveal the hidden trends about your products, customer, market, and ..."],"title":["Microsoft SQL Server: Data Mining"],"url":["http://www.microsoft.com/sql/technologies/dm/default.mspx"]}},{"_index":"test","_type":"test","_id":"70","_score":0.8473455,"fields":{"content":["Article by Dan Greening on data mining techniques applied to analyzing and making decisions from web data. ... and business analysts use data-mining techniques. ..."],"title":["New Architect: Features"],"url":["http://www.webtechniques.com/archives/2000/01/greening/"]}},{"_index":"test","_type":"test","_id":"31","_score":0.83854455,"fields":{"content":["... a collection of links to publications on the subject of biomedical text mining. Data mining Open Access research - an article in the 8 September 2003 edition of ..."],"title":["BioMed Central | about us | Data mining research"],"url":["http://www.biomedcentral.com/info/about/datamining"]}},{"_index":"test","_type":"test","_id":"46","_score":0.8208647,"fields":{"content":["Objective | Previous Conferences | Call for Abstracts | LATEST INFO ..."],"title":["Salford Data mining 2006"],"url":["http://www.cartdatamining.com/"]}},{"_index":"test","_type":"test","_id":"9","_score":0.8070804,"fields":{"content":["Generally, data mining (sometimes called data or knowledge discovery) is the ... Midwest grocery chain used the data mining capacity of Oracle software to ..."],"title":["<b>answers.yahoo.com</b>/question/index?qid=1006040419333"],"url":["http://answers.yahoo.com/question/index?qid=1006040419333"]}},{"_index":"test","_type":"test","_id":"4","_score":0.8070804,"fields":{"content":["Outlines what knowledge discovery, the process of analyzing data from different perspectives and summarizing it into useful information, can do and how it works."],"title":["Data Mining: What is Data Mining?"],"url":["http://www.anderson.ucla.edu/faculty/jason.frand/teacher/technologies/palace/datamining.htm"]}},{"_index":"test","_type":"test","_id":"89","_score":0.8070804,"fields":{"content":["Verification-Driven Data Mining. Advantages of Symbolic Classifiers. Manual vs. Automatic ... Currently, data mining solutions have been developed by large software ..."],"title":["Discovery and Mining"],"url":["http://www.gusconstan.com/DataMining/index.htm"]}},{"_index":"test","_type":"test","_id":"75","_score":0.8040867,"fields":{"content":["Includes a set of tutorials on many aspects of statistical data mining, including the foundations of probability, the foundations of statistical data analysis, and most of the classic machine learning and data mining algorithms."],"title":["Statistical Data Mining Tutorials"],"url":["http://www.autonlab.org/tutorials"]}},{"_index":"test","_type":"test","_id":"29","_score":0.795735,"fields":{"content":["This article debunks several myths about data mining and presents a plan of action to avoid some of the pitfalls. ... a typical data mining conference or ..."],"title":["Hard Hats for Data Miners: Myths and Pitfalls of Data Mining"],"url":["http://www.dmreview.com/specialreports/20050503/1026882-1.html"]}},{"_index":"test","_type":"test","_id":"16","_score":0.7658771,"fields":{"content":["Conducts research in: scaling algorithms, applications and systems to massive data sets, developing algorithms, applications, and systems for mining distributed data, and establishing standard languages, protocols, and services for data mining and predictive modeling."],"title":["National Center for Data Mining - Welcome"],"url":["http://www.ncdm.uic.edu/"]}},{"_index":"test","_type":"test","_id":"62","_score":0.7538343,"fields":{"content":["Technical journal focused on the theory, techniques, and practice for extracting information from large databases."],"title":["Data Mining and Knowledge Discovery - Data Mining and Knowledge Discovery Journals, Books & Online Media | Springer"],"url":["http://www.springer.com/computer/database+management+&+information+retrieval/journal/10618"]}},{"_index":"test","_type":"test","_id":"74","_score":0.7538343,"fields":{"content":["Dedicated to the development, marketing, sales and support of tools for knowledge discovery to make data mining accessible and easy to use."],"title":["Two Crows data mining home page"],"url":["http://www.twocrows.com/"]}},{"_index":"test","_type":"test","_id":"79","_score":0.7538343,"fields":{"content":["Affymetrix is dedicated to developing state-of-the-art technology for acquiring, analyzing, and managing complex genetic ... The Data Mining Tool (DMT) ..."],"title":["Affymetrix - Data Mining Tool (DMT) (Unsupported - Archived Product)"],"url":["http://www.affymetrix.com/products/software/specific/dmt.affx"]}},{"_index":"test","_type":"test","_id":"43","_score":0.7538343,"fields":{"content":["The Penn Data Mining Group develops principled means of modeling and ... knowledge of specific application areas to develop new approaches to data mining. ..."],"title":["Main Page - Knowledge Discovery"],"url":["http://gosset.wharton.upenn.edu/wiki/index.php/Main_Page"]}},{"_index":"test","_type":"test","_id":"12","_score":0.7538343,"fields":{"content":["Kurt Thearlings site dedicated to sharing information about data mining, the automated extraction of hidden predictive information from databases, and other analytic technologies."],"title":["Data Mining and Analytic Technologies (Kurt Thearling)"],"url":["http://www.thearling.com/"]}},{"_index":"test","_type":"test","_id":"57","_score":0.7534334,"fields":{"content":["WWW2008 - The 17th International World Wide Web Conference - Beijing, China (21 - 25 April 2008) Hosted by Beihang Universit ... data mining, machine ..."],"title":["WWW2008 CFP - WWW 2008 Call For Papers: Refereed Papers - Data Mining"],"url":["http://www2008.org/CFP/RP-data_mining.html"]}},{"_index":"test","_type":"test","_id":"69","_score":0.7534334,"fields":{"content":["Find Data Mining downloads, reviews, and updates for Mac OS X including commercial software, shareware and freeware on VersionTracker.com."],"title":["Data Mining 2.2.2 software download - Mac OS X - VersionTracker"],"url":["http://www.versiontracker.com/dyn/moreinfo/macosx/27607"]}},{"_index":"test","_type":"test","_id":"51","_score":0.74635583,"fields":{"content":["This page describes the term data mining and lists other pages on the Web where you can find additional information. ... Data Mining and Analytic Technologies ..."],"title":["What is data mining? - A Word Definition From the Webopedia Computer Dictionary"],"url":["http://www.webopedia.com/TERM/D/data_mining.html"]}},{"_index":"test","_type":"test","_id":"24","_score":0.73860383,"fields":{"content":["... class of methods known as data mining that assists managers in recognizing ... Data mining is a rapidly growing field that is concerned with developing ..."],"title":["MIT OpenCourseWare | Sloan School of Management | 15.062 Data Mining, Spring 2003 | Home"],"url":["http://ocw.mit.edu/OcwWeb/Sloan-School-of-Management/15-062Data-MiningSpring2003/CourseHome/index.htm"]}},{"_index":"test","_type":"test","_id":"11","_score":0.72554874,"fields":{"content":["About.com article on how businesses are discovering new trends and patterns of behavior that previously went unnoticed through data mining, automated statistical analysis techniques."],"title":["Data Mining: An Introduction"],"url":["http://databases.about.com/od/datamining/a/datamining.htm"]}},{"_index":"test","_type":"test","_id":"91","_score":0.72554874,"fields":{"content":["data mining, civil liberties, civil rights, terrorism, september 11th, anti-terrorism, ashcroft, government intrusion, privacy, email, patriot, american"],"title":["People For the American Way - Data Mining"],"url":["http://www.pfaw.org/pfaw/general/default.aspx?oid=9717"]}},{"_index":"test","_type":"test","_id":"0","_score":0.64343786,"fields":{"content":["Article about knowledge-discovery in databases (KDD), the practice of automatically searching large stores of data for patterns."],"title":["Data mining - Wikipedia, the free encyclopedia"],"url":["http://en.wikipedia.org/wiki/Data_mining"]}},{"_index":"test","_type":"test","_id":"53","_score":0.6156485,"fields":{"content":["Insightful Enterprise Miner - Enterprise data mining for predictive modeling and predictive analytics."],"title":["Predictive Modeling and Predictive Analytics Solutions | Enterprise Miner Software from Insightful Software"],"url":["http://www.datamining.com/"]}},{"_index":"test","_type":"test","_id":"87","_score":0.609397,"fields":{"content":["Currently, there is no widely agreed upon, standard API for data mining. By using JDMAPI, implementers of data mining applications can expose a single, ..."],"title":["The Java Community Process(SM) Program - JSRs: Java Specification Requests - detail JSR# 73"],"url":["http://jcp.org/en/jsr/detail?id=73"]}}]},"clusters":[{"id":0,"score":67.90432639167682,"label":"Knowledge Discovery","phrases":["Knowledge Discovery"],"documents":["2","39","61","3","5","25","17","34","9","4","62","74","43"]},{"id":1,"score":67.88756666577073,"label":"Data Mining Process","phrases":["Data Mining Process"],"documents":["84","13","63","86","67","83","54","77","34","8","4","87"]},{"id":2,"score":67.3760352280613,"label":"Data Mining Applications","phrases":["Data Mining Applications"],"documents":["6","39","85","82","76","33","41","60","16","43","87"]},{"id":3,"score":79.64352222885945,"label":"Data Mining Tools","phrases":["Data Mining Tools"],"documents":["71","23","56","32","86","52","77","74","79"]},{"id":4,"score":37.26280913772393,"label":"Data Mining Conference","phrases":["Data Mining Conference"],"documents":["66","85","50","33","60","46","29","57"]},{"id":5,"score":62.548598238149324,"label":"Data Mining Solutions","phrases":["Data Mining Solutions"],"documents":["6","28","37","42","54","77","89","53"]},{"id":6,"score":56.822030227200486,"label":"Data Mining Research","phrases":["Data Mining Research"],"documents":["48","64","20","92","30","31","16"]},{"id":7,"score":53.56756825217682,"label":"Data Mining Technology","phrases":["Data Mining Technology"],"documents":["18","47","27","76","79","12","51"]},{"id":8,"score":66.35413973573863,"label":"Text Mining","phrases":["Text Mining"],"documents":["2","7","85","13","81","19","31"]},{"id":9,"score":27.494650541147795,"label":"Computer","phrases":["Computer"],"documents":["18","3","25","8","51"]},{"id":10,"score":44.704668556619595,"label":"Predictive Modeling","phrases":["Predictive Modeling"],"documents":["68","81","42","16","53"]},{"id":11,"score":54.293217342001725,"label":"Web Data","phrases":["Web Data"],"documents":["2","76","70","57","51"]},{"id":12,"score":53.360466103071325,"label":"Introduction to Data Mining","phrases":["Introduction to Data Mining"],"documents":["39","90","21","11"]},{"id":13,"score":59.60147169730188,"label":"Oracle Data Mining","phrases":["Oracle Data Mining"],"documents":["18","22","15","9"]},{"id":14,"score":46.69762360980971,"label":"Analysis Techniques","phrases":["Analysis Techniques"],"documents":["20","8","11"]},{"id":15,"score":35.902214773678985,"label":"Association","phrases":["Association"],"documents":["83","80","72"]},{"id":16,"score":47.69027867992707,"label":"Data Mining Tutorials","phrases":["Data Mining Tutorials"],"documents":["14","78","75"]},{"id":17,"score":34.72096258117355,"label":"People","phrases":["People"],"documents":["5","37","91"]},{"id":18,"score":51.64875704632885,"label":"Assist Management","phrases":["Assist Management"],"documents":["47","24"]},{"id":19,"score":43.46471627442212,"label":"Case Studies","phrases":["Case Studies"],"documents":["26","50"]},{"id":20,"score":25.21881011018017,"label":"Central Connecticut State University","phrases":["Central Connecticut State University"],"documents":["65","1"]},{"id":21,"score":51.91078527929316,"label":"Data Mining Institute","phrases":["Data Mining Institute"],"documents":["55","64"]},{"id":22,"score":50.18000640590619,"label":"Data Mining Project","phrases":["Data Mining Project"],"documents":["38","17"]},{"id":23,"score":32.18890347836329,"label":"Downloads","phrases":["Downloads"],"documents":["45","69"]},{"id":24,"score":51.180113855050806,"label":"Microsoft SQL Server","phrases":["Microsoft SQL Server"],"documents":["36","49"]},{"id":25,"score":47.95212660291266,"label":"SIAM International Conference on Data Mining","phrases":["SIAM International Conference on Data Mining"],"documents":["33","60"]},{"id":26,"score":52.80691783465982,"label":"Visualization and Social Media","phrases":["Visualization and Social Media"],"documents":["7","19"]},{"id":27,"score":0.0,"label":"Other Topics","phrases":["Other Topics"],"other_topics":true,"documents":["44","35","59","88","40","73","58","10","0"]}],"info":{"algorithm":"lingo","search-millis":"95","clustering-millis":"139","total-millis":"235","include-hits":"true","max-hits":""}},
	startDate:'',
	endDate:'',
	mainDataArr:{},
	foamtree:null, 
	currentSelectedView:'',
	multiReqSearchArray:'',
	asignationUsersList:[],
	clusterSelectedLabel:'',
	selectedAVCollecLabel:'Defect',
	statusVal:'',
	  /* Init function  */
      init: function()
      {
		console.log("in defectassignationview");
		
		//global variables
		var duplicate;
		var defectTitle;
		var duplicatePercent;
		var executionIDVal;
		var ClusterIDArray;
		var UserIDArray;
		var defectIds;
		
		console.log("clusterData : "+defectassignationview.clusterData);
		defectassignationview._initDefectAssignationView()
		/*$('#clusterResultsTable').dataTable({
                        //"dom": 'frtTip',
						 bSort: false,
           
        "scrollCollapse": true,
        "info":           true,
						 "tableTools": {
                            "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
                        },
                       

                    });*/
					
		/*console.log("SIRI before");
		
				$('#clusterResultsTable').dataTable({
                       "dom": 'frtTip',
                        "tableTools": {
                            "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
                        }

                    });
			
		
				console.log("SIRI after");*/
		
		//date picker
		if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                orientation: "left",
                autoclose: true
            }); 
		}
		
		//get Feature drop down data
		//defectassignationview._setFeaturesData();
		
		
		//get Priority drop down data
		//defectassignationview._setPriorityData();
		
		//get first Execution ID list
		//defectassignationview._setClusterTableData();
		
		//get required cluster value
		var clusterNumber = $('#clusterNumber').val();
			
		$("#page_defectassignationview #startDate").change(function() {
			defectassignationview.startDate = $(this).datepicker("getDate").toISOString();
			
		});
		$("#page_defectassignationview #endDate").change(function() {
			defectassignationview.endDate = $(this).datepicker("getDate").toISOString();
		});
		//on Submit
        $("#submit-Form").click(function(event) {
            //defectassignationview._QueryFormation();
			 defectassignationview._ShowErrorMsg('', false);
			console.log("end callback");
			var requestClusterObject;
			var temp_arr = ['"title":"title"', '"description":"description"'];
			var strTemp = '{'+temp_arr.toString()+'}';
			var strPar = JSON.parse(strTemp)
			var fieldArray =[];
			var fieldmappingObj = new Object();
			for(var gg in strPar){
				fieldArray.push(strPar[gg]);
             fieldmappingObj[gg] = ['fields.'+strPar[gg]]
			}
			String.prototype.replaceAll = function(target, replacement) {
                            return this.split(target).join(replacement);
            };
			var fieldmappingObjStr =  JSON.stringify(fieldmappingObj).replaceAll('{', '').replaceAll('}', '');
			//var fieldArray = ["title", "description"] ;
			//var fieldmappingObj = '"title": ["fields.title"],"content": ["fields.description"],"url": ["fields._id"]';
			var projectName = localStorage.getItem('projectName');                      
			var Searchtxt = "defect";
			var collection_name = $('#collectionsData').find('option:selected').attr('collection-name');
			requestClusterObject = defectassignationview._QueryFormation(fieldArray, Searchtxt, fieldmappingObjStr);
			if(requestClusterObject) 
			ITS._AnalyzeClusterSearch(requestClusterObject,collection_name, projectName, defectassignationview._SearchClusterResponse);
			//defectassignationview._SearchClusterResponse(defectassignationview.clusterData);
		});
		
		//on reset
        $("#resetForm").click(function(event) {
             location.reload();
			//$("#searchPortletBody").load("#defectassignationview");
			//$("#searchPortletBody").load(location.href+" #searchPortletBody>*","");
			//$("#searchPortletBody").toggle().toggle();
		});
		
		/* $('#searchClusterTable #defectAssignationCluster').on('change',function(){
		 var th = $(this), name = th.prop('name'); 
		 if(th.is(':checked')){
			 $(':checkbox[name="'  + name + '"]').not($(this)).prop('checked',false);   
		  }
		}); */
				
		//on Assign
		$("#AssignForm").click(function(event) {
           var clusterSelected = [];		
		   executionIDSelected = defectassignationview.clusterSelectedLabel//$('input[name="execID"]:checked', '#executionIDList').val();
		    $('#clusterTableView input:checkbox:checked').each(function(index) {
				clusterSelected.push($(this).attr('label'));
		   });
		   
		   var userSelected = $('#UsersData').val();
			if(executionIDSelected.length <= 0) {
				$('#users .alert .msg').empty();
				var errorContent = ' Select atleast one execution ID. ';
				$('#users .alert .msg').text(errorContent);
				$('#users .alert').show();
			} else  if (clusterSelected.length <= 0) {
				$('#users .alert .msg').empty();
				var errorContent = ' Select atleast one cluster ID. ';
				$('#users .alert .msg').text(errorContent);
				$('#users .alert').show();
			} else  if (userSelected.length <= 0) {
				$('#users .alert .msg').empty();
				var errorContent = ' Select atleast one User. ';		
				$('#users .alert .msg').text(errorContent);		
				$('#users .alert').show();				
			} else {
				$('#AssignForm').removeAttr("href");
				for(var i=0;i<clusterSelected.length;i++) {
					var projectName = localStorage.getItem('projectName');
					var params = "#&#PARAM1="+executionIDSelected+"#&#PARAM2="+clusterSelected[i]+"#&#PARAM3="+userSelected;
					ISE.clusterUserAssignation("clusterUserAssignation", params, projectName, false, defectassignationview._receivedUserAssignation);
				}
				$('#users .alert').hide()
			}
        });
		
		defectassignationview.foamtree = new CarrotSearchFoamTree({
          id: "inner",
          pixelRatio: window.devicePixelRatio || 1,

          // The "squarified" initializer produces layouts known from FoamTree 2.0.x defaults.
          relaxationInitializer: "squarified",
		  layout: "squarified",
		  
		  groupFillGradientRimSaturationShift: 20,
		  groupFillGradientRimLightnessShift: -15,
		  groupStrokeWidth: 0,
		  attributionPosition: 45,
		  descriptionGroupSize: 0.10,
          descriptionGroupMinHeight: 30,
		  rainbowStartColor:"hsla(173, 80%, 49%, 0.96)",
		  rainbowEndColor:"hsla(220, 100%, 55%, 0.98)",
		  rainbowColorDistribution:"radial",
          // Allow some more time to draw
          finalCompleteDrawMaxDuration: 500,
          finalIncrementalDrawMaxDuration: 500,
		// Disable animations
		  rolloutDuration: 0,
		  pullbackDuration: 0,
          // Disable saturation and lightness corrections introduced in FoamTree 3.0.x.
          rainbowSaturationCorrection: 1,
          rainbowLightnessCorrection: 0,

          // Make the subgroup color variations more subtle, like in FoamTree 2.0.x.
          rainbowLightnessShift: 40,

          // Use FoamTree 2.0.x defaults for group label font and colors.
          groupLabelFontFamily: "Trebuchet MS, Arial, sans-serif",
          groupLabelLightColor: "rgba(255, 255, 255, 0.8)",
          groupLabelDarkColor: "rgba(0, 0, 0, 0.8)",

          // Customize borders, fill and strokes
		  groupBorderWidth: 2,
		  groupInsetWidth: 4,
		  groupBorderRadius: 0.1,
		  groupBorderRadiusCorrection: 1,

		  groupSelectionOutlineWidth: 3.5,

		  groupFillType: "gradient",
		  groupFillGradientRadius: 3,
		  groupFillGradientCenterLightnessShift: 20,

		  groupStrokeWidth: 0.33,
		  groupStrokeType: "plain",
		  groupStrokePlainLightnessShift: -10,
		  
		  // Allow some more time to draw
		  finalCompleteDrawMaxDuration: 500,
		  finalIncrementalDrawMaxDuration: 500,
          // Use FoamTree 2.0.x defaults for the parent group opacity.
          parentFillOpacity: 0.9,

          // For readability, FoamTree 3.0.x introduced a subtle drop shadow
          // around the selection outline and we keep it enabled here.
        
          groupSelectionOutlineShadowSize: 0.5,
          groupSelectionOutlineShadowColor: "#000",

          // FoamTree 3.0.x does not offer a rollout animation similar to
          // the default one known from the 2.0.x line. Below are options
          // for a gentle fading rollout that is similar to the "fadein" rollout
          // type known from FoamTree 2.0.x.
          rolloutStartPoint: "topleft",
          rolloutEasing: "squareInOut",
          rolloutScalingStrength: -0.3,
          rolloutRotationStrength: 0,

          // FoamTree 2.0.x did not offer pullback effects, so we disable them here.
          pullbackDuration: 0,

          // Just in case you'd like to keep the group expose feature introduced
          // in FoamTree 3.0.x, below are the setting that make the expose look
          // good on dark backgrounds.
          groupExposureShadowColor: "#000",
          groupUnexposureLightnessShift: -50,
          groupUnexposureLabelColorThreshold: 0.15,
		  

          // On double click, open the group for browsing instead of exposing it.
          onGroupDoubleClick: function (event) {
            // Prevent the default behavior (expose)
            //event.preventDefault();

            // Open the group instead
            //this.open(event.group);
          }
        });
		
        // Resize FoamTree on orientation change
        window.addEventListener("orientationchange", defectassignationview.foamtree.resize);

        // Resize on window size changes
        window.addEventListener("resize", (function () {
          var timeout;
          return function () {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(defectassignationview.foamtree.resize, 300);
          }
        })());
		
		$('#page_defectassignationview #collectionsData').on('change',function(){
			if($(this).val().length > 0){
				defectassignationview._setFeaturesData($(this).val());
				defectassignationview.selectedAVCollecLabel = $(this).find("option:selected").text();
				if($(this).val()=="testcases"){
					defectassignationview.statusVal = 'state';
					defectassignationview._setPriorityData($(this).val(), defectassignationview.statusVal);
				}else{
					defectassignationview.statusVal = 'status';
					defectassignationview._setPriorityData($(this).val(), defectassignationview.statusVal);
					
				}
			}
		});
		
      },
	  _initDefectAssignationView: function (){
		//Calling data for 'defect collection'
		var collection_name = $('#collectionsData').find('option:selected').attr('value');
		defectassignationview._setFeaturesData(collection_name);
		defectassignationview.statusVal = 'status';
		defectassignationview._setPriorityData(collection_name, defectassignationview.statusVal);
	  },
	  // Handles custom checkboxes & radios using jQuery Uniform plugin
		_handleUniform: function() {
			if (!$().uniform) {
				return;
			}
			var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)");
			if (test.size() > 0) {
				test.each(function() {
					if ($(this).parents(".checker").size() === 0) {
						$(this).show();
						$(this).uniform();
					}
				});
			}
		},
	  _SearchClusterResponse: function(dataObj){
		  Pace.stop();
		  //console.log("HHHH : "+dataObj);
		defectassignationview.clusterData = dataObj;
		if(defectassignationview.clusterData.clusters.length > 0){
			//create clusters
			$('#searchClusterTable .portlet-body .dataTables_scrollBody').empty();
			var clusterConatinersHolder = defectassignationview._initClusterRendere();
			$('#searchClusterTable .portlet-body .dataTables_scrollBody').append(clusterConatinersHolder);
			defectassignationview._handleUniform();
			$("#users").show();
			$("#searchClusterTable > .red-intense > .portlet-title > .caption").empty().html('<i class="fa fa-globe"></i>'+defectassignationview.selectedAVCollecLabel+' Cluster');
			$(".show-more a").on("click", function() {
				var $link = $(this);
				var $content = $link.parent().prev("div.tab-content");
				var linkText = $link.text();

				$content.toggleClass("short-text, full-text");
				//$content.switchClass("short-text", "full-text", 400);
				$link.text(getShowLinkText(linkText));

				return false;
			});

			function getShowLinkText(currentText) {
				var newText = '';

				if (currentText.toUpperCase() === "SHOW MORE") {
					newText = "Show less";
				} else {
					newText = "Show more";
				}

				return newText;
			}
			
			defectassignationview._initParseClusterData();
			defectassignationview._initGetAssigneeData();
			
			$("#searchClusterTable #viewTable").on("click", function() {
			if(defectassignationview.clusterData.clusters.length > 0)
				$("#users").show();
				
			$("#searchClusterTable #clusterGraphView").hide();
			$("#searchClusterTable #clusterTableView").show();
			$(this).css("border-color", "#32c5d2");
			$("#searchClusterTable #viewGraph").css("border-color", "#f3baba");
			defectassignationview.currentSelectedView = 'tableView';
		});
		$("#searchClusterTable #viewGraph").on("click", function() {
			
				$("#users").hide();
				$("#searchClusterTable #clusterGraphView").show();
				$("#searchClusterTable #clusterTableView").hide();
				  
				$(this).css("border-color", "#32c5d2");
				$("#searchClusterTable #viewTable").css("border-color", "#f3baba");
				if(defectassignationview.mainDataArr.groups.length > 0){
				  //assign Data to Foam Tree
					defectassignationview.foamtree.set("dataObject", defectassignationview.mainDataArr);
					defectassignationview.currentSelectedView = 'graphView';
				}
			  
		});
		$('#searchClusterTable #uniform-defectAssignationCluster input').on('change',function(){
		 var th = $(this), name = th.prop('name');
		 defectassignationview.clusterSelectedLabel = th.attr('label');
		 if(th.is(':checked')){
			 $(':checkbox[name="'  + name + '"]').not($(this)).prop('checked',false);
			 $(':checkbox[name="'  + name + '"]').parent().not($(this).parent()).removeClass('checked');
			 defectassignationview._fillDevelopercombo(defectassignationview.clusterSelectedLabel)
			 //$("#users").show();
		  }else{
			// $("#users").hide();
		  }
		  $('#users .alert').hide();	
		});
		}else{
			$("#users").hide();
			var defectNoDataContent="<b>No Data to show</b>";
			 //$('#page_itsanalyzesearch #defectTableHeader').last().append(defectTableHeaderContent);
			 $('#searchClusterTable .portlet-body .dataTables_scrollBody').empty();
			 $('#searchClusterTable .portlet-body .dataTables_scrollBody').append(defectNoDataContent);
			 defectassignationview.mainDataArr = {};
		}
		
		if(defectassignationview.currentSelectedView == 'graphView'){
			defectassignationview.foamtree.set("dataObject", defectassignationview.mainDataArr);
			$("#users").hide();
			//$("#searchClusterTable #viewTable").css("border-color", "#f3baba");
			//$("#searchClusterTable #viewGraph").css("border-color", "#32c5d2");
		}else{
			$("#searchClusterTable #viewTable").css("border-color", "#32c5d2");
			$("#searchClusterTable #clusterGraphView").hide();
		}
		
	  },
	  _fillDevelopercombo: function(selected_label){
		  var selectedClusterDeveloperList = []
		if(selected_label.length>0){
			for(var i=0; i<defectassignationview.asignationUsersList.length; i++){
				if(selected_label == defectassignationview.asignationUsersList[i].name)
				selectedClusterDeveloperList = defectassignationview.asignationUsersList[i];
			}
			$("#UsersData").empty();
			var optionTxt = '<option value="">Select...</option>'
			if(selectedClusterDeveloperList.asigneelist){
				for(var j=0; j<selectedClusterDeveloperList.asigneelist.length; j++){
					 optionTxt += '<option value="'+selectedClusterDeveloperList.asigneelist[j].key+'">'+selectedClusterDeveloperList.asigneelist[j].key+'</option>'
				}
			}
			$("#UsersData").append(optionTxt);
		}
		  
	  },
		_initClusterRendere: function(){
			var clu_col = '';
			var c_clu_col='';
			var titleLen = 130;
			var headingTitleLen = 150;
			for(var i=0; i< defectassignationview.clusterData.clusters.length; i++){
					var heading_text = defectassignationview.clusterData.clusters[i].label;
					/* var subStrHeadingTitle = '';
						if(heading_text.length > headingTitleLen) 
							subStrHeadingTitle = heading_text.substring(0, headingTitleLen)+'...';
						else 
							subStrHeadingTitle = heading_text; */
					subStrHeadingTitle = ISEUtils.trunc(headingTitleLen,heading_text, "string" );
					c_clu_col += '<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12"><div class="portlet box blue"> <div class="portlet-title"> <div class="caption" title="'+heading_text+'"> <i class="glyphicon glyphicon-th"></i>'+ subStrHeadingTitle +'</div><div class="tools"> <input type="checkbox" label="'+heading_text+'" name="defect_assignation_cluster" id="defectAssignationCluster" value=""> <a href="javascript:;" class="collapse" data-original-title="" title=""> </a> </div></div><div class="portlet-body tabs-below" style=""> <div class="tab-content short-text"><div id=cluster_tab_'+defectassignationview.clusterData.clusters[i].id+'>[cluster__Data]</div></div>[show_more_include]</div></div></div>';
					
					var clus_list_data="";
					for(var j=0; j<defectassignationview.clusterData.clusters[i].documents.length; j++){
						var title_txt = defectassignationview._getClusterTitle(defectassignationview.clusterData.clusters[i].documents[j]);
						var subStrTitle = ISEUtils.trunc(titleLen,title_txt, "string" );
						var crNumbtitleLen = 80;
						var crNumberTxt = defectassignationview.clusterData.clusters[i].documents[j];
						var subcrNumberTxt = ISEUtils.trunc(crNumbtitleLen,crNumberTxt, "string" );
						
						clus_list_data += '<label value='+defectassignationview.clusterData.clusters[i].documents[j]+' ><a title="'+crNumberTxt+'" data-target="#stack2" data-toggle="modal" id="'+defectassignationview.clusterData.clusters[i].documents[j]+'" onclick="defectassignationview._onDefectViewModal(this);">'+subcrNumberTxt+'</a><span style="padding-left: 10px;" title="'+title_txt+'">'+subStrTitle+'</span></label>';
					}
					console.log("KJKJ :"+defectassignationview._visualHeight(clus_list_data));
					if(defectassignationview._visualHeight(clus_list_data) )
						c_clu_col = c_clu_col.replace('[show_more_include]', '<div class="show-more"><a href="javascript:;">Show more</a></div>');
					else
						c_clu_col = c_clu_col.replace('[show_more_include]', '<div class="show-more" style="visibility: hidden;"><a href="javascript:;">Show more</a></div>');
						
					c_clu_col = c_clu_col.replace('[cluster__Data]', clus_list_data);
					
			}
			
			return clu_col = '<div class="row clusters-list">'+c_clu_col+'</div>';
		},
		_visualHeight:function(str){
			
			var pruler = document.createElement('div');
			pruler.className = 'short-text';
			var ruler = document.createElement('div');
			ruler.style.visibility = 'hidden';
			//ruler.style.lineHeight = '1';
			//ruler.style['white-space'] = 'nowrap';
			//ruler.className = 'well';
			pruler.appendChild(ruler);
			document.body.appendChild(pruler);
			
			ruler.innerHTML = str;
			var c = ruler.children;
		
			for (i = 0; i < c.length; i++) {
				c[i].style.display = "block";
				c[i].style.lineHeight = '1'
			}
			var l = ruler.offsetHeight;
			var p = pruler.offsetHeight;
			document.body.removeChild(pruler);
			if(l>p)
				return true;
			else
				return false;        
		},
		
		_visualWidth:function(str){
			
			var pruler = document.createElement('div');
			//pruler.className = 'short-text';
			//var ruler = document.createElement('div');
			pruler.style.visibility = 'hidden';
			//ruler.style.lineHeight = '1';
			//ruler.style['white-space'] = 'nowrap';
			//ruler.className = 'well';
			//pruler.appendChild(str);
			document.body.appendChild(pruler);
			
			pruler.innerHTML = str;
			 
			var l = pruler.offsetWidth;
			 
			document.body.removeChild(pruler);
			 
			return l;        
		},
		_initParseClusterData:function(){
			var modifiedClusterData = new Object();
			var mDataArr = [];
			for(var i=0; i<defectassignationview.clusterData.clusters.length; i++){
				var cdataArr = [];
				for(var j=0; j<defectassignationview.clusterData.clusters[i]['documents'].length; j++){
					var __cobject = new Object();
					__cobject.label = defectassignationview._getClusterTitle(defectassignationview.clusterData.clusters[i].documents[j]);
					__cobject.id = defectassignationview.clusterData.clusters[i].documents[j];
					cdataArr.push(__cobject);
					//modifiedClusterData
				}
				//var __object = new Object();
				//__object.groups = cdataArr;
				var __mobject = new Object();
				__mobject.label = defectassignationview.clusterData.clusters[i]['label'];
				__mobject.weight = defectassignationview.clusterData.clusters[i]['score'];
				__mobject.id = defectassignationview.clusterData.clusters[i]['id'];
				__mobject.groups = cdataArr;
				mDataArr.push(__mobject);
			}
			var __object = new Object();
			__object.groups = mDataArr;
			defectassignationview.mainDataArr = __object;
	    },
		
		_initGetAssigneeData: function(){
			defectassignationview.multiReqSearchArray = "";
			var projectName = localStorage.getItem('projectName');
			 for(var i=0; i< defectassignationview.clusterData.clusters.length; i++){
				var heading_text = defectassignationview.clusterData.clusters[i].label;
				var collection_name = $('#collectionsData').find('option:selected').attr('collection-name');
				defectassignationview.multiReqSearchArray += '{"index":"'+collection_name+'","type":"'+projectName+'"},\n'
				if((projectName).toLowerCase() == "ise")
					defectassignationview.multiReqSearchArray +='{"query":{"filtered":{"query":{"match_all":{}},"filter":{"query":{"query_string":{"query":"'+heading_text+'","default_operator":"OR"}}}}},"aggregations":{"prifeaturebucket":{"terms":{"field":"assignedto","size":5}}}},\n';
				else 
					defectassignationview.multiReqSearchArray +='{"query":{"filtered":{"query":{"match_all":{}},"filter":{"query":{"query_string":{"query":"'+heading_text+'","default_operator":"OR"}}}}},"aggregations":{"prifeaturebucket":{"terms":{"field":"updated by","size":5}}}},\n';
			} 
		
			/*defectassignationview.multiReqSearchArray = '{"index":"defect_collection","type":"UCA_Client"},\n'
			+'{"query":{"filtered":{"query":{"match_all":{}},"filter":{"query":{"query_string":{"query":"Defect","default_operator":"OR"}}}}},"aggregations":{"prifeaturebucket":{"terms":{"field":"updated by","size":5}}}},\n'
+'{"index":"defect_collection","type":"UCA_Client"},\n'+'{"query":{"filtered":{"query":{"match_all":{}},"filter":{"query":{"query_string":{"query":"Upload","default_operator":"OR"}}}}},"aggregations":{"prifeaturebucket":{"terms":{"field":"updated by","size":5}}}}';*/
			
			var requestObject = {};
			requestObject.body = [defectassignationview.multiReqSearchArray];
			
			ITS._MultiAnalyzeAssignationUserSearch(requestObject, defectassignationview._GetAssigneeDataSerachResponse);
		},
		
	  _getClusterTitle: function(cluster_id) {
		for(var i=0; i<defectassignationview.clusterData.hits.hits.length; i++){
			if(cluster_id == defectassignationview.clusterData.hits.hits[i]._id)
				return defectassignationview._strip(defectassignationview.clusterData.hits.hits[i].fields.title[0]);
		}
      },
	  _GetAssigneeDataSerachResponse:function(data){
		  console.log("_GetAssigneeDataSerachResponse : "+data);
		   for(var i=0; i< defectassignationview.clusterData.clusters.length; i++){
			   var __obj = new Object();
			   __obj.name = defectassignationview.clusterData.clusters[i].label
			   __obj.asigneelist = data.responses[i].aggregations.prifeaturebucket.buckets;
			   defectassignationview.asignationUsersList.push(__obj);
		   }
		   console.log( defectassignationview.asignationUsersList)
		  
	  },
	  
	  receivedUserAssignation: function(data) {
			console.log("@_receivedUserAssignation");
      },
	  	  
	  _setClustersDetails: function() {
			defectassignationview._setDistinctExecutionID();
			var projectName = localStorage.getItem('projectName');
		   	var executionID = defectassignationview.executionIDVal;
			var params=[];
			params[0]='PARAM1='+executionID;
           ISE.clustersDetail("duplicateBugReport", params, projectName, false, defectassignationview._receivedClustersDetails);
	 },
	
	 _setDistinctExecutionID: function() {
		  var projectName = localStorage.getItem('projectName');
		  ISE.executionID("distinctExecutionID", "", projectName, false, defectassignationview._receivedExecutionID);
	 },
	
	_receivedExecutionID: function(data) {
			console.log(data);
			var selectExecutionID = $('#executionIDList');
			selectExecutionID.empty();
			var newOptionContent = '';
			console.log("********"+defectassignationview.executionIDVal);
			var eData1 = "";
			if(defectassignationview.executionIDVal != undefined) {
				eData1 = defectassignationview.executionIDVal;
				var eDatadate1 = new Date(eData1);
				console.log(eDatadate1);
				var eDatamonth1 = eDatadate1.toString().split(" ")[1]
					//alert(d1+" "+d.getDate()+" "+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
				var eDatadisplay1 = eDatamonth1 +" "+eDatadate1.getDate()+" "+eDatadate1.getFullYear()+" "+eDatadate1.getHours()+":"+eDatadate1.getMinutes()+":"+eDatadate1.getSeconds();
				
				var newOptionContentAll ='<label><input type="radio" name="execID" id="execID" checked value="'+defectassignationview.executionIDVal+'" onclick="defectassignationview._onexecutionidchange(this);">'+eDatadisplay1 +'</label>'
				selectExecutionID.append(newOptionContentAll);
			} else {
				console.log(data[0].ExecutionID[0]);
				eData1 = data[0].ExecutionID[0];
				var eDatadate1 = new Date(Number(eData1));
				console.log(eDatadate1);
				var eDatamonth1 = eDatadate1.toString().split(" ")[1]
					//alert(d1+" "+d.getDate()+" "+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
				var eDatadisplay1 = eDatamonth1 +" "+eDatadate1.getDate()+" "+eDatadate1.getFullYear()+" "+eDatadate1.getHours()+":"+eDatadate1.getMinutes()+":"+eDatadate1.getSeconds();
				
				var newOptionContentAll ='<label><input type="radio" name="execID" id="execID" checked value="'+eData1+'" onclick="defectassignationview._onexecutionidchange(this);">'+eDatadisplay1 +'</label>'
				selectExecutionID.append(newOptionContentAll);
			}
			executionIDLen = 10;
			if(data.length < 10) {
				executionIDLen = data.length;
			}
			for(var i=1; i<executionIDLen; i++) {
				var eData = data[i].ExecutionID;
				var eDatadate = new Date(Number(eData));
				var eDatamonth = eDatadate.toString().split(" ")[1]
				//alert(d1+" "+d.getDate()+" "+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
				var eDatadisplay = eDatamonth +" "+eDatadate.getDate()+" "+eDatadate.getFullYear()+" "+eDatadate.getHours()+":"+eDatadate.getMinutes()+":"+eDatadate.getSeconds();
				if(Number(eData) != eData1) {
					newOptionContent = '<label><input type="radio" name="execID" id="execID" value="' 
					newOptionContent += eData + '" onclick="defectassignationview._onexecutionidchange(this);">'+eDatadisplay + '</label>';
					selectExecutionID.last().append(newOptionContent);
				}
			}
			$('#execID').removeClass("hide");

     },
	 
	 _onexecutionidchange: function(data) {
			console.log(data);
			console.log(data.value);
			var projectName = localStorage.getItem('projectName');
			var executionID = data.value;
			var params=[];
			params[0]='PARAM1='+executionID;
			ISE.clustersDetail("duplicateBugReport", params, projectName, false, defectassignationview._receivedClustersDetails);
	},
  
	
	_receivedClustersDetails: function(data) {
		if(data.length > 0) {
		var ExecutionIDArray = new Array();
		var ClusterIDArray = new Array();
		var DefectIDArray = new Array();
		var duplicateIDArray = new Array();
		var UserIDArray = new Array();
		var defectTitleArray = new Array();
		for(var i=0; i<data.length; i++){
			ExecutionIDArray.push(data[i].ExecutionID);
			ClusterIDArray.push(data[i].clusterID);
			DefectIDArray.push(data[i].DefectID);
			duplicateIDArray.push(data[i].duplicate);
			UserIDArray.push(data[i].User);
		}
		var str = "";
		var defectIds = new Array();
		for(var i=0; i<DefectIDArray.length;i++){
			str = DefectIDArray[i].toString();
			var outString = str.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '');
			var projectName = localStorage.getItem('projectName');
			defectIds[i] = outString.split(',');
		}
		
		
		var searchStrDef = "";
		for(var i=0;i<ClusterIDArray.length;i++) {
		
			for(var j=0;j<defectIds[i].length;j++) {
			
				console.log(defectIds[i][j].toString());
				searchStrDef += "_id:"+defectIds[i][j].toString()+" ";
				
			}
		
			
		
		}
		defectassignationview.defectIds = defectIds;
		console.log(searchStrDef);
		var requestObject = new Object();  
            requestObject.collectionName = $('#collectionsData').find('option:selected').attr('collection-name');;
            requestObject.projectName = projectName;
            requestObject.searchString = searchStrDef;
            requestObject.maxResults = 25;                    
            defectTitleArray[i] = ISE.getSearchResults(requestObject, defectassignationview._receivedDefectTitleResults);  
		
		
		var str1 = "";
		var duplicates = new Array();
		for(var i=0; i<DefectIDArray.length;i++){
			str1 = duplicateIDArray[i].toString();
			var outString = str1.replace(/[`~!@#$%^&*()_|+\-=?;'"<>\{\}\[\]\\\/]/gi, '');
			duplicates[i] = outString.split(',');
		}
		var str2 = "";
		var duplicatesPercent = new Array();
		for(var i=0; i<duplicates.length;i++) {
			for(j=0,k=0;j<duplicates[i].length;j++,k++) {
				var tempVar = duplicates[i][j].toString();
					if (/^[a-zA-Z0-9- ]*$/.test(tempVar) == false) {
						duplicates[i][j] = tempVar.substring(0, tempVar.indexOf(':'));
					}
					/*var percent = tempVar.split(':');
					var colon = '';
					if(percent.length > 1)
							colon = percent[1];
					duplicatesPercent.push(colon);*/
			}
		}
			
		defectassignationview.duplicate = duplicates;
			
		defectassignationview.ClusterIDArray = ClusterIDArray;
		defectassignationview.duplicatePercent = duplicatesPercent;
		defectassignationview.UserIDArray = UserIDArray;
		} else {

			$('#clusterResultsTableBody').empty();
			var newRowContentEmpty = '<tr><td>';
			newRowContentEmpty += '<table><tr><td>Some Error Occurred at backend. Please try with less number of Required Clusters.</td></tr></table>';
			newRowContentEmpty += '</td></tr>';
			$('#clusterResultsTableBody').last().append(newRowContentEmpty);
		}
		ISEUtils.portletUnblockingCluster("pageContainer");
	
	},
  
	
	_receivedDefectTitleResults: function(data) {
		/*if(data.length > 0) {
		var ExecutionIDArray = new Array();
		var ClusterIDArray = new Array();
		var DefectIDArray = new Array();
		var duplicateIDArray = new Array();
		var UserIDArray = new Array();
		var defectTitleArray = new Array();
		for(var i=0; i<data.length; i++){
			ExecutionIDArray.push(data[i].ExecutionID);
			ClusterIDArray.push(data[i].clusterID);
			DefectIDArray.push(data[i].DefectID);
			duplicateIDArray.push(data[i].duplicate);
			UserIDArray.push(data[i].User);
		}
		var str = "";
		var defectIds = new Array();
		for(var i=0; i<DefectIDArray.length;i++){
			str = DefectIDArray[i].toString();
			var outString = str.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '');
			var projectName = localStorage.getItem('projectName');
			defectIds[i] = outString.split(',');
		}
		
		
		var searchStrDef = "";
		for(var i=0;i<ClusterIDArray.length;i++) {
		
			for(var j=0;j<defectIds[i].length;j++) {
			
				console.log(defectIds[i][j].toString());
				searchStrDef += "_id:"+defectIds[i][j].toString()+" ";
				
			}
		
			
		
		}
		console.log(searchStrDef);
		var requestObject = new Object();  
            requestObject.collectionName = "ise_mongo_demo1_defect_collection";
            requestObject.projectName = projectName;
            requestObject.searchString = searchStrDef;
            requestObject.maxResults = 25;                    
            defectTitleArray[i] = ISE.getSearchResults(requestObject, defectassignationview._receivedDefectTitleResults);  
		
		
		var str1 = "";
		var duplicates = new Array();
		for(var i=0; i<DefectIDArray.length;i++){
			str1 = duplicateIDArray[i].toString();
			var outString = str1.replace(/[`~!@#$%^&*()_|+\-=?;'"<>\{\}\[\]\\\/]/gi, '');
			duplicates[i] = outString.split(',');
		}
		var str2 = "";
		var duplicatesPercent = new Array();
		for(var i=0; i<duplicates.length;i++) {
			for(j=0,k=0;j<duplicates[i].length;j++,k++) {
				var tempVar = duplicates[i][j].toString();
					if (/^[a-zA-Z0-9- ]*$/.test(tempVar) == false) {
						duplicates[i][j] = tempVar.substring(0, tempVar.indexOf(':'));
					}
			}
		}
			
		defectassignationview.duplicate = duplicates;
			
		defectassignationview.duplicatePercent = duplicatesPercent;*/
		
		console.log("********************************************");
		 console.log(data);
		var defTitle = new Array();
		for(var i=0;i<data.length;i++) {
		
			defTitle[i] = data[i].title;
			//defTitle[i][1] = data[i]._id;
		
		}
		defectassignationview.defectTitle = defTitle;
		console.log(defectassignationview.defectTitle);
		
		//var table = $('#clusterResultsTable');
		$('#clusterResultsTableBody').empty();
		
		
		var newRowContent = '<tr>';
				
		var titleLen = 20;
		if(defectassignationview.ClusterIDArray.length >=2 && defectassignationview.ClusterIDArray.length <= 5) {
			titleLen = 15;
		} else if(defectassignationview.ClusterIDArray.length >5) {
			titleLen = 6;
		}
		console.log(defectassignationview.ClusterIDArray.length);
		for(var i=0;i<defectassignationview.ClusterIDArray.length;i++) {
			var titleContent='';
			if(defectassignationview.duplicate[i].length>1){
				titleContent += (defectassignationview.duplicate[i].length)/2 +'duplicates found, ';
			} else {
				titleContent += '0 duplicates found, ';
			}
			if(defectassignationview.UserIDArray[i]!="" && defectassignationview.UserIDArray[i]!= undefined){
				titleContent +='Assigned to - '+defectassignationview.UserIDArray[i]+'.';
			} else {
				titleContent +="Cluster Not Assigned.";
			}
			
			
			
			newRowContent += '<td><table class="table table-hover" id="clusterData"><thead id="clusters"><tr><th style="background-color:#C8C8C8;color:white;height:30px;width:100%;text-align:left;" class="icon-btn"data-original-title="" title="'+titleContent+'" >' +						    
							'<input type="checkbox" value='+defectassignationview.ClusterIDArray[i].toString()+'>&nbsp;&nbsp;'+ 
							'<a data-target="#stack1" data-toggle="modal" onclick="defectassignationview._onDuplicateViewModal('+i+');">' +'Cluster '
							+defectassignationview.ClusterIDArray[i].toString()
							+'</a>';
								
							if(defectassignationview.duplicate[i].length>1){
								newRowContent +='<a class="badge badge-danger" data-target="#stack1" data-toggle="modal" onclick="defectassignationview._onDuplicateViewModal('+i+');">' +(defectassignationview.duplicate[i].length)/2+'</a>';
							} else {
								newRowContent +='<a class="badge badge-danger" data-target="#stack1" data-toggle="modal" onclick="defectassignationview._onDuplicateViewModal('+i+');">'+ 0 +'</a>';
							}
							newRowContent += '</th></tr></thead>';
							
							
							
							
							
							
							newRowContent += '<tbody><tr><td><table id="cd" class="table table-hover abc"><thead class="hide"></thead><tbody>';
					
				var title = '';
				for(var j=0;j<defectassignationview.defectIds[i].length;j++) {
					//defectassignationview.defectId = defectIds[i][j].toString();
					/*for(var k=0;k<defectassignationview.defectTitle.length;k++) {
						if(defectassignationview.defectTitle[k][1] == defectassignationview.defectIds[i][j]) {
							
							title = defectassignationview.defectTitle[k][0];
						}
					
					}*/
					for(var k=0;k<data.length;k++) {
		
							//defTitle[i][0] = data[i].title;
							//defTitle[i][1] = data[i]._id;
							if(data[k]._id == defectassignationview.defectIds[i][j]) {
								title = data[k].title;
							
							}
		
					}
					newRowContent += '<tr><td>'
									+'<label value="'
									+defectassignationview.defectIds[i][j]
									+'"><a data-target="#stack2" data-toggle="modal" id="'
									+defectassignationview.defectIds[i][j]
									+'" onclick="defectassignationview._onDefectViewModal(this);">'
									+defectassignationview.defectIds[i][j]+'</a>'
									+'&nbsp;&nbsp;&nbsp;'
									+'<span data-original-title="" title="'
									//+defectassignationview.defectTitle[i]
									+title
									+'">'
									//+defectassignationview.defectTitle[i].substring(0, titleLen)
									+title.substring(0, titleLen)
									+'...</span></label></td></tr>';
				}
				
				if(defectassignationview.UserIDArray[i]!="" && defectassignationview.UserIDArray[i]!= undefined){
					newRowContent +='<tr><td><i class="fa fa-user" style="color:green"></i>&nbsp;Assigned to - '+defectassignationview.UserIDArray[i]+'</td></tr>';
			   }
				
				newRowContent += '</tbody></table>';
				
							console.log("SIRI before"+i);
							
				var oTable = $('#cd').dataTable({
                       "dom": 'frtTip',
                        "tableTools": {
                            "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
                        }

                    });
			
				console.log("SIRI after"+i);
				
				
				
				newRowContent += '</tbody></table>';				
				
				
				newRowContent += '</td>';
	
		}
		$('#clusterResultsTableBody').last().append(newRowContent);
		$('#clusterResultsTableBody').last().append('</tr>');
		
		/*console.log("SIRI before");
		
				var oTable = $('#clusterResultsTable').dataTable({
                       "dom": 'frtTip',
                        "tableTools": {
                            "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
                        },

                    });
			
		
				console.log("SIRI after");	*/			
		
		
		/*} else {

			$('#clusterResultsTableBody').empty();
			var newRowContentEmpty = '<tr><td>';
			newRowContentEmpty += '<table><tr><td>Some Error Occurred at backend. Please try with less number of Required Clusters.</td></tr></table>';
			newRowContentEmpty += '</td></tr>';
			$('#clusterResultsTableBody').last().append(newRowContentEmpty);
		}*/
		//$('#searchClusterTable').removeClass("hide");
        // ISEUtils.portletUnblockingCluster("pageContainer");
		
	 
	},
	
	_onDuplicateViewModal: function(data) {
			$('#duplicateTable').empty();
			if(defectassignationview.duplicate[data].length >1) {
				var newDupRowContent = '<table class="table table-bordered table-hover"><thead><tr><th>Defect</th><th>Duplicate</th><tr></thead><tbody>';
					for(l=0;l<defectassignationview.duplicate[data].length;l+=2) {
						newDupRowContent+='<tr>';
						newDupRowContent+='<td>'+defectassignationview.duplicate[data][l]+'</td>'
						newDupRowContent+='<td>'+defectassignationview.duplicate[data][l+1]+'</td>'
						newDupRowContent+='</tr>';
					}
					newDupRowContent+='</tbody></table>';
					$('#duplicateTable').last().append(newDupRowContent);
			} else {
				var newDupRowContentEmpty = '<table><tr><td>No Duplicates for this Cluster</td></tr></table>';
				$('#duplicateTable').last().append(newDupRowContentEmpty);
			}
		},	
		
	_onDefectViewModal: function(data) {
			
		var searchStr = data.id;
		var collection_name = $('#collectionsData').find('option:selected').attr('collection-name');
		 
		/*var projectName = localStorage.getItem('projectName');
		/*var params = ['PARAM1=' + searchStr];

		ISE.getDefectdetailsByID("getDefectDetailsById", params, projectName, false, defectassignationview._receivedDefectIdResults);*/
		console.log(searchStr);
		var projectName = localStorage.getItem('projectName');
		var requestObject = new Object();  
			requestObject.collectionName = collection_name;
			requestObject.projectName = projectName;
			requestObject.searchString = '_id:\"'+searchStr+'\"';
			requestObject.maxResults = 25;                    
			ISE.getSearchResults(requestObject, defectassignationview._receivedDefectIdResults);  

			
	},
		
	_receivedDefectIdResults: function(data) {
		 console.log(data);
		 $('#defectTableHeader').empty();
		 $('#defectTable').empty();
		 for(var i=0;i<data.length;i++){
			console.log(data[i]._id);
			
			var defectTableHeaderContent="Defect Details of     <b>" + ISEUtils.trunc(250,data[i]._id, "string" )+'</b>';
			$('#defectTableHeader').last().append(defectTableHeaderContent);
			var newDefRowContent = '<table><tbody>';
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'description'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+defectassignationview._getStatusLabel(data[i].description)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'title'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td title="'+defectassignationview._getStatusLabel(data[i].title)+'" style="padding-left:10px;padding-bottom:.2em;">'+ISEUtils.trunc(400,defectassignationview._getStatusLabel(data[i].title), "string" )+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'internaldefect'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+defectassignationview._getStatusLabel(data[i].internaldefect)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'last_updated_date'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+defectassignationview._getStatusLabel(data[i].last_updated_date)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'primary_feature'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+defectassignationview._getStatusLabel(data[i].primary_feature)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'primary_feature_parent'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+defectassignationview._getStatusLabel(data[i].primary_feature_parent)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'priority'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+defectassignationview._getStatusLabel(data[i].priority)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'severity'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+defectassignationview._getStatusLabel(data[i].severity)+'</td></tr>'
				newDefRowContent+='<tr><td style="padding-bottom:.2em;font-weight:bold;vertical-align:top">'+'status'+'</td><td style="padding-left:.2em;font-weight:bold;vertical-align:top">:</td><td style="padding-left:10px;padding-bottom:.2em;">'+defectassignationview._getStatusLabel(data[i].status)+'</td></tr>'
				newDefRowContent+='</tbody></table>';
				$('#defectTable').last().append(newDefRowContent);
			}
		
	 },
	 _getStatusLabel: function(label_data){
		 if(label_data == 'undefined' || !label_data || label_data == 'null')
			 return "- NA -";
		 else
			 return label_data
		 
	 },
	  
	_setFeaturesData: function(collection_value) {
		  var projectName = localStorage.getItem('projectName');
		  ISE.features("DefectsFeatureQry", ['PARAM1='+collection_value], projectName, false, defectassignationview._receivedFeatures);
	 },
	 
	_receivedFeatures: function(data) {
		
			var selectFeatureData = $('#featureData');
			$('#featureData').empty();
			var newOptionContent = '';
			var newOptionContentAll ='<option value="All"> Select feature.. </option>'
			selectFeatureData.append(newOptionContentAll);
			if(data){
				for(var i=0; i<data.length; i++) {
					var fData = data[i].feature ? data[i].feature : data[i].primary_feature;
					newOptionContent = '<option value="' 
					newOptionContent += fData + '">'+fData + '</option>';
					selectFeatureData.last().append(newOptionContent);
				
				}
			}
     },
  
	_setPriorityData: function(collection_value, status_value) {
		var projectName = localStorage.getItem('projectName');
		ISE.prioritiesListQuery("DefectsStatusQry", ['PARAM1='+collection_value, 'PARAM2='+status_value], projectName, false, defectassignationview._receivedPrioritiesListQuery);
    },
	
	_receivedPrioritiesListQuery: function(data) {
		var selectPriorityData = $('#priorityData');
		$('#priorityData').empty();
		var newOptionContent = '';
		var newOptionContentAll ='<option value="All"> All </option>'
		selectPriorityData.append(newOptionContentAll);
		for(var i=0; i<data.length; i++) {
			var pData = data[i][defectassignationview.statusVal];
			if(pData){
				newOptionContent = '<option value="' 
				newOptionContent += pData + '">'+ pData + '</option>';
				selectPriorityData.last().append(newOptionContent);
			}
		
		}

    },
	
	_setClusterTableData: function() {
		var projectName = localStorage.getItem('projectName');
		ISE.clustersDetailOne("duplicateBugReportOne", "", projectName, false, defectassignationview._receivedClusterTable);
    },
	
	_receivedClusterTable: function(data) {
		if(data.length >0) {
		console.log("inside _receivedClusterTable");
		console.log(data[0].ExecutionID);
		defectassignationview._setDistinctExecutionID();
		var projectName = localStorage.getItem('projectName');
		   	var executionID = data[0].ExecutionID;
			var params=[];
			params[0]='PARAM1='+executionID;
           ISE.clustersDetail("duplicateBugReport", params, projectName, false, defectassignationview._receivedClustersDetails);
		}
    },
	_ShowErrorMsg: function(msg_txt, visible){
		$('#page_defectassignationview #searchPortletBody .table-responsive .alert.alert-danger .error-msg').empty();
		$('#page_defectassignationview #searchPortletBody .table-responsive .alert.alert-danger .error-msg').last().append(msg_txt);
		if(visible)
			$('#page_defectassignationview #searchPortletBody .table-responsive .alert.alert-danger').show();
		else
			$('#page_defectassignationview #searchPortletBody .table-responsive .alert.alert-danger').hide();
	},
	_QueryFormation: function(fields_data, query_str, field_mapping_obj){
		
		var requestObject = '';
		var startDate = defectassignationview.startDate;
		var endDate = defectassignationview.endDate;
		var priority =$('#priorityData').val();
		var feature =$('#featureData').val();
		var collection = $('#page_defectassignationview #collectionsData').val()
		var qryString = "";
		if(collection.length == 0){
			var errorContent = ' Please select atleast one collection';
			defectassignationview._ShowErrorMsg(errorContent, true);
			return;
		}
		if(startDate=="" && endDate!=""){
				//alert("Please enter start date");
				var errorContent = ' Please enter start date';
				defectassignationview._ShowErrorMsg(errorContent, true);
				return;
		}else if(endDate=="" && startDate!=""){
				//alert("Please enter end date");
				var errorContent = ' Please enter end date';
				defectassignationview._ShowErrorMsg(errorContent, true);
				return;
		}else if(startDate>endDate){
			//alert("Filter Start Date should not Greater than End Date");
				var errorContent = ' Filter Start Date should not Greater than End Date';
				defectassignationview._ShowErrorMsg(errorContent, true);
				return;
		}else if(endDate=="" && startDate=="") {
				/*if(priority == 'All' && feature == 'All')
				{
					qryString= "*"
				}
				else*/ if(priority != 'All' && feature == 'All')
				{
					
					qryString = '\"status\" : \"'+priority+'\"';
					
					//For Temp
					//qryString = '\"status\" : \"'+priority+'\"';
				}
				else if(priority == 'All' && feature != 'All')
				{
					
					qryString = '\"primary_feature\" : \"'+feature+'\"';
					
					//For Temp
					//qryString = '\"status\" : \"'+priority+'\"';
					
				}
				else if(priority != 'All' && feature != 'All')
				{
					qryString = '\"status\" :\"'+priority+'\" , \"feature\" :\"'+feature+'\"';
					
					//For Temp
					//qryString = '\"status\" : \"'+priority+'\"';
				}
				
		}
		else
		{
			/*if(priority == 'All' && feature == 'All')
			{
				qryString = "*"
			}
			else*/ if(priority != 'All' && feature == 'All')
			{
				
				qryString = '\"status\" : \"'+priority+'\"';
				
			}
			else if(priority == 'All' && feature != 'All')
			{
				qryString = '\"primary_feature\" : \"'+feature+'\"';
				
				//For Temp
				//qryString = '\"status\" : \"'+priority+'\"';
			}
			else if(priority != 'All' && feature != 'All')
			{
				//qryString = '\"status\" :\"'+priority+'\" AND \"primary_feature\" :\"'+feature+'\"';
				statusQString = '\"status\" : \"'+priority+'\"';
				featureQString = '\"primary_feature\" : \"'+feature+'\"';
				qryString = '{"term":{'+statusQString+'}},{"term":{'+featureQString+'}}';
				      
				//For Temp
				//qryString = '\"status\" : \"'+priority+'\"';
			}
		}
		
		if(priority == 'All' && feature == 'All')
			{
				Pace.start();
				//alert("Please select atleast one feature to proceed further")
				//var errorContent = ' Please select atleast one feature to proceed further';
				//defectassignationview._ShowErrorMsg(errorContent, true);
				return requestObject = '{"search_request":{"fields":["title","description"],"query":{"match_all":{}},"size":50},"include_hits":"true","query_hint":"","field_mapping":{"title":["fields.title"],"description":["fields.description"]}}'
			} else {
			//$('#submitForm').removeAttr("href");
			//ISEUtils.portletBlockingCluster("pageContainer");
			Pace.start();
			if(endDate=="" && startDate=="") {
				
				//return requestObject = '{"search_request":{"fields":'+ JSON.stringify(fields_data) +',"query":{"match":{"_all":"'+ query_str +'"}},"filter":{"and":[{"term":{'+qryString+'}},{"range":{"date":{"gte":"'+startDate+'","lte":"'+endDate+'"}}}]},"size":50},"include_hits":"true","query_hint":"","field_mapping":{'+field_mapping_obj+'}}';
				return requestObject = '{"search_request":{"fields":'+ JSON.stringify(fields_data) +',"query":{"match_all":{}},"filter":{"and":[{"term":{'+qryString+'}}]},"size":50},"include_hits":"true","query_hint":"","field_mapping":{'+field_mapping_obj+'}}';
			
			} else if((priority != 'All' && feature != 'All') && (endDate!="" && startDate!="")){
				 return requestObject = '{"search_request":{"fields":'+ JSON.stringify(fields_data) +',"query":{"match_all":{}},"filter":{"and":['+qryString+',{"range":{"date":{"gte":"'+startDate+'","lte":"'+endDate+'"}}}]},"size":50},"include_hits":"true","query_hint":"","field_mapping":{'+field_mapping_obj+'}}';
			}else {
				
				//return requestObject = '{"search_request":{"fields":'+ JSON.stringify(fields_data) +',"query":{"match":{"_all":"'+ query_str +'"}},"filter":{"and":[{"term":{'+qryString+'}},{"range":{"date":{"gte":"'+startDate+'","lte":"'+endDate+'"}}}]},"size":50},"include_hits":"true","query_hint":"","field_mapping":{'+field_mapping_obj+'}}'
				return requestObject = '{"search_request":{"fields":'+ JSON.stringify(fields_data) +',"query":{"match_all":{}},"filter":{"and":[{"term":{'+qryString+'}},{"range":{"date":{"gte":"'+startDate+'","lte":"'+endDate+'"}}}]},"size":50},"include_hits":"true","query_hint":"","field_mapping":{'+field_mapping_obj+'}}';
			}
		}
		
	},
	
	_QueryFormation1: function(){
		var projectName = localStorage.getItem('projectName');
		var qryStringForRelease = "*" ;
		var qryStringForyears = "*";
		var priority =$('#priorityData').val();
		var feature =$('#featureData').val();
		dataArr = new Array(); 
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		if(startDate=="" && endDate!=""){
				//alert("Please enter start date");
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Please enter start date</td></tr></table>';
				$('#errorTable').last().append(errorContent);
		}else if(endDate=="" && startDate!=""){
				//alert("Please enter end date");
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Please enter end date</td></tr></table>';
				$('#errorTable').last().append(errorContent);
		}else if(startDate>endDate){
			//alert("Filter Start Date should not Greater than End Date");
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Filter Start Date should not Greater than End Date</td></tr></table>';
				$('#errorTable').last().append(errorContent);
		}else if(endDate=="" && startDate=="") {
				/*if(priority == 'All' && feature == 'All')
				{
					qryString= "*"
				}
				else*/ if(priority != 'All' && feature == 'All')
				{
					qryString = '(status:\\"'+priority+'\\")';
				}
				else if(priority == 'All' && feature != 'All')
				{
					qryString = '(primary_feature:\\"'+feature+'\\")';
				}
				else if(priority != 'All' && feature != 'All')
				{
					qryString = '(status:\\"'+priority+'\\") AND (primary_feature:\\"'+feature+'\\")';
				}
		}
		else
		{
			/*if(priority == 'All' && feature == 'All')
			{
				qryString = "*"
			}
			else*/ if(priority != 'All' && feature == 'All')
			{
				qryString = '(status:\\"'+priority+'\\")';
			}
			else if(priority == 'All' && feature != 'All')
			{
				qryString = '(primary_feature:\\"'+feature+'\\")';
			}
			else if(priority != 'All' && feature != 'All')
			{
				qryString = '(status:\\"'+priority+'\\") AND (primary_feature:\\"'+feature+'\\")';
			}
		}
		
			//defectassignationview.executionIDVal = Math.floor((Math.random() * 100000) + 1);
			defectassignationview.executionIDVal = new Date();
			console.log("*******Date*************"+defectassignationview.executionIDVal);
		    var groupCount = $("#clusterNumber").val();
			var duplicatePercent = $("#duplicatePercent").val();
			var executionIDValueTime = defectassignationview.executionIDVal;
			var executionIDValueTime1 = executionIDValueTime.getTime();
			var executionIDValue = executionIDValueTime1.toString();
			defectassignationview.executionIDVal = executionIDValueTime1;
			console.log("*******defectassignationview.executionIDVal*************"+defectassignationview.executionIDVal);
		    
			var duplicatePercentInt = parseInt($("#duplicatePercent").val(), 10);
			var groupCountInt = parseInt($("#clusterNumber").val(), 10);
			if(priority == 'All' && feature == 'All')
			{
				//alert("Please select atleast one feature to proceed further")
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Please select atleast one feature to proceed further</td></tr></table>';
				$('#errorTable').last().append(errorContent);
				
			} else if(duplicatePercentInt >100 || duplicatePercentInt<=0) {
				//alert("Please enter Duplicate Percent within 1-100 range.")
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Please enter Duplicate Percent within 1-100 range.</td></tr></table>';
				$('#errorTable').last().append(errorContent);
			} else if(groupCountInt<=0) {
				//alert("Please enter group count > 0")
				$('#errorTable').empty();
				var errorContent = '<table><tr><td>Please enter group count > 0</td></tr></table>';
				$('#errorTable').last().append(errorContent);
			}else {
			$('#submitForm').removeAttr("href");
			ISEUtils.portletBlockingCluster("pageContainer");
			if(endDate=="" && startDate=="") {
				//var requestObject = new Object();
				//requestObject.collectionName = "ise_mongo_demo1_defect_collection";
				//requestObject.qryString = qryString;
				//requestObject.maxResults = 1000;
				var collection_name = $('#collectionsData').find('option:selected').attr('collection-name');
				ISE.clustersDetailQuery(collection_name,qryString,projectName,groupCount,duplicatePercent,executionIDValue,defectassignationview._receivedSearchResultsByCluster);
			
			} else {
				//var requestObject = new Object();
				//requestObject.collectionName = "ise_mongo_demo1_defect_collection";
				//requestObject.qryString = qryString;
				//var startDateISO = new Date(Date.parse(startDate)).toISOString();
				//var endDateISO = new Date(Date.parse(endDate)).toISOString();
				//requestObject.fromdate = startDateISO;
				//requestObject.todate = endDateISO;
				//requestObject.maxResults = 1000;
				ISE.clustersDetailQuery("defect_collection",qryString,projectName,groupCount,duplicatePercent,executionIDValue,defectassignationview._receivedSearchResultsByCluster);
			
			
			}
		}	
		console.log("end");
   },

	_receivedSearchResultsByCluster: function(dataObj) {
		
			console.log("Done with cluster formation****************************************");
			defectassignationview._setClustersDetails();
			console.log("table created");
			//defectassignationview._initTable2();
			
	},
	_strip: function(html)
	{
		var tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText;
	},
	
	_initTable2: function() {
		console.log("inside _initTable2");
		//console.log($().dataTables());
        var table = $('#clusterResultsTable');

        /* Table tools samples: https://www.datatables.net/release-datatables/extras/TableTools/ */

        /* Set tabletools buttons and button container */

        $.extend(true, $.fn.DataTable.TableTools.classes, {
            "container": "btn-group tabletools-btn-group pull-right",
            "buttons": {
                "normal": "btn btn-sm default",
                "disabled": "btn btn-sm default disabled"
            }
        });

        var oTable = table.dataTable({

            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
           /* "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "Show _MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            "order": [
                [0, 'asc']
            ],
            "lengthMenu": [
                [5, 15, 20, -1],
                [5, 15, 20, "All"] // change per page values here
            ],*/

            // set the initial value
            "pageLength": 10,
            "dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            "tableTools": {
                "sSwfPath": "metronics/global/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "pdf",
                    "sButtonText": "PDF"
                }, {
                    "sExtends": "csv",
                    "sButtonText": "CSV"
                }, {
                    "sExtends": "xls",
                    "sButtonText": "Excel"
                }, {
                    "sExtends": "print",
                    "sButtonText": "Print",
                    "sInfo": 'Please press "CTRL+P" to print or "ESC" to quit',
                    "sMessage": "Generated by DataTables"
                }, {
                    "sExtends": "copy",
                    "sButtonText": "Copy"
                }]
            }
        });

        //var tableWrapper = $('#sample_2_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    }
		
};