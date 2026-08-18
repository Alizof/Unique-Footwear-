export type SupportedLanguage = 'hi' | 'en';

export interface ChatbotTopic {
  id: string;
  label: {
    hi: string;
    en: string;
  };
  icon: string;
  question: {
    hi: string;
    en: string;
  };
  answer: {
    hi: string;
    en: string;
  };
  actionType?: 'navigate_shop' | 'navigate_contact' | 'open_size_guide' | 'whatsapp_owner' | 'navigate_offers';
  actionPayload?: string;
  actionText?: {
    hi: string;
    en: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  language: SupportedLanguage;
  quickReplies?: {
    id: string;
    label: string;
    action?: () => void;
  }[];
  actionButton?: {
    label: string;
    type: 'whatsapp' | 'view' | 'guide';
    urlOrView?: string;
  };
}

export const CHATBOT_TOPICS: ChatbotTopic[] = [
  {
    id: 'store_location',
    icon: '📍',
    label: {
      hi: 'दुकान का पता और समय',
      en: 'Store Location & Timings'
    },
    question: {
      hi: 'आपकी दुकान कहाँ पर है और दुकान का समय क्या है?',
      en: 'Where is your store located and what are the store hours?'
    },
    answer: {
      hi: '📍 *दुकान का पता:* Unique Style Footwear, कोकदोरो चौक, पिठोरिया, कांके (रांची, झारखंड)।\n\n⏰ *दुकान खुलने का समय:* सोमवार से रविवार: सुबह 9:00 बजे से रात 9:00 बजे तक (सप्ताह के सभी 7 दिन खुली रहती है)।\n\n👤 *प्रोप्राइटर / मालिक:* मोहम्मद मारुफ़ (Md. MARUF)\n📞 *फोन / WhatsApp:* +91 9709057763',
      en: '📍 *Store Location:* Unique Style Footwear, Kokdoro Chowk, Pithoria, Kanke (Ranchi, Jharkhand).\n\n⏰ *Business Hours:* Monday - Sunday: 9:00 AM - 9:00 PM (Open all 7 days).\n\n👤 *Proprietor / Owner:* Md. MARUF\n📞 *Phone / WhatsApp:* +91 9709057763'
    },
    actionType: 'navigate_contact',
    actionText: {
      hi: 'Google Maps पर लोकेशन देखें',
      en: 'View on Google Maps'
    }
  },
  {
    id: 'delivery_cod',
    icon: '🚚',
    label: {
      hi: 'होम डिलीवरी और कैश ऑन डिलीवरी',
      en: 'Home Delivery & COD'
    },
    question: {
      hi: 'क्या होम डिलीवरी और कैश ऑन डिलीवरी (COD) उपलब्ध है?',
      en: 'Is Home Delivery and Cash on Delivery (COD) available?'
    },
    answer: {
      hi: '🚚 *होम डिलीवरी सुविधा:*\nहाँ! हम पिठोरिया, कांके, रांची और आसपास के सभी इलाकों में 24 से 48 घंटे के भीतर तेज़ डिलीवरी प्रदान करते हैं।\n\n💰 *कैश ऑन डिलीवरी (COD):* उपलब्ध है। आप सामान मिलने के बाद नकद या Google Pay / PhonePe / Paytm UPI द्वारा भुगतान कर सकते हैं।\n\n🎉 *मुफ़्त डिलीवरी:* ₹999 से अधिक के ऑर्डर पर डिलीवरी बिल्कुल FREE है! (सामान्य ऑर्डर पर ₹60 डिलीवरी चार्ज)।',
      en: '🚚 *Home Delivery:*\nYes! We provide prompt local delivery across Pithoria, Kanke, Ranchi, and nearby regions within 24-48 hours.\n\n💰 *Payment Options:* Cash on Delivery (COD) and UPI on delivery (GPay, PhonePe, Paytm) are available.\n\n🎉 *Free Shipping:* Free delivery on orders above ₹999! (Standard ₹60 fee for smaller orders).'
    },
    actionType: 'navigate_shop',
    actionText: {
      hi: 'जूते ऑर्डर करें (Shop Now)',
      en: 'Order Footwear (Shop Now)'
    }
  },
  {
    id: 'shoe_categories',
    icon: '👟',
    label: {
      hi: 'जूते, सैंडल और चप्पल के प्रकार',
      en: 'Available Footwear Types'
    },
    question: {
      hi: 'आपके पास कौन-कौन से जूते, सैंडल और चप्पल उपलब्ध हैं?',
      en: 'What types of shoes, sandals, and slippers do you have?'
    },
    answer: {
      hi: 'हमारे पास सभी आयु वर्ग के लिए प्रीमियम क्वालिटी फुटवियर उपलब्ध हैं:\n\n• 👨 *पुरुषों के लिए (Men):* स्पोर्ट्स स्नीकर्स, रनिंग शूज़, लेदर फॉर्मल शूज़, पार्टी वियर, कैज़ुअल लोफ़र्स, आरामदायक सैंडल और स्लाइडर्स।\n• 👩 *महिलाओं के लिए (Women):* डिज़ाइनर हील्स, वेज सैंडल, कैज़ुअल स्नीकर्स, फ्लैट्स, पार्टी फुटवियर और डेली वियर चप्पलें।\n• 👦 *बच्चों के लिए (Kids):* स्कूल शूज़, लाइट वाले स्नीकर्स, क्रॉक्स, सैंडल और टिकाऊ चप्पलें।\n• 🏷️ *प्रमुख ब्रांड्स:* Red Tape, Campus, Sparx, Asian, Woodland, Bata, Relaxo व अन्य।',
      en: 'We carry a comprehensive collection of durable, stylish footwear:\n\n• 👨 *Men:* Sports sneakers, running shoes, genuine leather formals, party loafers, casual sandals & slides.\n• 👩 *Women:* Designer block heels, wedge sandals, comfortable flats, party footwear & daily chappals.\n• 👦 *Kids (Boys & Girls):* School shoes, LED sneakers, lightweight clogs, sandals & sturdy daily wear.\n• 🏷️ *Top Brands:* Red Tape, Campus, Sparx, Asian, Woodland, Bata, Relaxo & more.'
    },
    actionType: 'navigate_shop',
    actionText: {
      hi: 'सभी फुटवियर कलेक्शन देखें',
      en: 'Browse Entire Collection'
    }
  },
  {
    id: 'size_fit_guide',
    icon: '📏',
    label: {
      hi: 'साइज गाइड और नाप कैसे लें',
      en: 'Shoe Size & Fit Guide'
    },
    question: {
      hi: 'जूते का सही साइज (UK/India) कैसे पता करें?',
      en: 'How do I choose the correct shoe size (UK/India)?'
    },
    answer: {
      hi: '📏 *साइज गाइड (भारतीय मानक UK/IND Size):*\n\n• पुरुष (Men): UK 6 से UK 11 तक सभी साइज उपलब्ध हैं।\n• महिला (Women): UK 4 से UK 8 तक सभी साइज उपलब्ध हैं।\n• बच्चे (Kids): UK 8C (छोटे बच्चे) से UK 5 तक उपलब्ध हैं।\n\n💡 *टिप:* यदि आपका पैर चौड़ा है तो 1 साइज बड़ा चुनें। यदि साइज में कोई दिक्कत हो तो हमारे पास 7-दिन का आसान एक्सचेंज उपलब्ध है!',
      en: '📏 *Size Standard (India / UK Size Chart):*\n\n• Men: UK 6 to UK 11 standard sizes available.\n• Women: UK 4 to UK 8 standard sizes available.\n• Kids: UK 8C (young kids) to UK 5 available.\n\n💡 *Tip:* If you have wider feet, choose one size up. We also provide a 7-day easy size exchange guarantee!'
    },
    actionType: 'open_size_guide',
    actionText: {
      hi: 'साइज चार्ट खोलें (Open Size Chart)',
      en: 'Open Full Size Chart'
    }
  },
  {
    id: 'exchange_policy',
    icon: '🔄',
    label: {
      hi: '7-दिन का आसान साइज एक्सचेंज',
      en: '7-Day Easy Size Exchange'
    },
    question: {
      hi: 'अगर साइज फिट नहीं आया तो क्या एक्सचेंज हो जाएगा?',
      en: 'Can I exchange the shoes if the size does not fit?'
    },
    answer: {
      hi: '✅ *7-दिन का आसान एक्सचेंज नियम:*\nहाँ! अगर जूते का साइज सही नहीं आया, तो आप 7 दिनों के भीतर बिना किसी परेशानी के साइज बदल सकते हैं।\n\nशर्तें: फुटवियर बिना पहना हुआ (अनयूज़्ड) होना चाहिए और बॉक्स/टैग सुरक्षित होने चाहिए। आप हमारी दुकान पर आकर या सीधे WhatsApp पर संदेश भेजकर नया साइज मँगवा सकते हैं।',
      en: '✅ *7-Day Easy Exchange Policy:*\nYes! If the shoe does not fit comfortably, you can easily exchange the size within 7 days.\n\nCondition: Footwear must be unworn outdoors with original tags and packaging box intact. You can exchange at our store or request doorstep replacement via WhatsApp.'
    },
    actionType: 'whatsapp_owner',
    actionText: {
      hi: 'WhatsApp पर एक्सचेंज की बात करें',
      en: 'Request Exchange on WhatsApp'
    }
  },
  {
    id: 'contact_owner',
    icon: '💬',
    label: {
      hi: 'मालिक मोहम्मद मारुफ़ जी से बात करें',
      en: 'Chat with Owner Md. MARUF'
    },
    question: {
      hi: 'मुझे सीधे दुकान के मालिक से WhatsApp पर बात करनी है।',
      en: 'I want to talk directly to store owner on WhatsApp.'
    },
    answer: {
      hi: '👤 *दुकान मालिक / प्रोप्राइटर:* मोहम्मद मारुफ़ (Md. MARUF)\n📞 *सीधा WhatsApp व कॉल नंबर:* +91 9709057763\n📍 *दुकान:* Unique Style Footwear, कोकदोरो चौक, पिठोरिया, कांके\n\nआप किसी भी मॉडल की फोटो, साइज उपलब्धता या विशेष छूट के लिए नीचे दिए गए हरे बटन पर क्लिक करके सीधे WhatsApp चैट शुरू कर सकते हैं।',
      en: '👤 *Store Proprietor & Owner:* Md. MARUF\n📞 *Direct WhatsApp & Call:* +91 9709057763\n📍 *Store:* Unique Style Footwear, Kokdoro Chowk, Pithoria, Kanke\n\nClick the button below to start a direct WhatsApp chat with owner Md. MARUF for pricing, model photos, or custom sizes.'
    },
    actionType: 'whatsapp_owner',
    actionText: {
      hi: 'WhatsApp पर चैट करें (+91 9709057763)',
      en: 'Chat on WhatsApp (+91 9709057763)'
    }
  },
  {
    id: 'discounts_offers',
    icon: '🏷️',
    label: {
      hi: 'ऑफर और डिस्काउंट',
      en: 'Offers & Discounts'
    },
    question: {
      hi: 'क्या कोई विशेष ऑफर या डिस्काउंट चल रहा है?',
      en: 'Are there any special offers or discounts running?'
    },
    answer: {
      hi: '🎉 *चल रहे धमाकेदार ऑफर्स:*\n\n1. 🔥 *फ्री डिलीवरी:* ₹999 से अधिक की खरीदारी पर पूरे पिठोरिया, कांके व रांची में डिलीवरी फ्री!\n2. 🏷️ *सीजनल सेल:* चुनिंदा स्नीकर्स और फॉर्मल शूज़ पर 30% से 50% तक की भारी छूट!\n3. 👨‍👩‍👧‍👦 *फैमिली कॉम्बो:* परिवार के लिए 2 या अधिक जोड़ी जूते खरीदने पर अतिरिक्त विशेष डिस्काउंट।',
      en: '🎉 *Current Ongoing Deals & Offers:*\n\n1. 🔥 *Free Delivery:* Free doorstep shipping on orders above ₹999 across Kanke & Ranchi!\n2. 🏷️ *Seasonal Sale:* Flat 30% to 50% off on selected sneakers and formal footwear!\n3. 👨‍👩‍👧‍👦 *Family Combo:* Special in-store discount on purchase of 2 or more pairs for family.'
    },
    actionType: 'navigate_offers',
    actionText: {
      hi: 'सभी डिस्काउंटेड ऑफर्स देखें',
      en: 'View All Discounted Offers'
    }
  }
];

// Smart Natural Language Keyword Matcher (Supporting Hindi Devanagari, Hinglish & English)
export function getSmartChatbotResponse(
  userQuery: string,
  lang: SupportedLanguage,
  ownerName: string = 'Md. MARUF',
  whatsappNumber: string = '9709057763',
  address: string = 'Kokdoro Chowk, Pithoria, Kanke'
): { answer: string; topicId?: string; actionType?: ChatbotTopic['actionType']; actionText?: string } {
  const query = userQuery.toLowerCase().trim();

  // 1. Owner / Proprietor / Malik Queries
  if (
    query.includes('owner') ||
    query.includes('maruf') ||
    query.includes('मारुफ') ||
    query.includes('मालिक') ||
    query.includes('proprietor') ||
    query.includes('kiska') ||
    query.includes('kiski dukan') ||
    query.includes('who is owner')
  ) {
    return {
      answer:
        lang === 'hi'
          ? `👤 *दुकान के प्रोप्राइटर / मालिक:* ${ownerName}\n📞 *WhatsApp / कॉल नंबर:* +91 ${whatsappNumber}\n📍 *स्थान:* Unique Style Footwear, ${address}\n\nआप किसी भी पूछताछ के लिए मोहम्मद मारुफ़ जी से सीधे संपर्क कर सकते हैं!`
          : `👤 *Store Proprietor & Owner:* ${ownerName}\n📞 *WhatsApp & Phone:* +91 ${whatsappNumber}\n📍 *Location:* Unique Style Footwear, ${address}\n\nYou can chat directly with Md. MARUF for any assistance!`,
      actionType: 'whatsapp_owner',
      actionText: lang === 'hi' ? `WhatsApp पर ${ownerName} जी से बात करें` : `Chat with ${ownerName} on WhatsApp`
    };
  }

  // 2. Location / Address / Shop Timing Queries
  if (
    query.includes('kahan') ||
    query.includes('where') ||
    query.includes('location') ||
    query.includes('address') ||
    query.includes('pata') ||
    query.includes('पता') ||
    query.includes('दुकान') ||
    query.includes('dukan') ||
    query.includes('timing') ||
    query.includes('time') ||
    query.includes('samay') ||
    query.includes('kokdoro') ||
    query.includes('pithoria') ||
    query.includes('kanke')
  ) {
    return {
      answer:
        lang === 'hi'
          ? `📍 *हमारा पता:* Unique Style Footwear, ${address} (रांची, झारखंड)।\n⏰ *समय:* सोमवार से रविवार, सुबह 9:00 AM से रात 9:00 PM तक खुली रहती है।\n👤 *मालिक:* ${ownerName} (+91 ${whatsappNumber})`
          : `📍 *Our Address:* Unique Style Footwear, ${address} (Ranchi, Jharkhand).\n⏰ *Timings:* Monday to Sunday, 9:00 AM to 9:00 PM.\n👤 *Owner:* ${ownerName} (+91 ${whatsappNumber})`,
      actionType: 'navigate_contact',
      actionText: lang === 'hi' ? 'Google Maps पर दिशा देखें' : 'Get Google Maps Directions'
    };
  }

  // 3. Delivery / COD / Free Shipping Queries
  if (
    query.includes('delivery') ||
    query.includes('डिलीवरी') ||
    query.includes('cod') ||
    query.includes('cash on delivery') ||
    query.includes('कैश') ||
    query.includes('bhejna') ||
    query.includes('home delivery') ||
    query.includes('ranchi') ||
    query.includes('charges') ||
    query.includes('shipping')
  ) {
    return {
      answer:
        lang === 'hi'
          ? `🚚 *डिलीवरी और पेमेंट:* पिठोरिया, कांके और रांची में 24-48 घंटों के अंदर होम डिलीवरी उपलब्ध है।\n\n• ₹999 से ऊपर के ऑर्डर पर डिलीवरी *FREE* है!\n• कैश ऑन डिलीवरी (COD) और UPI (GPay/PhonePe) दोनों मान्य हैं।`
          : `🚚 *Delivery & Payment:* Fast 24-48 hr local doorstep delivery in Pithoria, Kanke & Ranchi.\n\n• FREE Delivery on orders above ₹999!\n• Cash on Delivery (COD) & UPI on delivery available.`,
      actionType: 'navigate_shop',
      actionText: lang === 'hi' ? 'अभी ऑर्डर करें' : 'Shop & Order Now'
    };
  }

  // 4. Size / Fitting / Number Queries
  if (
    query.includes('size') ||
    query.includes('साइज') ||
    query.includes('fit') ||
    query.includes('number') ||
    query.includes('chart') ||
    query.includes('nap') ||
    query.includes('naap')
  ) {
    return {
      answer:
        lang === 'hi'
          ? `📏 *साइज उपलब्धता:*\n• पुरुष: UK 6, 7, 8, 9, 10, 11\n• महिला: UK 4, 5, 6, 7, 8\n• बच्चे: UK 8C से UK 5\n\nहमारे सभी जूते भारतीय स्टैंडर्ड साइज में आते हैं। साथ ही 7-दिन का आसान साइज एक्सचेंज भी मिलता है!`
          : `📏 *Size Availability:*\n• Men: UK 6, 7, 8, 9, 10, 11\n• Women: UK 4, 5, 6, 7, 8\n• Kids: UK 8C to UK 5\n\nAll footwear follows standard Indian/UK sizing with a 7-day hassle-free exchange!`,
      actionType: 'open_size_guide',
      actionText: lang === 'hi' ? 'साइज चार्ट देखें' : 'View Size Chart'
    };
  }

  // 5. Price / Offer / Discount / Saste Joote Queries
  if (
    query.includes('price') ||
    query.includes('rate') ||
    query.includes('offer') ||
    query.includes('discount') ||
    query.includes('दाम') ||
    query.includes('कीमत') ||
    query.includes('छूट') ||
    query.includes('sasta') ||
    query.includes('sale')
  ) {
    return {
      answer:
        lang === 'hi'
          ? `🏷️ *कीमत और डिस्काउंट:* हमारे पास ₹199 से लेकर ₹2,999 तक के बेहतरीन और टिकाऊ जूते-सैंडल उपलब्ध हैं।\n\n🔥 ब्रांडेड जूतों (Red Tape, Campus, Sparx, Asian) पर 30% से 50% तक की छूट चल रही है!`
          : `🏷️ *Prices & Offers:* Footwear ranging from ₹199 to ₹2,999 with genuine quality.\n\n🔥 Ongoing 30% to 50% discounts on top brands like Red Tape, Campus, Sparx & Asian!`,
      actionType: 'navigate_offers',
      actionText: lang === 'hi' ? 'ऑफर वाले जूते देखें' : 'View Discounted Footwear'
    };
  }

  // 6. Return / Exchange Queries
  if (
    query.includes('return') ||
    query.includes('exchange') ||
    query.includes('badalna') ||
    query.includes('बदलना') ||
    query.includes('वापसी') ||
    query.includes('change')
  ) {
    return {
      answer:
        lang === 'hi'
          ? `🔄 *7-दिन का एक्सचेंज:* अगर साइज या फिटिंग में कोई समस्या हो, तो आप 7 दिनों के अंदर नया साइज ले सकते हैं। अनयूज़्ड जूते और बॉक्स के साथ दुकान पर आएँ या WhatsApp करें।`
          : `🔄 *7-Day Exchange:* Easily swap for a new size within 7 days if the footwear is unworn and tags/box are intact. Visit the store or message on WhatsApp.`,
      actionType: 'whatsapp_owner',
      actionText: lang === 'hi' ? 'WhatsApp पर संपर्क करें' : 'Contact on WhatsApp'
    };
  }

  // 7. Greetings / Namaste / Hi / Hello
  if (
    query.includes('hi') ||
    query.includes('hello') ||
    query.includes('namaste') ||
    query.includes('नमस्ते') ||
    query.includes('salam') ||
    query.includes('हेलो')
  ) {
    return {
      answer:
        lang === 'hi'
          ? `नमस्ते! 🙏 Unique Style Footwear में आपका स्वागत है।\n\nहमारे प्रोप्राइटर **${ownerName}** जी (+91 ${whatsappNumber}) की तरफ से आपका हार्दिक स्वागत है। आप जूतों के डिजाइन, साइज, ऑफर या डिलीवरी के बारे में पूछ सकते हैं!`
          : `Hello! Welcome to Unique Style Footwear. 🙏\n\nWarm greetings on behalf of proprietor **${ownerName}** (+91 ${whatsappNumber}). How can I assist you with footwear styles, sizes, or orders today?`,
      actionType: 'navigate_shop',
      actionText: lang === 'hi' ? 'जूते देखें (Explore Shoes)' : 'Explore Shoes'
    };
  }

  // Default fallback response
  return {
    answer:
      lang === 'hi'
        ? `धन्यवाद आपके प्रश्न के लिए! 🙏\n\nहमारे पास पुरुषों, महिलाओं और बच्चों के लिए सभी ब्रांड्स (Campus, Red Tape, Sparx, Asian) के जूते-सैंडल उपलब्ध हैं।\n\nअधिक जानकारी के लिए आप नीचे दिए गए विषयों पर क्लिक कर सकते हैं या सीधे मालिक **${ownerName}** जी से WhatsApp पर चैट कर सकते हैं।`
        : `Thank you for your enquiry! 🙏\n\nWe offer a full range of footwear for Men, Women & Kids across leading brands (Campus, Red Tape, Sparx, Asian).\n\nYou can click the quick topics below or chat directly with owner **${ownerName}** on WhatsApp for instant help.`,
    actionType: 'whatsapp_owner',
    actionText: lang === 'hi' ? `WhatsApp पर ${ownerName} से पूछें` : `Ask ${ownerName} on WhatsApp`
  };
}
