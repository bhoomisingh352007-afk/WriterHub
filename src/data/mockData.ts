import { Manuscript, DRMAuditLog, AccessRequest, PublisherOffer } from "../types";
import { generateSHA256Hash, simulateEncryptContent } from "../utils/cryptoUtils";

export const INITIAL_MANUSCRIPTS: Manuscript[] = [
  {
    id: "ms-101",
    title: "Kashipur Confidential (काशीपुर कॉन्फिडेंशियल)",
    synopsis: "A gritty crime thriller set in the coal belts of Kashipur. An honest small-town sub-inspector discovers an encrypted ledger connecting political elites to illegal mining syndicates.",
    logline: "In a town where silence is bought in coal dust, one cop's encrypted notebook becomes the deadliest weapon in Uttar Pradesh.",
    genre: "Crime Thriller",
    type: "Screenplay",
    language: "Hindi",
    wordCount: 38500,
    writerId: "writer-01",
    writerName: "Bhoomi Singh (भूमि सिंह)",
    writerEmail: "bhoomi.writer@writerhub.io",
    createdAt: "2026-06-12",
    updatedAt: "2026-07-20",
    status: "DRM_Protected",
    encryptedPayload: simulateEncryptContent("INT. KASHIPUR POLICE STATION - NIGHT\nRain slams against broken glass...", "kashipur-master-key-2026"),
    drmConfig: {
      watermarkText: "CONFIDENTIAL PROPERTY OF BHOOMI SINGH (WRITERHUB)",
      allowCopy: false,
      allowDownload: false,
      screenBlurProtection: true,
      samplePageLimit: 2, // First 2 chapters
      expiryHours: 48,
      encryptionKeyHash: generateSHA256Hash("ms-101-kashipur"),
      ipTrackingEnabled: true,
      ndaRequired: true,
    },
    chapters: [
      {
        id: "ch-101-1",
        number: 1,
        title: "Chapter 1: The Midnight Ledger (आधी रात का बहीखाता)",
        wordCount: 4200,
        isSample: true,
        content: `SCENE 1: INT. KASHIPUR POLICE STATION - NIGHT (2:30 AM)

Heavy monsoon rain lashes against rusted iron grilles. Single flickering tube light casts long shadows over wooden tables covered in yellowing case files.

SUB-INSPECTOR VIKRAM SINGH (34, hardened eyes, unbuttoned khaki collar) sits holding a half-burnt bidi. Beside him lies a wet canvas bag recovered from the river bank.

VIKRAM
(murmuring to himself in Hindi)
"नदी भी सिर्फ लाशें बहाती है... बहीखाते नहीं।"

He unzips the canvas bag carefully using rubber gloves. Inside sits a leather-bound diary with a brass combination lock. Stamped on the leather in gold foil: 'SYNDICATE-09'.

VIKRAM
(calling out)
"सुरेश! दरवाज़ा बंद कर। बाहर अगर कोई कमिश्नर का आदम्य दिखे तो गोली चला देना।"

CONSTABLE SURESH (48) jumps up, locking the heavy teak wood doors.

SURESH
"सर, ये वही खाता है जिसके लिए कल रात विधायक के गुंडों ने नदी का बाँध खुलवा दिया था?"

SCENE 2: EXT. COAL WASHERY - CONTINUOUS

Searchlights sweep across towering black mounds of coal. Armed guards in camouflage jackets patrol with shotguns. In the center tower, MALIK (50s, silk kurta, chewing betel leaf) watches through night-vision binoculars.

MALIK
(into satellite phone)
"विक्रम के पास ठीक चौबीस घंटे हैं। अगर उसने बहीखाते का पन्ना खोला... तो पूरे बनारस मंडल में दिवाली समय से पहले मनेगी।"

CHAPTER EXCERPT END. FULL SCRIPT ENCRYPTED UNDER DRM RIGHTS.`,
      },
      {
        id: "ch-101-2",
        number: 2,
        title: "Chapter 2: The Decryption Cipher (साइफर और गोलियाँ)",
        wordCount: 5100,
        isSample: true,
        content: `SCENE 3: INT. SAFE HOUSE - MORNING

Sunlight filters through newspaper-lined windows. Vikram lays out six pages of handwritten numbers on a glass dining table.

VIKRAM
"हर एंट्री के आगे तीन डिजिट का कोड है। ये कोई आम नंबर नहीं है... ये बनारस बैंक के बेनामी लॉकर नंबर्स हैं।"

Enter ANANYA (29, sharp cyber forensics officer). She opens her encrypted laptop.

ANANYA
"विक्रम सर, ये लेजर साधारण कागज़ नहीं है। इसमें AES-256 का वाटरमार्क embedded है। अगर राइटर का DRM सिस्टम ट्रिगर हुआ, तो पूरा सर्वर अपने आप लॉक हो जाएगा।"

VIKRAM
"तो फिर समझो हम सीधे शेर की माँद में हाथ डाल रहे हैं।"`,
      },
      {
        id: "ch-101-3",
        number: 3,
        title: "Chapter 3: The Coal Syndicate Raid (माइंस का घेराव)",
        wordCount: 6800,
        isSample: false, // Protected Chapter - Needs Permission!
        content: `[LOCKED CHAPTER - REQUIRES WRITER APPROVAL & FULL NDA PASS]

This chapter contains the major climax sequence where Sub-Inspector Vikram raids the underground coal bunker in Kashipur.
To read Chapter 3 and beyond, submit an Access Request or NDA Agreement directly to writer Bhoomi Singh via the WriterHub Publisher Dashboard.`,
      },
    ],
    totalViews: 342,
    uniqueReaders: 18,
    averageReadPercentage: 84,
    reviews: [
      {
        id: "rev-1",
        publisherName: "Vikramaditya Motwane",
        publisherCompany: "Phantom Films & Content Engine",
        rating: {
          plotScore: 5,
          characterScore: 5,
          pacingScore: 4,
          commercialViability: 5,
          overallRating: 4.8,
        },
        comment: "Exceptional dialogue rhythm and authentic North Indian noir vibe. High potential for a 6-episode OTT limited series. DRM security features gave us confidence during internal review.",
        createdAt: "2026-07-02",
      },
      {
        id: "rev-2",
        publisherName: "Pooja Verma",
        publisherCompany: "Penguin Random House India",
        rating: {
          plotScore: 4,
          characterScore: 4,
          pacingScore: 5,
          commercialViability: 4,
          overallRating: 4.3,
        },
        comment: "Great pacing! Would love to explore literary novelization rights alongside screen rights.",
        createdAt: "2026-07-14",
      },
    ],
    accessRequests: [
      {
        id: "req-201",
        publisherId: "pub-1",
        publisherName: "Rohan Kapoor",
        publisherCompany: "Excel Entertainment",
        manuscriptId: "ms-101",
        manuscriptTitle: "Kashipur Confidential (काशीपुर कॉन्फिडेंशियल)",
        requestReason: "Evaluating for feature film adaptation (Hindi Mainstream Thriller).",
        requestedAccessType: "full_manuscript",
        status: "approved",
        requestedAt: "2026-07-25",
        approvedAt: "2026-07-26",
        expiresAt: "2026-08-05",
        accessCode: "PASS-EXCEL-889",
      },
      {
        id: "req-202",
        publisherId: "pub-2",
        publisherName: "Siddharth Roy Kapur",
        publisherCompany: "Roy Kapur Films",
        manuscriptId: "ms-101",
        manuscriptTitle: "Kashipur Confidential (काशीपुर कॉन्फिडेंशियल)",
        requestReason: "Executive review for OTT series acquisition.",
        requestedAccessType: "option_review",
        status: "pending",
        requestedAt: "2026-07-28",
      },
    ],
    offers: [
      {
        id: "off-301",
        manuscriptId: "ms-101",
        manuscriptTitle: "Kashipur Confidential (काशीपुर कॉन्फिडेंशियल)",
        publisherName: "Rohan Kapoor",
        publisherCompany: "Excel Entertainment",
        offerType: "option_rights",
        amount: 2500000, // 25 Lakhs INR
        currency: "INR",
        termsSummary: "18-Month Exclusive Option Rights for Hindi Feature Film. 10% advance upon agreement execution.",
        status: "pending",
        createdAt: "2026-07-27",
      },
    ],
  },
  {
    id: "ms-102",
    title: "The Quantum Chanakya (क्वांटम चाणक्य)",
    synopsis: "In 2099 Cyber-Hastinapur, an AI bio-hacker recreates the ancient Arthashastra algorithms to stop a mega-corporation from digitizing human memory banks.",
    logline: "Ancient political strategy meets neural cyberpunk in a high-stakes battle over humanity's last unencrypted consciousness.",
    genre: "Sci-Fi / Fantasy",
    type: "Novel / Manuscript",
    language: "English",
    wordCount: 72000,
    writerId: "writer-02",
    writerName: "Dr. Devika Nambiar",
    writerEmail: "devika.sci-fi@scriptshield.io",
    createdAt: "2026-05-18",
    updatedAt: "2026-07-19",
    status: "DRM_Protected",
    encryptedPayload: simulateEncryptContent("The neon lotus above Sector 7 flickered in binary cyan...", "quantum-chanakya-key"),
    drmConfig: {
      watermarkText: "COPYRIGHT DR. DEVIKA NAMBIAR - ALL RIGHTS RESERVED",
      allowCopy: false,
      allowDownload: false,
      screenBlurProtection: true,
      samplePageLimit: 1,
      expiryHours: 24,
      encryptionKeyHash: generateSHA256Hash("ms-102-quantum"),
      ipTrackingEnabled: true,
      ndaRequired: true,
    },
    chapters: [
      {
        id: "ch-102-1",
        number: 1,
        title: "Chapter 1: The Bio-Neural Arthashastra",
        wordCount: 5400,
        isSample: true,
        content: `PROLOGUE: CYBER-HASTINAPUR, YEAR 2099.

Rain on neon glass. Floating billboards broadcast quantum advertisements in Sanskrit-Sumerian script across the clouds.

DR. CHANAKYA-9 (a synthetic consciousness uploaded into a holographic chrome avatar) stands on the edge of the 400th floor skyway.

CHANAKYA-9
"The state is not built on soldiers or coin. It is built on the secrecy of its council."

AXEL (22, rebel neural coder with glowing silver optical implants) plugs a physical optical optic-cable into Chanakya's forehead terminal.

AXEL
"They've breached the Imperial Memory Vaults in Ujjain. Magadha Corp is selling childhood memories on the dark quantum exchange."

CHANAKYA-9
"Then we execute Sutra 14: Mandala Theory of Cyber Warfare. Every node connected to Magadha Corp's central spire will burn within three clock cycles."

CHAPTER EXCERPT END. PROTECTED BY SCRIPTSHIELD ENCRYPTION.`,
      },
    ],
    totalViews: 512,
    uniqueReaders: 29,
    averageReadPercentage: 91,
    reviews: [
      {
        id: "rev-3",
        publisherName: "HarperCollins Sci-Fi Desk",
        publisherCompany: "HarperCollins India",
        rating: {
          plotScore: 5,
          characterScore: 4,
          pacingScore: 5,
          commercialViability: 5,
          overallRating: 4.7,
        },
        comment: "Mind-bending premise! World building is world-class. The combination of ancient Indian statecraft with cyberpunk is fresh.",
        createdAt: "2026-07-10",
      },
    ],
    accessRequests: [],
    offers: [],
  },
  {
    id: "ms-103",
    title: "Safar-e-Ishq: Kavitaatmak Dastavez (सफ़र-ए-इश्क़: काव्यात्मक दस्तावेज़)",
    synopsis: "A heartfelt collection of 50 contemporary Hindi & Urdu Nazms, Ghazals, and spoken word pieces exploring modern love, solitude, and urban longing.",
    logline: "50 poems that capture the silent whispers between metro train rides, cold coffees, and late-night text messages.",
    genre: "Romantic Poetry",
    type: "Poetry Collection",
    language: "Hindi",
    wordCount: 12400,
    writerId: "writer-03",
    writerName: 'Meera "Saha" Joshi (मीरा जोशी)',
    writerEmail: "meera.poetry@scriptshield.io",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-28",
    status: "DRM_Protected",
    encryptedPayload: simulateEncryptContent("शहर की इस भीड़ में... एक तेरा खामोश चेहरा...", "safar-ishq-poetry-key"),
    drmConfig: {
      watermarkText: "WATERMARKED PREVIEW - MEERA JOSHI POETRY",
      allowCopy: false,
      allowDownload: false,
      screenBlurProtection: true,
      samplePageLimit: 2,
      expiryHours: 72,
      encryptionKeyHash: generateSHA256Hash("ms-103-safar"),
      ipTrackingEnabled: true,
      ndaRequired: false,
    },
    chapters: [
      {
        id: "ch-103-1",
        number: 1,
        title: "Nazm 1-5: Metro Lines and Old Letters (मेट्रो और पुराने ख़त)",
        wordCount: 1800,
        isSample: true,
        content: `नज़्म १: "येलो लाइन का आख़िरी स्टेशन"

येलो लाइन का आख़िरी स्टेशन आ गया,
पर दिल अब भी राजीव चौक पर ही अटका है।
जहाँ तुमने मुड़कर देखा था...
और कहा था:
"फिर मिलेंगे, अगर शहर ने इजाज़त दी।"

नज़्म २: "कागज़ की नाव"

तेरी यादें डिजिटल स्क्रीन पर नहीं,
मेरे मेज़ पर रखी उस अधूरी चाय के कप जैसी हैं—
जो ठंडी तो हो गई है,
पर महक आज भी तेरी ही देती है।`,
      },
    ],
    totalViews: 189,
    uniqueReaders: 12,
    averageReadPercentage: 96,
    reviews: [
      {
        id: "rev-4",
        publisherName: "Rajkamal Prakashan Editor",
        publisherCompany: "Rajkamal Prakashan",
        rating: {
          plotScore: 4,
          characterScore: 5,
          pacingScore: 5,
          commercialViability: 4,
          overallRating: 4.5,
        },
        comment: "Beautiful phrasing. Perfect for young readers and audio book performance.",
        createdAt: "2026-07-22",
      },
    ],
    accessRequests: [],
    offers: [],
  },
  {
    id: "ms-104",
    title: "Silicon Gali (सिलिकॉन गली - स्टार्टअप ड्रामा)",
    synopsis: "Three 22-year-old IIT dropouts build a revolutionary AI app in a small Indiranagar garage, only to face cutthroat venture capitalists and betrayal.",
    logline: "When valuation reaches $100 Million, brotherhood becomes the cheapest commodity in Bengaluru.",
    genre: "Startup Drama",
    type: "TV Series Bible",
    language: "Hinglish",
    wordCount: 41000,
    writerId: "writer-04",
    writerName: "Kabir Mehta",
    writerEmail: "kabir.series@scriptshield.io",
    createdAt: "2026-06-28",
    updatedAt: "2026-07-27",
    status: "DRM_Protected",
    encryptedPayload: simulateEncryptContent("INT. INDIRANAGAR GARAGE - DAY\nWhiteboard filled with Python equations...", "silicon-gali-key"),
    drmConfig: {
      watermarkText: "PROPERTY OF KABIR MEHTA - SILICON GALI BIBLE",
      allowCopy: false,
      allowDownload: false,
      screenBlurProtection: true,
      samplePageLimit: 1,
      expiryHours: 24,
      encryptionKeyHash: generateSHA256Hash("ms-104-silicon"),
      ipTrackingEnabled: true,
      ndaRequired: true,
    },
    chapters: [
      {
        id: "ch-104-1",
        number: 1,
        title: "Episode 1: The Pitch Deck (द पिच डेक)",
        wordCount: 4500,
        isSample: true,
        content: `SCENE 1: INT. CO-WORKING SPACE - BANGALORE - DAY

Candid techno beats playing. Glass cabins, bean bags, neon signs saying 'MOVE FAST AND BREAK THINGS'.

KABIR (23, messy hair, wearing hoodie with 'DECRYPT THE WORLD') paces in front of a venture capitalist team.

KABIR
"Bro, forget Swiggy. Forget Uber. What if an AI predicts what you're gonna crave 20 minutes before you even feel hungry?"

VC INVESTOR SHARMA (50s, tailored blazer, Apple watch) smirks.

SHARMA
"Son, I've heard 500 pitches this month. What happens to your user privacy when the government asks for the neural feed?"

KABIR
"That's why our backend runs on ScriptShield zero-knowledge proof DRM. Not even we can read the raw data."`,
      },
    ],
    totalViews: 280,
    uniqueReaders: 15,
    averageReadPercentage: 88,
    reviews: [],
    accessRequests: [],
    offers: [],
  },
];

export const INITIAL_AUDIT_LOGS: DRMAuditLog[] = [
  {
    id: "log-1",
    manuscriptId: "ms-101",
    manuscriptTitle: "Kashipur Confidential",
    viewerName: "Vikramaditya Motwane",
    viewerRole: "Publisher",
    viewerIp: "103.22.140.12",
    action: "KEY_DECRYPT",
    timestamp: "2026-07-29 18:42:10",
    securityStatus: "SECURE",
    deviceInfo: "Chrome 126 / macOS Sonama",
  },
  {
    id: "log-2",
    manuscriptId: "ms-101",
    manuscriptTitle: "Kashipur Confidential",
    viewerName: "Rohan Kapoor (Excel Ent)",
    viewerRole: "Publisher",
    viewerIp: "103.45.12.98",
    action: "WATERMARK_RENDER",
    timestamp: "2026-07-29 19:15:30",
    securityStatus: "SECURE",
    deviceInfo: "Safari 17 / macOS M3",
  },
  {
    id: "log-3",
    manuscriptId: "ms-101",
    manuscriptTitle: "Kashipur Confidential",
    viewerName: "Unknown Guest Publisher",
    viewerRole: "Publisher",
    viewerIp: "49.207.210.4",
    action: "BLUR_TRIGGERED",
    timestamp: "2026-07-29 20:02:11",
    securityStatus: "FLAGGED_FOCUS_LOSS",
    deviceInfo: "Firefox 125 / Windows 11",
  },
  {
    id: "log-4",
    manuscriptId: "ms-102",
    manuscriptTitle: "The Quantum Chanakya",
    viewerName: "HarperCollins Sci-Fi Desk",
    viewerRole: "Publisher",
    viewerIp: "182.72.180.14",
    action: "COPY_BLOCKED",
    timestamp: "2026-07-29 21:10:05",
    securityStatus: "ATTEMPTED_SELECTION",
    deviceInfo: "Edge 124 / Windows 11",
  },
];
