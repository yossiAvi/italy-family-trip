export const imageBank = {
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1800&q=86',
  romeStreet: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1600&q=84',
  positano: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1800&q=86',
  amalfi: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1800&q=86',
  capri: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1800&q=86',
  sorrento: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=84',
  pompeii: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1600&q=84',
  naples: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=1600&q=84'
};

const maps = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const destinations = [
  { id:'rome', name:'רומא', subtitle:'עתיקות, כיכרות ושופינג', image:imageBank.rome, lat:41.9028, lng:12.4964 },
  { id:'sorrento', name:'סורנטו', subtitle:'עיר עתיקה ותצפיות למפרץ', image:imageBank.sorrento, lat:40.6263, lng:14.3758 },
  { id:'positano', name:'פוזיטנו', subtitle:'בתי פסטל, בוטיקים וחוף', image:imageBank.positano, lat:40.6281, lng:14.4850 },
  { id:'amalfi', name:'אמאלפי', subtitle:'קתדרלה, לימונים וסמטאות', image:imageBank.amalfi, lat:40.6340, lng:14.6027 },
  { id:'capri', name:'קפרי', subtitle:'שיט, אנאקפרי ונוף דרמטי', image:imageBank.capri, lat:40.5509, lng:14.2429 },
  { id:'pompeii', name:'פומפיי', subtitle:'עיר רומית שקפאה בזמן', image:imageBank.pompeii, lat:40.7497, lng:14.4869 },
  { id:'naples', name:'נאפולי', subtitle:'רחובות, פיצה ושופינג', image:imageBank.naples, lat:40.8518, lng:14.2681 }
];

export const restaurants = [
  {name:"Ba'Ghetto", city:'רומא', kosher:'כשר בשרי', type:'מטבח יהודי־רומאי', price:'€€–€€€', note:'ברובע היהודי. מתאים לארוחת ערב לאחר הקפיטול והרובע היהודי.', reserve:true, link:maps("Ba'Ghetto Rome")},
  {name:"Ba'Ghetto Milky", city:'רומא', kosher:'כשר חלבי', type:'פיצה, פסטה ומנות חלביות', price:'€€', note:'בחירה נוחה למשפחה שרוצה ארוחה איטלקית כשרה.', reserve:true, link:maps("Ba'Ghetto Milky Rome")},
  {name:"C’è Pasta e Pizza", city:'רומא', kosher:'כשר', type:'פסטה ופיצה', price:'€–€€', note:'פתרון פשוט ומהיר באזור הרובע היהודי.', reserve:false, link:maps("C'e Pasta e Pizza Rome kosher")},
  {name:'Bellacarne', city:'רומא', kosher:'כשר בשרי', type:'בשר ומטבח רומאי', price:'€€–€€€', note:'אפשרות לארוחה בשרית מסודרת ברובע היהודי.', reserve:true, link:maps('Bellacarne Rome')},
  {name:'Dolce Kosher', city:'רומא', kosher:'כשר', type:'מאפים וקינוחים', price:'€', note:'טוב לקפה, מאפה והצטיידות לדרך.', reserve:false, link:maps('Dolce Kosher Rome')},
  {name:'Armando al Pantheon', city:'רומא', kosher:'לא כשר', type:'מטבח רומאי קלאסי', price:'€€€', note:'סמוך לפנתאון; הזמנה מוקדמת כמעט הכרחית.', reserve:true, link:maps('Armando al Pantheon Rome')},
  {name:'Osteria da Fortunata', city:'רומא', kosher:'לא כשר', type:'פסטה טרייה', price:'€€', note:'פסטה בעבודת יד; עמוס מאוד בשעות השיא.', reserve:true, link:maps('Osteria da Fortunata Rome')},
  {name:'Giolitti', city:'רומא', kosher:'לא כשר', type:'גלידה וקונדיטוריה', price:'€', note:'עצירת גלידה קלאסית ליד הפנתאון.', reserve:false, link:maps('Giolitti Rome')},
  {name:'Da Gigino – Università della Pizza', city:'Vico Equense', kosher:'לא כשר', type:'פיצה ופסטה', price:'€€', note:'נוח לערב הראשון בדרום ומתאים למשפחות.', reserve:true, link:maps('Da Gigino Vico Equense')},
  {name:'Soul & Fish', city:'סורנטו', kosher:'לא כשר', type:'דגים ופסטה', price:'€€€', note:'ב־Marina Grande; מתאים לארוחה עם אווירה של נמל.', reserve:true, link:maps('Soul & Fish Sorrento')},
  {name:'Pizzeria da Franco', city:'סורנטו', kosher:'לא כשר', type:'פיצה', price:'€', note:'אפשרות מהירה ופשוטה באזור המרכז.', reserve:false, link:maps('Pizzeria da Franco Sorrento')},
  {name:'Chez Black', city:'פוזיטנו', kosher:'לא כשר', type:'פסטה, פיצה ודגים', price:'€€€', note:'על Spiaggia Grande; משלמים גם על המיקום.', reserve:true, link:maps('Chez Black Positano')},
  {name:'Buca di Bacco', city:'פוזיטנו', kosher:'לא כשר', type:'מטבח מקומי', price:'€€€', note:'קרוב לחוף ונוח לפני המעבורת.', reserve:true, link:maps('Buca di Bacco Positano')},
  {name:'Lido Azzurro', city:'אמאלפי', kosher:'לא כשר', type:'דגים ופסטה', price:'€€€', note:'קרוב לנמל, ולכן פרקטי ביום המעבורות.', reserve:true, link:maps('Lido Azzurro Amalfi')},
  {name:'Da Gemma', city:'אמאלפי', kosher:'לא כשר', type:'מטבח חוף אמאלפי', price:'€€€', note:'ארוחה מושקעת יותר; להזמין זמן רב מראש.', reserve:true, link:maps('Da Gemma Amalfi')},
  {name:'Villa Maria', city:'רוולו', kosher:'לא כשר', type:'מטבח קמפני', price:'€€€', note:'מרפסת נעימה ונוחה לשילוב אחרי הגנים.', reserve:true, link:maps('Villa Maria Ravello restaurant')},
  {name:'Mimì Ristorante Pizzeria', city:'רוולו', kosher:'לא כשר', type:'פיצה ופסטה', price:'€€', note:'אפשרות משפחתית פחות רשמית.', reserve:true, link:maps('Mimi Ristorante Pizzeria Ravello')},
  {name:'Capri Kosher', city:'קפרי', kosher:'כשר', type:'מטבח איטלקי וכשר', price:'€€€', note:'פתוח בעונת הקיץ; לבנות את יום קפרי סביב הזמנת צהריים.', reserve:true, link:maps('Capri Kosher Piazzetta Cerio 11')},
  {name:'Buonocore Gelateria', city:'קפרי', kosher:'לא כשר', type:'גלידה ומאפים', price:'€', note:'מפורסם בריח הוופל הטרי; קרוב למרכז קפרי.', reserve:false, link:maps('Buonocore Gelateria Capri')},
  {name:"L'Antica Pizzeria da Michele", city:'נאפולי', kosher:'לא כשר', type:'פיצה נפוליטנית', price:'€', note:'תפריט מצומצם ותורים אפשריים; עדיף להגיע בשעה לא שגרתית.', reserve:false, link:maps("L'Antica Pizzeria da Michele Naples")},
  {name:'Di Matteo', city:'נאפולי', kosher:'לא כשר', type:'פיצה ואוכל רחוב', price:'€', note:'על Via dei Tribunali ונוח למסלול הקצר בעיר העתיקה.', reserve:false, link:maps('Di Matteo Naples')},
  {name:'Starita', city:'נאפולי', kosher:'לא כשר', type:'פיצה', price:'€€', note:'דורש סטייה קלה מהמסלול המרכזי אך מתאים לחובבי פיצה.', reserve:true, link:maps('Starita Naples')}
];

export const shopping = [
  {city:'רומא', name:'Via del Corso', type:'רשתות ואופנה', duration:'1.5–3 שעות', tip:'הרחוב המרכזי לשופינג נגיש מהמדרגות הספרדיות ומפיאצה ונציה.', brands:'Zara, Mango, Nike, Adidas, Sephora ועוד', link:maps('Via del Corso Rome')},
  {city:'רומא', name:'Rinascente Roma Tritone', type:'כלבו', duration:'1–2 שעות', tip:'ממוזג ונוח בשעות החמות; יש גם קומת אוכל ותצפית.', brands:'מותגי אופנה, קוסמטיקה ועיצוב', link:maps('Rinascente Roma Tritone')},
  {city:'רומא', name:'Via Condotti', type:'יוקרה', duration:'30–60 דקות', tip:'כדאי לשלב עם המדרגות הספרדיות גם אם רק מסתכלים בחלונות.', brands:'מותגי יוקרה איטלקיים ובינלאומיים', link:maps('Via dei Condotti Rome')},
  {city:'רומא', name:'Castel Romano Designer Outlet', type:'אאוטלט', duration:'חצי יום', tip:'רק אם שופינג הוא יעד מרכזי; דורש יציאה מחוץ לעיר.', brands:'יותר מ־150 חנויות לפי אתר האאוטלט', link:maps('Castel Romano Designer Outlet')},
  {city:'סורנטו', name:'Corso Italia', type:'רחוב קניות', duration:'1–2 שעות', tip:'לשלב בערב; חנויות בגדים, מזכרות, לימון וקרמיקה.', brands:'חנויות מקומיות ורשתות', link:maps('Corso Italia Sorrento')},
  {city:'פוזיטנו', name:'Via dei Mulini והסמטאות', type:'בוטיקים', duration:'60–90 דקות', tip:'חפשו פשתן, בגדי חוף וסנדלים בעבודת יד; המחירים גבוהים.', brands:'Moda Positano ובוטיקים מקומיים', link:maps('Via dei Mulini Positano')},
  {city:'אמאלפי', name:'Via Lorenzo d’Amalfi', type:'מזכרות ומוצרים מקומיים', duration:'45–75 דקות', tip:'לימונים, קרמיקה, נייר אמאלפי וממתקים.', brands:'חנויות מקומיות', link:maps("Via Lorenzo d'Amalfi")},
  {city:'רוולו', name:'Piazza Duomo והרחובות הסמוכים', type:'בוטיקים וקרמיקה', duration:'30–60 דקות', tip:'קניות שקטות יותר ופחות לחוצות מפוזיטנו.', brands:'קרמיקה, אמנות ומוצרי לימון', link:maps('Piazza Duomo Ravello')},
  {city:'קפרי', name:'Via Camerelle', type:'יוקרה ובוטיקים', duration:'60–90 דקות', tip:'אחד מרחובות הקניות המפורסמים באי; לשלב אחרי ה־Piazzetta.', brands:'יוקרה, בישום וסנדלים', link:maps('Via Camerelle Capri')},
  {city:'נאפולי', name:'Via Toledo', type:'רשתות ואווירה עירונית', duration:'1.5–2.5 שעות', tip:'לשלב עם Galleria Umberto I ותחנת המטרו Toledo.', brands:'רשתות אופנה וחנויות מקומיות', link:maps('Via Toledo Naples')},
  {city:'נאפולי', name:'Galleria Umberto I', type:'גלריה היסטורית וקניות', duration:'30–45 דקות', tip:'יפה לצילום ונמצאת קרוב לרחוב טולדו ולתיאטרון סן קרלו.', brands:'בתי קפה וחנויות', link:maps('Galleria Umberto I Naples')}
];

export const days = [
  {
    date:'27.7', weekday:'יום שני', title:'רומא — כניסה רכה לחופשה', image:imageBank.romeStreet, intensity:'קל',
    summary:'ערב היכרות עם המרכז ההיסטורי, בלי רכב, בלי כרטיסים ובלי לחץ.',
    transport:{
      mode:'מונית/רכבת משדה התעופה ואז הליכה', icon:'🚶',
      overview:'ביום ההגעה אין צורך ברכב. לאחר ההגעה לדירה כל המסלול נעשה ברגל, בסמטאות המרכז ההיסטורי.',
      fromBase:[
        'מפיומיצ׳ינו: האפשרות הנוחה למשפחה של 5 היא מונית רשמית ישירות לדירה.',
        'חלופה חסכונית: Leonardo Express לתחנת Termini ומשם מונית קצרה לדירה.',
        'מהדירה יוצאים ברגל לכיכר הקווירינאלה ומשם ממשיכים בירידה לטרווי.'
      ],
      local:['הקווירינאלה → טרווי: כ־10 דקות הליכה בירידה.','טרווי → הפנתאון: כ־15 דקות דרך הסמטאות ו־Via del Corso.','הפנתאון → פיאצה נבונה: כ־5–7 דקות ברגל.'],
      fallback:'אם עייפים מהטיסה, אפשר לסיים אחרי טרווי והפנתאון ולהשאיר את פיאצה נבונה ליום הבא.'
    },
    parking:{needed:false,name:'אין רכב ביום הזה',address:'',note:'אל תשכרו רכב לפני 30.7. מרכז רומא מוגבל ב־ZTL והכול נגיש יותר ברגל.',link:null},
    schedule:[
      ['17:00','צ׳ק־אין, מקלחת ומנוחה קצרה'],
      ['18:15','כיכר הקווירינאלה ותצפית על גגות רומא'],
      ['18:45','מזרקת טרווי — תמונות וזריקת מטבע'],
      ['19:30','הליכה דרך Via del Corso אל הפנתאון'],
      ['20:15','פיאצה נבונה וארוחת ערב'],
      ['22:00','גלידה וחזרה לדירה']
    ],
    stops:[
      {name:'כיכר הקווירינאלה',why:'פתיחה רגועה עם כיכר אלגנטית ותצפית רחבה על גגות רומא.',what:'ארמון הנשיאות מבחוץ, פסלי הסוסים והאובליסק, ותצפית לכיוון כיפת סן פטרוס.',time:'10–15 דקות',access:'מגיעים ברגל מהדירה. מהכיכר יורדים ברגל לכיוון מזרקת טרווי.',photo:'מהמרפסת בקצה הכיכר לכיוון גגות העיר.',practical:'אין צורך לעמוד בתור או להיכנס למבנה.',link:maps('Piazza del Quirinale Rome')},
      {name:'מזרקת טרווי',why:'מזרקת הבארוק המפורסמת בעיר ואחד הרגעים המרגשים בביקור הראשון ברומא.',what:'נפטון במרכז, סוסי הים, הפסלים וטקס זריקת המטבע המסורתי.',time:'30–40 דקות',access:'כ־10 דקות הליכה מהקווירינאלה. ממשיכים אחר כך ברגל לפנתאון.',photo:'מהצד הימני של הכיכר מתקבלת זווית רחבה יותר של כל המזרקה.',practical:'צפוף מאוד; לשמור על טלפונים ותיקים. אפשר לחזור גם מאוחר בלילה.',link:maps('Trevi Fountain Rome')},
      {name:'הפנתאון',why:'אחד המבנים הרומיים העתיקים והשמורים בעולם.',what:'העמודים הענקיים, הכיכר, הכיפה וה־Oculus הפתוח במרכזה אם בוחרים להיכנס.',time:'20–30 דקות מבחוץ; 40 דקות עם כניסה',access:'כ־15 דקות הליכה מטרווי דרך הסמטאות.',photo:'ממרכז Piazza della Rotonda מול החזית.',practical:'אם יש תור ארוך, הסתפקו בחוץ והמשיכו לפיאצה נבונה.',link:maps('Pantheon Rome')},
      {name:'פיאצה נבונה',why:'כיכר חיה ונעימה לערב, שנבנתה מעל אצטדיון רומי עתיק.',what:'מזרקת ארבעת הנהרות של ברניני, שתי מזרקות נוספות, אמני רחוב ובתי קפה.',time:'30–45 דקות',access:'5–7 דקות הליכה מהפנתאון.',photo:'ליד Fontana dei Quattro Fiumi לכיוון הכיכר הארוכה.',practical:'המסעדות ממש על הכיכר יקרות; עדיף לבחור רחוב צדדי סמוך.',link:maps('Piazza Navona Rome')}
    ],
    food:['Armando al Pantheon','Osteria da Fortunata','Giolitti'], shopping:['Via del Corso'],
    tips:['לא לדחוס קניות ארוכות בערב הראשון.','למזרקת טרווי כדאי לחזור גם מאוחר יותר בלילה אם נשאר כוח.','כל המסלול נוח לעגלה או הליכה, אך הרחובות מרוצפים ולא תמיד חלקים.']
  },
  {
    date:'28.7', weekday:'יום שלישי', title:'רומא העתיקה והרובע היהודי', image:imageBank.rome, intensity:'בינוני',
    summary:'קולוסיאום, פורום, פלטין, קפיטול, תצפיות והרובע היהודי — הכול ברגל.',
    transport:{
      mode:'ברגל לאורך כל היום', icon:'🚶',
      overview:'מהדירה הולכים לקולוסיאום וממשיכים במסלול רציף עד הרובע היהודי. אין צורך במונית ואין חזרה לאחור.',
      fromBase:['יציאה מהדירה מוקדם והליכה של כ־10–20 דקות לקולוסיאום, בהתאם למיקום המדויק.','הגיעו לאזור לפחות 20–30 דקות לפני שעת הכניסה.'],
      local:['קולוסיאום → שער קונסטנטינוס: דקה ברגל.','קולוסיאום → פורום ופלטין: הכניסה נמצאת בסמוך; המשיכו לפי הכרטיס.','קפיטול → Vittoriano → הרובע היהודי: מסלול הליכה רציף של כ־20 דקות.'],
      fallback:'אם החום כבד, ותרו על חלק מהפלטין וצאו מוקדם למנוחה; את הקפיטול והגטו עשו בערב.'
    },
    parking:{needed:false,name:'אין רכב ביום הזה',address:'',note:'אין להיכנס למרכז רומא עם רכב שכור בגלל ZTL וחניה קשה.',link:null},
    schedule:[['07:45','יציאה ברגל מהדירה'],['08:30','קולוסיאום'],['09:50','שער קונסטנטינוס וכניסה לפורום'],['10:10','הפורום הרומי והפלטין במסלול ממוקד'],['12:30','ארוחת צהריים ומנוחה במונטי'],['16:30','Piazza Venezia, הקפיטול וה־Vittoriano'],['18:30','הרובע היהודי, תיאטרון מרצ׳לו והאי טיברינה'],['20:00','ארוחה כשרה ברובע היהודי']],
    stops:[
      {name:'הקולוסיאום',why:'הסמל הגדול של רומא העתיקה ומקום שממחיש לילדים את עוצמת האימפריה.',what:'יציעי הקהל, זירת הקרבות, המבנה שמתחת לרצפה והדרך שבה העלו חיות ותפאורה.',time:'60–75 דקות',access:'מגיעים ברגל מהדירה; הכניסה לפי השעה שעל הכרטיס.',photo:'מהצד של Colle Oppio או ליד שער קונסטנטינוס.',practical:'אל תנסו לקרוא כל שלט. התמקדו בסיפור הזירה ובמבנה ההנדסי.',link:maps('Colosseum Rome')},
      {name:'שער קונסטנטינוס',why:'שער ניצחון גדול ומרשים ממש ליד הקולוסיאום.',what:'תבליטים מתקופות שונות וסיפור הניצחון של הקיסר קונסטנטינוס.',time:'5–10 דקות',access:'דקה הליכה מיציאת הקולוסיאום.',photo:'מצד הקולוסיאום כך ששני האתרים נכנסים לתמונה.',practical:'עצירה קצרה בלבד לפני הפורום.',link:maps('Arch of Constantine Rome')},
      {name:'הפורום הרומי',why:'זה היה מרכז השלטון, המשפט, המסחר והדת של רומא העתיקה.',what:'Via Sacra, שער טיטוס, הקוריה, בית הבתולות הווסטליות ואזור המקדשים.',time:'75–90 דקות',access:'נכנסים מהאזור הסמוך לקולוסיאום ומתקדמים לכיוון הקפיטול.',photo:'מגבעת הפלטין או מהתצפית שמאחורי Campidoglio.',practical:'השטח כמעט ללא צל; מים, כובע ונעליים טובות חובה.',link:maps('Roman Forum Rome')},
      {name:'גבעת הפלטין',why:'מקום ארמונות הקיסרים ונקודת תצפית טובה על הפורום ועל Circus Maximus.',what:'שרידי ארמונות, גנים ותצפיות. לא חייבים לעבור בכל השבילים.',time:'45–60 דקות',access:'המשך טבעי מתוך מתחם הפורום.',photo:'מהמרפסת לכיוון הפורום או Circus Maximus.',practical:'בחרו תצפית אחת טובה ואל תתישו את הילדים.',link:maps('Palatine Hill Rome')},
      {name:'Piazza del Campidoglio',why:'כיכר יפה שתוכננה בידי מיכלאנג׳לו ונקודת מעבר מצוינת לגטו.',what:'הכיכר, פסל מרקוס אורליוס והתצפית החינמית מאחורי המבנים.',time:'25–35 דקות',access:'עולים במדרגות מהאזור של Piazza Venezia.',photo:'מהחלק האחורי לכיוון הפורום.',practical:'התצפית האחורית חינמית ושווה במיוחד לקראת ערב.',link:maps('Piazza del Campidoglio Rome')},
      {name:'Vittoriano',why:'המבנה הלבן הענק מציע תצפיות טובות על מרכז רומא.',what:'המרפסות, פסל ויטוריו עמנואלה השני ותצפית לעבר הפורום והקולוסיאום.',time:'30–60 דקות',access:'נמצא ב־Piazza Venezia מתחת לקפיטול.',photo:'מהמדרגות או מהמרפסות העליונות.',practical:'אפשר להסתפק במרפסות החינמיות אם לא רוצים לעלות במעלית בתשלום.',link:maps('Vittoriano Rome')},
      {name:'הרובע היהודי',why:'שילוב של היסטוריה יהודית, ארכיאולוגיה ואוכל כשר.',what:'בית הכנסת הגדול מבחוץ, Portico d’Ottavia, מזרקת הצבים, תיאטרון מרצ׳לו והאי טיברינה.',time:'1.5–2 שעות כולל ארוחה',access:'כ־15 דקות הליכה מהקפיטול בירידה.',photo:'תיאטרון מרצ׳לו לקראת שקיעה או Portico d’Ottavia.',practical:'זה היום הטוב ביותר לשלב ארוחת ערב כשרה והצטיידות במאפים/מוצרים לדרך.',link:maps('Jewish Ghetto Rome')}
    ],
    food:["Ba'Ghetto","Ba'Ghetto Milky","C’è Pasta e Pizza",'Bellacarne','Dolce Kosher'], shopping:[],
    tips:['הזמינו את הקולוסיאום לשעה הראשונה של היום.','באתרים העתיקים כמעט אין צל — קחו מים וכובעים.','אל תעשו גם ארנה וגם תת־קרקע אם המטרה היא קצב משפחתי.']
  },
  {
    date:'29.7', weekday:'יום רביעי', title:'הוותיקן מבחוץ, סנטאנג׳לו ושופינג', image:imageBank.romeStreet, intensity:'בינוני',
    summary:'ביקור מקוצר בוותיקן ללא מוזיאונים, הליכה לאורך הטיבר וחצי יום שופינג איכותי.',
    transport:{
      mode:'מונית או מטרו + הליכה', icon:'🚇',
      overview:'אין רכב. מתחילים בכיכר סן פטרוס, הולכים לטירת סנטאנג׳לו ואז עוברים במונית/מטרו לאזור השופינג.',
      fromBase:['הדרך הנוחה למשפחה של 5: מונית גדולה או שתי מוניות עד Piazza Pio XII, מול כיכר סן פטרוס.','חלופה: קו מטרו A לתחנת Ottaviano ומשם 10–15 דקות הליכה.'],
      local:['סן פטרוס → Castel Sant’Angelo: כ־15 דקות ברגל לאורך Via della Conciliazione.','סנטאנג׳לו → Piazza del Popolo: מונית קצרה או הליכה של כ־25 דקות לאורך הנהר.','Piazza del Popolo → Via del Corso → Rinascente → המדרגות הספרדיות: ברגל.'],
      fallback:'אם חם מאוד, קחו מונית מסנטאנג׳לו ישירות ל־Rinascente והתחילו את השופינג במקום ממוזג.'
    },
    parking:{needed:false,name:'אין רכב ביום הזה',address:'',note:'תחבורה ציבורית ומוניות עדיפות לחלוטין. החניה באזור הוותיקן והמרכז קשה ויקרה.',link:null},
    schedule:[['08:00','יציאה לכיכר סן פטרוס'],['08:30','כיכר סן פטרוס והבזיליקה מבחוץ'],['09:30','הליכה ל־Castel Sant’Angelo וגשר המלאכים'],['10:30','קפה או ארוחה קלה באזור Prati / Via Cola di Rienzo'],['11:30','Via Cola di Rienzo — שופינג מקומי'],['13:00','מעבר ל־Piazza del Popolo'],['13:30','Via del Corso, Galleria Alberto Sordi ו־Rinascente'],['17:00','Via Condotti והמדרגות הספרדיות'],['19:30','ערב חופשי או ארוחה כשרה ברובע היהודי']],
    stops:[
      {name:'כיכר סן פטרוס',why:'אחת הכיכרות המפורסמות בעולם והדרך הטובה לראות את הוותיקן בלי להקדיש שעות למוזיאונים.',what:'שדרות העמודים של ברניני, האובליסק, חזית הבזיליקה וחלונות ארמון האפיפיור.',time:'45–60 דקות',access:'מונית ל־Piazza Pio XII או מטרו Ottaviano והליכה.',photo:'ממרכז הכיכר מול הבזיליקה או בנקודות שבהן שורות העמודים מסתדרות לטור אחד.',practical:'אינכם נכנסים למוזיאונים. אם התור לבזיליקה ארוך, הסתפקו בכיכר ובחזית.',link:maps('Saint Peters Square Vatican')},
      {name:'Castel Sant’Angelo וגשר המלאכים',why:'מבצר עגול מרשים וקטע הליכה יפה לאורך הטיבר.',what:'המאוזוליאום של הקיסר אדריאנוס שהפך למבצר, ופסלי המלאכים שעל הגשר.',time:'45–60 דקות מבחוץ',access:'15 דקות הליכה מסן פטרוס לאורך Via della Conciliazione.',photo:'מאמצע Ponte Sant’Angelo לכיוון המבצר.',practical:'אין צורך להיכנס פנימה אלא אם הילדים מתעניינים במבצרים.',link:maps('Castel Sant Angelo Rome')},
      {name:'Via Cola di Rienzo',why:'רחוב קניות נוח ופחות תיירותי, קרוב לוותיקן.',what:'רשתות אופנה, נעליים, קוסמטיקה וחנויות איטלקיות.',time:'60–90 דקות',access:'הליכה קצרה מסנטאנג׳לו לכיוון Prati.',photo:'לא יעד צילום מרכזי; המטרה היא קניות וקפה.',practical:'אפשר לקנות כאן ארוחה קלה ולהימנע ממסעדות התיירים ליד הוותיקן.',link:maps('Via Cola di Rienzo Rome')},
      {name:'Via del Corso',why:'רחוב הקניות המרכזי של רומא עם שילוב של רשתות ומותגים איטלקיים.',what:'חנויות אופנה, ספורט, נעליים, קוסמטיקה ומזכרות.',time:'1.5–3 שעות',access:'התחילו ב־Piazza del Popolo והתקדמו דרומה ברגל.',photo:'Piazza del Popolo בתחילת הרחוב.',practical:'חלק מבני המשפחה יכולים להמשיך בקניות ואחרים לעצור לקפה.',link:maps('Via del Corso Rome')},
      {name:'Rinascente Roma Tritone',why:'חנות כלבו גדולה, ממוזגת ונוחה מאוד בשעות החמות.',what:'מותגי אופנה, קוסמטיקה, עיצוב, קומת אוכל וגג עם נוף.',time:'1–2 שעות',access:'סטייה קצרה מ־Via del Corso לכיוון Via del Tritone.',photo:'הגג או האקוודוקט העתיק שבתוך המבנה.',practical:'מתאים להפסקת מזגן, שירותים ואוכל במקום אחד.',link:maps('Rinascente Roma Tritone')},
      {name:'Via Condotti והמדרגות הספרדיות',why:'סיום יפה ליום עם רחוב יוקרה ואחת הכיכרות הידועות בעיר.',what:'חלונות ראווה של מותגי יוקרה, Piazza di Spagna והמדרגות.',time:'45–75 דקות',access:'כ־10 דקות הליכה מ־Rinascente.',photo:'מתחתית המדרגות לכיוון הכנסייה או מראש המדרגות לכיוון העיר.',practical:'אסור לשבת על המדרגות; לעצירה השתמשו בספסלים בכיכר.',link:maps('Spanish Steps Rome')}
    ],
    food:["Ba'Ghetto Milky",'Dolce Kosher','Giolitti'], shopping:['Via del Corso','Rinascente Roma Tritone','Via Condotti'],
    tips:['אין צורך להקדיש יותר משעה לוותיקן כשלא נכנסים.','שמרו קבלות ובקשו Tax Free בחנויות המשתתפות בהתאם לסכום הקנייה.','Via Cola di Rienzo מתאימה יותר לרשתות שימושיות; Via Condotti בעיקר לצפייה במותגי יוקרה.']
  },
  {
    date:'30.7', weekday:'יום חמישי', title:'איסוף רכב ונסיעה דרומה', image:imageBank.sorrento, intensity:'יום מעבר',
    summary:'אוספים רכב בפיומיצ׳ינו, נוסעים בכבישים מהירים ומתמקמים ב־L’Antica Pigna Chateau.',
    transport:{
      mode:'רכב שכור', icon:'🚗',
      overview:'זה היום הראשון עם הרכב. נוסעים בכבישים המהירים ולא נכנסים למרכז נאפולי או לכבישי חוף אמאלפי.',
      fromBase:['צ׳ק־אאוט מהדירה והגעה לשדה התעופה פיומיצ׳ינו במונית/רכבת לפי נוחות.','איסוף הרכב ובדיקה מלאה: תמונות, דלק, שריטות, צמיגים ומקום למזוודות.','מסלול מומלץ: A91 → כביש הטבעת GRA → A1 לכיוון Napoli → A3/E45 → Castellammare di Stabia → SS145 לכיוון Vico Equense.'],
      local:['עצירת Autogrill גדולה לאחר כשעתיים, בלי להשאיר ציוד גלוי ברכב.','לא לבחור ב־Google Maps “דרך נופית” דרך עיירות או מרכז נאפולי.','בערב נוסעים מהלינה למרכז Vico Equense וחוזרים ברכב.'],
      fallback:'אם הנסיעה מתארכת, ותרו על ערב במרכז והישארו לארוחה קרובה ללינה.'
    },
    parking:{needed:true,name:'חניה פרטית ב־L’Antica Pigna Chateau',address:'Via Della Porta Giovanni Battista 24, Montechiaro / Vico Equense',note:'יש לוודא מראש עם המארחים מקום לרכב ולקבל הוראות כניסה; הכביש האחרון עשוי להיות צר.',link:maps("L'Antica Pigna Chateau Vico Equense")},
    secondaryParking:[
      {name:'GPV Parcheggio Piazza Mercato',note:'אפשרות נוחה לטיול ערב במרכז Vico Equense.',link:maps('GPV Parcheggio Piazza Mercato Vico Equense')},
      {name:'Parcheggio Pizza a Metro',note:'חניה פרטית באזור Corso Giovanni Nicotera.',link:maps('Parcheggio Pizza a Metro Vico Equense')}
    ],
    schedule:[['08:00','צ׳ק־אאוט ויציאה לפיומיצ׳ינו'],['09:30','איסוף הרכב ובדיקתו'],['10:30','יציאה דרומה'],['13:00','עצירת Autogrill'],['15:30–16:30','הגעה ללינה והתמקמות'],['18:00','נסיעה קצרה למרכז Vico Equense'],['19:30','ארוחת ערב וחזרה ללינה']],
    stops:[
      {name:'Vico Equense — מרכז העיר',why:'עיירה מקומית נעימה עם פחות עומס מסורנטו ונוף יפה למפרץ.',what:'Piazza Umberto I, הרחוב הראשי, גלידריות ומסעדות.',time:'1–2 שעות',access:'נסיעה קצרה מהלינה וחניה ב־Piazza Mercato או באזור Pizza a Metro.',photo:'Piazza Umberto I או הרחובות ליד Corso Filangieri.',practical:'זה ערב קל; אל תנסו להוסיף אתר נוסף בדרך.',link:maps('Piazza Umberto I Vico Equense')},
      {name:'Santissima Annunziata',why:'כנסייה ציורית היושבת על קצה המצוק מול מפרץ נאפולי.',what:'החזית, המצוק והתצפית לכיוון וזוב והים.',time:'20–30 דקות',access:'הליכה קצרה מהמרכז לאחר החניה.',photo:'מהרחבה מול הכנסייה לכיוון המפרץ.',practical:'מומלץ להגיע לקראת שקיעה.',link:maps('Santissima Annunziata Vico Equense')},
      {name:'Castello Giusso מבחוץ',why:'מבנה היסטורי על המצוק שמוסיף לאווירת העיירה.',what:'הטירה והאזור המקיף אותה מבחוץ.',time:'10–15 דקות',access:'הליכה מהכנסייה ומהמרכז.',photo:'מהרחוב או מאזור התצפית הסמוך.',practical:'אין צורך להיכנס; זו תחנת צילום קצרה.',link:maps('Castello Giusso Vico Equense')}
    ],
    food:['Da Gigino – Università della Pizza'], shopping:[],
    tips:['לא להשאיר מזוודות גלויות בעצירה.','להימנע מכניסה למרכז נאפולי עם הרכב.','בקשו מחברת ההשכרה מדבקת כבישי אגרה או הסבר לתשלום בכביש.']
  },
  {
    date:'31.7', weekday:'יום שישי', title:'סורנטו ו־Bagni della Regina Giovanna', image:imageBank.sorrento, intensity:'בינוני',
    summary:'נוסעים ברכב לסורנטו, מחנים פעם אחת, מטיילים ברגל ומגיעים לבריכת הים באוטובוס או מונית.',
    transport:{
      mode:'רכב לסורנטו + הליכה + אוטובוס/מונית', icon:'🚗',
      overview:'הרכב נשאר ב־Achille Lauro במשך כל היום. את מרכז סורנטו עושים ברגל ואת Regina Giovanna בתחבורה מקומית.',
      fromBase:['יציאה מהלינה סביב 07:15–07:30 כדי להקדים את עומסי הכניסה לסורנטו.','ניווט ל־Parcheggio Comunale Achille Lauro ב־Via Correale 23.'],
      local:['החניון → Piazza Tasso: כ־5–8 דקות ברגל.','מרכז העיר → Marina Grande: הליכה בירידה; אפשר לחזור באוטובוס/מונית אם עייפים.','ל־Regina Giovanna: אוטובוס EAV/SITA לכיוון Capo di Sorrento או מונית, ואז 15–20 דקות הליכה בשביל.'],
      fallback:'אם החום כבד או הילדים עייפים, ותרו על Regina Giovanna והישארו בסורנטו, Marina Grande והשופינג.'
    },
    parking:{needed:true,name:'Parcheggio Comunale Achille Lauro',address:'Via Correale 23, Sorrento',note:'חניון מרכזי ונוח. השאירו את הרכב שם עד סוף היום וצלמו את הקומה/המיקום.',link:maps('Parcheggio Comunale Achille Lauro Sorrento')},
    schedule:[['07:20','יציאה מהלינה'],['08:00','חניה ב־Achille Lauro'],['08:15','Piazza Tasso ו־Vallone dei Mulini'],['09:00','Via San Cesareo והעיר העתיקה'],['10:30','San Francesco ו־Villa Comunale'],['11:30','Marina Grande וארוחת צהריים'],['15:30','אוטובוס/מונית ל־Capo di Sorrento'],['16:00','הליכה ל־Regina Giovanna ושחייה'],['19:00','חזרה לסורנטו ואיסוף הרכב']],
    stops:[
      {name:'Piazza Tasso',why:'הכיכר המרכזית ונקודת הפתיחה הטובה ביותר להבנת העיר.',what:'בתי קפה, הפסל, הרחובות היוצאים מהכיכר והאווירה של סורנטו.',time:'20–30 דקות',access:'5–8 דקות הליכה מחניון Achille Lauro.',photo:'ליד מעקה התצפית בקצה הכיכר.',practical:'זמן טוב לקפה ושירותים לפני ההליכה.',link:maps('Piazza Tasso Sorrento')},
      {name:'Vallone dei Mulini',why:'עמק עמוק וירוק עם שרידי טחנה עתיקה ממש במרכז העיר.',what:'צופים מלמעלה בלבד על המבנים המכוסים בצמחייה.',time:'10 דקות',access:'צמוד ל־Piazza Tasso.',photo:'מהמעקה ברחוב Via Fuorimura.',practical:'אין ירידה לעמק; זו עצירת תצפית קצרה.',link:maps('Vallone dei Mulini Sorrento')},
      {name:'Via San Cesareo והעיר העתיקה',why:'האזור הצבעוני ביותר בעיר והשופינג המקומי הטוב ביותר.',what:'לימונצ׳לו, קרמיקה, מזכרות, מוצרי עור, סנדלים, חנויות מזון וסמטאות.',time:'60–90 דקות',access:'יוצאים מ־Piazza Tasso ברגל.',photo:'בסמטאות הצרות עם דוכני הלימון.',practical:'זה המקום להשוות מחירים לפני שקונים; לא כל מוצר “לימון” הוא מקומי.',link:maps('Via San Cesareo Sorrento')},
      {name:'Sedile Dominova',why:'מבנה קטן ומיוחד ששימש מקום מפגש לאצולת העיר.',what:'הקשתות, הכיפה וציורי הקיר.',time:'10–15 דקות',access:'נמצא בתוך העיר העתיקה.',photo:'מהרחוב מול החזית הפתוחה.',practical:'עצירה קצרה בדרך למנזר San Francesco.',link:maps('Sedile Dominova Sorrento')},
      {name:'מנזר San Francesco',why:'חצר שקטה ויפה שנותנת הפסקה מהרחובות והחום.',what:'קלויסטר עתיק, קשתות וצמחייה.',time:'20–30 דקות',access:'הליכה קצרה מהעיר העתיקה.',photo:'בתוך החצר בין הקשתות.',practical:'לעיתים מתקיימים במקום אירועים או חתונות.',link:maps('Chiostro di San Francesco Sorrento')},
      {name:'Villa Comunale',why:'התצפית הקלאסית של סורנטו על המפרץ והווזוב.',what:'מרפסת תצפית, גנים קטנים וגישה למעלית לכיוון הנמל.',time:'25–40 דקות',access:'צמוד למנזר San Francesco.',photo:'מהמעקה לכיוון וזוב ו־Marina Piccola.',practical:'יש מעלית בתשלום לכיוון החוף/נמל, שימושית בחום.',link:maps('Villa Comunale Sorrento')},
      {name:'Marina Grande',why:'כפר הדייגים הישן עם בתים צבעוניים ומסעדות ליד המים.',what:'סירות, חוף קטן, טיילת ומסעדות.',time:'1–1.5 שעות כולל אוכל',access:'ירידה רגלית מהמרכז; חזרה ברגל בעלייה או במונית/אוטובוס.',photo:'מהקצה המזרחי של הטיילת לכיוון הבתים.',practical:'אם אוכלים כאן, הזמינו מראש מסעדה בשעות הצהריים.',link:maps('Marina Grande Sorrento')},
      {name:'Bagni della Regina Giovanna',why:'בריכת ים טבעית מוקפת סלעים ושרידי וילה רומית.',what:'לגונת מי ים, קשת טבעית בסלע ואזור שחייה סלעי.',time:'1.5–2.5 שעות',access:'אוטובוס/מונית ל־Capo di Sorrento ואז 15–20 דקות הליכה בירידה.',photo:'מהשביל העליון לפני הירידה ללגונה.',practical:'אין חוף מסודר, שירותים או מיטות. נעלי מים, מים ומעט ציוד בלבד.',link:maps('Bagni della Regina Giovanna')}
    ],
    food:['Soul & Fish','Pizzeria da Franco'], shopping:['Corso Italia'],
    tips:['אל תזיזו את הרכב ל־Regina Giovanna — החניה שם מוגבלת מאוד.','שמרו את כרטיס החניה ואת מיקום הרכב בטלפון.','אם חוזרים מאוחר, בדקו מראש את שעות האוטובוסים או תאמו מונית.']
  },
  {
    date:'1.8', weekday:'שבת', title:'פוזיטנו ואמאלפי במעבורות', image:imageBank.positano, intensity:'בינוני',
    summary:'הרכב נשאר בנמל סורנטו; שתי עיירות חוף דרך הים, ללא נהיגה בכביש SS163.',
    transport:{
      mode:'רכב לנמל + מעבורות + הליכה', icon:'⛴️',
      overview:'נוסעים מוקדם לנמל סורנטו, משאירים את הרכב בחניון כל היום ומתקדמים בין העיירות במעבורות.',
      fromBase:['יציאה סביב 07:00–07:15 וניווט ל־Garage Marina Piccola Sorrento.','להגיע לרציף 30–40 דקות לפני ההפלגה עם כרטיסים זמינים בטלפון.'],
      local:['סורנטו → פוזיטנו: מעבורת.','פוזיטנו: הכול ברגל; לתצפית גבוהה אפשר מונית/אוטובוס מקומי קצר.','פוזיטנו → אמאלפי: מעבורת קצרה.','אמאלפי: הכול ברגל עד החזרה לנמל.'],
      fallback:'אם הים גבוה והמעבורות מתבטלות, החלופה הבטוחה היא יום סורנטו/פומפיי. נהיגה לחוף היא חלופת חירום בלבד.'
    },
    parking:{needed:true,name:'Garage Marina Piccola Sorrento',address:'Marina Piccola, Sorrento',note:'חניון נוח מאוד ליד הרציפים אך יקר. מומלץ להזמין מראש ולוודא שעות פתיחה אחרי המעבורת האחרונה.',link:maps('Garage Marina Piccola Sorrento')},
    secondaryParking:[
      {name:'Parcheggio Achille Lauro',note:'חלופה זולה יותר, אך דורשת הליכה/מעלית ויותר זמן לנמל.',link:maps('Parcheggio Achille Lauro Sorrento')},
      {name:'Luna Rossa Amalfi',note:'רק כחלופת חירום במקרה שנוסעים ברכב לאמאלפי; לבדוק מגבלת גובה ומקומות.',link:maps('Luna Rossa Parking Amalfi')}
    ],
    schedule:[['07:10','יציאה לנמל סורנטו'],['08:15','חניה, איסוף כרטיסים והגעה לרציף'],['09:00','מעבורת לפוזיטנו'],['10:00','Spiaggia Grande, הכנסייה והסמטאות'],['11:15','Via dei Mulini ושופינג'],['12:45','הגעה לרציף'],['13:00','מעבורת לאמאלפי'],['13:30','ארוחת צהריים'],['14:45','Piazza Duomo, הקתדרלה והסמטאות'],['17:30','הגעה לרציף לחזרה'],['18:00','מעבורת לסורנטו']],
    stops:[
      {name:'Spiaggia Grande — פוזיטנו',why:'נקודת ההגעה והנוף האיקוני של בתי הפסטל המטפסים על ההר.',what:'החוף המרכזי, המזח, בתי הקפה ונקודת התצפית מלמטה.',time:'30–45 דקות',access:'יורדים מהמעבורת ישירות לחוף.',photo:'מקצה המזח או מהחוף לכיוון הכיפה והבתים.',practical:'אל תתחילו בעלייה מיד. תיהנו קודם מהחוף ומהנוף.',link:maps('Spiaggia Grande Positano')},
      {name:'Santa Maria Assunta',why:'הכיפה הצבעונית היא הסמל הבולט ביותר של פוזיטנו.',what:'הכנסייה, הכיפה והאזור ההיסטורי סביב החוף.',time:'20–30 דקות',access:'2–3 דקות הליכה מהחוף.',photo:'מהטיילת או מהמדרגות מעל החוף.',practical:'לבוש מכבד אם נכנסים פנימה.',link:maps('Santa Maria Assunta Positano')},
      {name:'Via dei Mulini והסמטאות',why:'האזור הטוב ביותר לשופינג וחוויית “Moda Positano”.',what:'בגדי פשתן, בגדי ים, סנדלים בעבודת יד, תיקי קש, קרמיקה ותכשיטים.',time:'60–90 דקות',access:'עולים בהדרגה מהחוף ברגל.',photo:'בסמטאות עם הכיפה והים ברקע.',practical:'המחירים גבוהים. סנדלים בעבודת יד עשויים לדרוש זמן התאמה.',link:maps('Via dei Mulini Positano')},
      {name:'Via Cristoforo Colombo — תצפית',why:'נקודת תצפית גבוהה לתמונה הקלאסית של העיירה.',what:'נוף מלא של הבתים, החוף והים.',time:'20–30 דקות',access:'מומלץ לעלות במונית/אוטובוס מקומי ולרדת ברגל; לא לטפס בחום.',photo:'לאורך הרחוב ליד נקודות העצירה והמלונות.',practical:'אל תסתכנו בעמידה על הכביש; הישארו במדרכות ובמרפסות.',link:maps('Via Cristoforo Colombo Positano')},
      {name:'Piazza Duomo — אמאלפי',why:'לב העיר עם החזית המרשימה והמדרגות של הקתדרלה.',what:'הכיכר, בתי הקפה, מזרקה וקתדרלת Sant’Andrea.',time:'30–45 דקות',access:'5 דקות הליכה מנמל אמאלפי.',photo:'ממרכז הכיכר מול המדרגות והחזית.',practical:'הכיכר עמוסה בצהריים; השגיחו על הילדים ליד המדרגות.',link:maps('Piazza Duomo Amalfi')},
      {name:'קתדרלת Sant’Andrea',why:'מבנה דרמטי המשלב סגנונות אדריכליים והיסטוריה ימית.',what:'החזית, הדלתות, ואם נכנסים — Chiostro del Paradiso והקריפטה.',time:'30–60 דקות',access:'עולים במדרגות מהכיכר.',photo:'מלמטה מול כל גרם המדרגות.',practical:'הכניסה לחלקים הפנימיים עשויה להיות בתשלום.',link:maps('Amalfi Cathedral')},
      {name:'Via Lorenzo d’Amalfi',why:'הרחוב המרכזי לקניות מקומיות ולאווירת הסמטאות.',what:'מוצרי לימון, קרמיקה, נייר אמאלפי, פסטה, סבונים וממתקים.',time:'45–75 דקות',access:'ממשיך פנימה מכיכר הדואומו.',photo:'בקשתות ובסמטאות הצרות.',practical:'מוצרים נוזליים ושבירים עדיף לארוז היטב לטיסה.',link:maps("Via Lorenzo d'Amalfi")},
      {name:'Arsenale או מוזיאון הנייר',why:'תוספת מעניינת אם חם מאוד או אם רוצים פעילות קצרה לילדים.',what:'היסטוריית בניית הספינות של אמאלפי או תהליך ייצור הנייר המסורתי.',time:'45–60 דקות',access:'ה־Arsenale קרוב לנמל; מוזיאון הנייר עמוק יותר בעמק.',photo:'בתוך המבנים ההיסטוריים.',practical:'בחרו אחד בלבד, בהתאם לזמן ולשעות הפתיחה.',link:maps('Museo della Carta Amalfi')}
    ],
    food:['Chez Black','Buca di Bacco','Lido Azzurro','Da Gemma'], shopping:['Via dei Mulini והסמטאות','Via Lorenzo d’Amalfi'],
    tips:['לא לנהוג בחוף אמאלפי בשבת של אוגוסט.','הזמינו כל מקטע מעבורת מראש והשאירו מרווח של 30 דקות.','אל תזמינו את המעבורת האחרונה כאפשרות היחידה לחזרה.']
  },
  {
    date:'2.8', weekday:'יום ראשון', title:'קפרי ואנאקפרי', image:imageBank.capri, intensity:'מלא',
    summary:'הרכב נשאר בסורנטו; באי עוברים בסירה, אוטובוס/מונית, רכבל כיסאות והליכה.',
    transport:{
      mode:'רכב לנמל + מעבורת + תחבורה באי', icon:'🏝️',
      overview:'אין צורך ברכב בקפרי. משאירים אותו במרינה של סורנטו ומתקדמים באי בתחבורה המקומית.',
      fromBase:['יציאה מוקדמת ל־Garage Marina Piccola Sorrento.','מעבורת מסורנטו ל־Marina Grande בקפרי.','כדאי להזמין כרטיס חזור שאינו האחרון ביום.'],
      local:['Marina Grande → שיט סביב האי: יוצאים מהנמל.','Marina Grande → Anacapri: אוטובוס קטן או מונית פתוחה.','Anacapri → Capri Town: אוטובוס/מונית.','Capri Town → Marina Grande: פוניקולר או מונית בהתאם לתור.'],
      fallback:'אם הים אינו רגוע, העבירו את יום קפרי ליום אחר ובצעו פומפיי/נאפולי או סורנטו.'
    },
    parking:{needed:true,name:'Garage Marina Piccola Sorrento',address:'Marina Piccola, Sorrento',note:'להזמין מראש ולהגיע 30–40 דקות לפני המעבורת. הרכב נשאר שם כל היום.',link:maps('Garage Marina Piccola Sorrento')},
    schedule:[['07:00','יציאה לסורנטו'],['08:00','חניה והגעה לרציף'],['08:30','מעבורת לקפרי'],['09:30','שיט סביב האי'],['11:15','אוטובוס/מונית לאנאקפרי'],['12:00','רכבל כיסאות ל־Monte Solaro'],['13:30','ארוחה ב־Capri Kosher'],['15:00','Capri Town, Piazzetta ו־Via Camerelle'],['16:15','גני אוגוסטוס'],['17:15','פוניקולר/מונית לנמל'],['17:30–18:30','מעבורת חזרה']],
    stops:[
      {name:'Marina Grande',why:'שער הכניסה לאי ונקודת היציאה לשיט.',what:'נמל צבעוני, קופות שיט, מסעדות ותחנות אוטובוס/מוניות.',time:'20–30 דקות מעבר',access:'המעבורת מסורנטו מגיעה ישירות לכאן.',photo:'מהמזח לכיוון הבתים הצבעוניים.',practical:'אל תבזבזו זמן רב בחנויות ליד הרציף; הן תיירותיות ויקרות.',link:maps('Marina Grande Capri')},
      {name:'שיט סביב קפרי',why:'הדרך הטובה ביותר לראות את המצוקים, המערות וה־Faraglioni.',what:'Faraglioni, המערה הירוקה, Marina Piccola, קשתות טבעיות ווילות מעל הים.',time:'שעה–שעתיים',access:'יוצאים מ־Marina Grande וחוזרים לאותו נמל.',photo:'Faraglioni מהסירה כשהיא מתקרבת או עוברת בקשת.',practical:'המערה הכחולה רק אם התור קצר והים רגוע; היא עלולה לגזול שעות.',link:maps('Marina Grande Capri boat tours')},
      {name:'אנאקפרי',why:'החלק השקט והפחות צפוף של האי, עם אווירה מקומית ושופינג נעים.',what:'רחובות הולכי רגל, קרמיקה, סנדלים, חנויות מקומיות וכנסיות.',time:'60–90 דקות',access:'אוטובוס או מונית מ־Marina Grande.',photo:'ברחובות הלבנים סביב Piazza Vittoria.',practical:'האוטובוסים קטנים וצפופים; למשפחה של 5 מונית פתוחה עשויה להיות נוחה יותר.',link:maps('Anacapri Italy')},
      {name:'Monte Solaro',why:'הנקודה הגבוהה באי עם אחת התצפיות הטובות באזור.',what:'רכבל כיסאות פתוח ונוף לאי, למפרץ נאפולי ולחצי האי סורנטו.',time:'60–90 דקות',access:'תחנת הרכבל נמצאת ב־Piazza Vittoria באנאקפרי.',photo:'מהמרפסת העליונה לכיוון Faraglioni.',practical:'הרכבל פתוח ואישי; מי שחושש מגובה יכול להישאר באנאקפרי.',link:maps('Monte Solaro chairlift')},
      {name:'Villa San Michele — אופציונלי',why:'גנים, עתיקות ותצפית יפה למפרץ.',what:'הבית והגנים של אקסל מונתה ואוסף עתיקות.',time:'45–60 דקות',access:'הליכה קצרה מאנאקפרי.',photo:'מהטרסה עם הספינקס.',practical:'הוסיפו רק אם יש זמן והילדים עדיין מעוניינים; Monte Solaro חשוב יותר.',link:maps('Villa San Michele Anacapri')},
      {name:'Piazzetta ו־Capri Town',why:'הלב האלגנטי והעמוס של קפרי.',what:'כיכר, בתי קפה, סמטאות ובוטיקים.',time:'30–45 דקות',access:'אוטובוס או מונית מאנאקפרי.',photo:'ליד מגדל השעון.',practical:'מחירי הקפה בכיכר גבוהים; אפשר לשתות ברחוב צדדי.',link:maps('Piazzetta Capri')},
      {name:'Via Camerelle',why:'רחוב הקניות היוקרתי המפורסם של האי.',what:'מותגי יוקרה, בישום מקומי, תכשיטים, בגדי חוף וסנדלים.',time:'60–90 דקות',access:'יוצא ממרכז Capri Town.',photo:'הרחוב עצמו והבוטיקים המעוצבים.',practical:'גם בלי קנייה, הרחוב נעים לשיטוט. בדקו Tax Free בקניות גדולות.',link:maps('Via Camerelle Capri')},
      {name:'גני אוגוסטוס',why:'גנים קומפקטיים עם תצפית מצוינת על Faraglioni ו־Via Krupp.',what:'טרסות פרחים ונוף דרמטי למצוקים ולים.',time:'35–50 דקות',access:'כ־10–15 דקות הליכה מ־Piazzetta.',photo:'מהמרפסת הדרומית לכיוון Faraglioni.',practical:'השאירו מספיק זמן לחזרה לנמל; הדרך לפוניקולר יכולה להיות עמוסה.',link:maps('Gardens of Augustus Capri')}
    ],
    food:['Capri Kosher','Buonocore Gelateria'], shopping:['Via Camerelle'],
    tips:['הזמינו Capri Kosher מראש ובדקו שעות פתיחה לעונת 2026.','במקרה של תור ארוך לפוניקולר, קחו מונית לנמל.','קחו תרופה נגד בחילה למי שרגיש, לאחר התייעצות מתאימה.']
  },
  {
    date:'3.8', weekday:'יום שני', title:'רוולו, מינורי ומאיורי', image:imageBank.amalfi, intensity:'בינוני',
    summary:'הרכב נשאר בסורנטו; מגיעים באונייה לאמאלפי, עולים לרוולו ויורדים לעיירות החוף.',
    transport:{
      mode:'רכב לנמל + מעבורת + מונית/אוטובוס', icon:'⛴️',
      overview:'מתחילים ומסיימים בנמל סורנטו. בין אמאלפי לרוולו ובין רוולו למינורי משתמשים במונית או SITA.',
      fromBase:['נסיעה מוקדמת ל־Garage Marina Piccola Sorrento.','מעבורת מסורנטו לאמאלפי.','מנמל אמאלפי עולים לרוולו במונית — הבחירה המומלצת למשפחה — או באוטובוס SITA.'],
      local:['רוולו: הכול ברגל; Villa Cimbrone דורשת 15–20 דקות הליכה לכל כיוון מהכיכר.','רוולו → מינורי: מונית או אוטובוס בירידה.','מינורי → מאיורי: מעבורת קצרה או אוטובוס; לא שביל הלימונים בצהריים.','חזרה: מעבורת ממאיורי/מינורי או מאמאלפי לפי לוח הזמנים.'],
      fallback:'אם אין מעבורת חזרה ישירה ממאיורי לסורנטו, חזרו במעבורת/אוטובוס לאמאלפי ומשם לסורנטו.'
    },
    parking:{needed:true,name:'Garage Marina Piccola Sorrento',address:'Marina Piccola, Sorrento',note:'הרכב נשאר בחניון כל היום. בדקו שהחניון פתוח לאחר שעת המעבורת החוזרת.',link:maps('Garage Marina Piccola Sorrento')},
    schedule:[['07:00','יציאה לנמל'],['08:30','מעבורת לאמאלפי'],['09:45','מונית/אוטובוס לרוולו'],['10:15','Piazza Duomo ו־Villa Cimbrone'],['12:15','Villa Rufolo — אם נשאר כוח'],['13:15','ארוחה ברוולו'],['14:30','ירידה למינורי'],['15:00','מינורי, חוף וקינוח לימון'],['16:45','מעבר למאיורי'],['17:00','חוף וטיילת מאיורי'],['18:30','חזרה לפי לוח המעבורות']],
    stops:[
      {name:'Piazza Duomo — רוולו',why:'המרכז הקטן והנעים של רוולו ונקודת הפתיחה לשתי הווילות.',what:'הדואומו, בתי קפה, חנויות קרמיקה וסמטאות.',time:'30–45 דקות',access:'מונית/אוטובוס מאמאלפי; יורדים ליד הכיכר או במרחק הליכה קצר.',photo:'מהכיכר לכיוון הדואומו.',practical:'זה המקום לשירותים, קפה והתארגנות לפני הגנים.',link:maps('Piazza Duomo Ravello')},
      {name:'Villa Cimbrone',why:'האתר המרשים ביותר ברוולו ואחת התצפיות היפות בחוף אמאלפי.',what:'גנים ארוכים, פסלים, שבילים ו־Terrace of Infinity.',time:'90–120 דקות',access:'15–20 דקות הליכה מהכיכר בסמטאות, כולל מעט עליות.',photo:'Terrace of Infinity עם הפסלים והים.',practical:'יש מעט צל בדרך; להגיע מוקדם ולהביא מים.',link:maps('Villa Cimbrone Ravello')},
      {name:'Villa Rufolo',why:'גנים היסטוריים, מגדלים ותצפיות המזוהות עם פסטיבל רוולו.',what:'חצרות, גנים ומרפסות מעל החוף.',time:'45–60 דקות',access:'נמצאת ממש ליד Piazza Duomo.',photo:'מהגנים העליונים לכיוון החוף.',practical:'אם הילדים עייפים, ותרו עליה אחרי Villa Cimbrone.',link:maps('Villa Rufolo Ravello')},
      {name:'מינורי',why:'עיירה רגועה, קומפקטית ופחות עמוסה מפוזיטנו ואמאלפי.',what:'טיילת, חוף קטן, סמטאות, Villa Romana וקונדיטוריות.',time:'1–1.5 שעות',access:'מונית או אוטובוס בירידה מרוולו.',photo:'מהטיילת לכיוון הכנסייה והעיירה.',practical:'זה המקום המתאים ל־Delizia al Limone ולמנוחה קצרה.',link:maps('Minori Italy')},
      {name:'Villa Romana — מינורי',why:'שרידי וילה רומית עם פסיפסים שמוסיפים תוכן היסטורי ליום החוף.',what:'חדרים, פסיפסים וחצר פנימית.',time:'30–45 דקות',access:'הליכה קצרה מהטיילת.',photo:'בתוך החצר או ליד הפסיפסים.',practical:'להיכנס רק אם פתוח ואם הילדים עדיין מעוניינים בעתיקות.',link:maps('Villa Romana Minori')},
      {name:'מאיורי',why:'החוף הארוך והנוח ביותר באזור למשפחה.',what:'טיילת רחבה, חוף מסודר, גלידריות ובתי קפה.',time:'1.5–2 שעות',access:'מעבורת קצרה או אוטובוס ממינורי.',photo:'מהקצה המערבי של הטיילת לכיוון ההרים.',practical:'השאירו זמן להתלבש ולהגיע לרציף לפני ההפלגה.',link:maps('Maiori beach')}
    ],
    food:['Villa Maria','Mimì Ristorante Pizzeria'], shopping:['Piazza Duomo והרחובות הסמוכים'],
    tips:['Villa Cimbrone היא החובה; Villa Rufolo היא תוספת.','אל תעשו את שביל הלימונים בצהריים של אוגוסט.','בדקו מראש מאיזה נמל יוצאת המעבורת האחרונה שמתאימה לכם.']
  },
  {
    date:'4.8', weekday:'יום שלישי', title:'פומפיי ונאפולי', image:imageBank.pompeii, intensity:'מלא',
    summary:'נוסעים ברכב לפומפיי, מחנים ליד הכניסה, ממשיכים ברכבת לנאפולי וחוזרים לרכב בערב.',
    transport:{
      mode:'רכב לפומפיי + רכבת לנאפולי + הליכה/מטרו', icon:'🚗',
      overview:'הרכב משמש רק להגיע לפומפיי. הוא נשאר ב־Parking Zeus בזמן הביקור בפומפיי ובנאפולי.',
      fromBase:['יציאה מוקדמת מהלינה וניווט ל־Parking Zeus, Via Villa dei Misteri.','מהחניון הולכים דקות ספורות לכניסת Porta Marina Superiore.'],
      local:['לאחר פומפיי: הליכה לתחנת Pompei Scavi – Villa dei Misteri.','Circumvesuviana לכיוון Napoli Porta Nolana / Garibaldi.','בנאפולי: העיר העתיקה ברגל; Via Toledo במטרו או הליכה ארוכה יותר.','חזרה: מטרו ל־Garibaldi → רכבת ל־Pompei Scavi → איסוף הרכב.'],
      fallback:'אם עייפים אחרי פומפיי, ותרו על נאפולי וחזרו ללינה. אל תיכנסו לנאפולי עם הרכב.'
    },
    parking:{needed:true,name:'Parking Zeus Pompei',address:'Via Villa dei Misteri, Pompei',note:'קרוב ל־Porta Marina ולתחנת Pompei Scavi. ודאו שעות סגירה ושאפשר להשאיר את הרכב עד החזרה מנאפולי.',link:maps('Parking Zeus Pompei')},
    schedule:[['07:15','יציאה ברכב מהלינה'],['08:15','חניה ב־Parking Zeus והליכה לכניסה'],['08:30–09:00','כניסה לפומפיי'],['09:00','הפורום, המרחצאות, בתים ורחובות'],['12:00','יציאה וארוחה קלה'],['13:00','רכבת לנאפולי'],['14:00','Duomo, Via dei Tribunali ו־San Gregorio Armeno'],['15:30','Spaccanapoli ו־Piazza del Gesù'],['16:30','Via Toledo ו־Galleria Umberto I'],['18:30','מטרו/הליכה ל־Garibaldi'],['19:00','רכבת חזרה לפומפיי ואיסוף הרכב']],
    stops:[
      {name:'Porta Marina Superiore',why:'הכניסה הנוחה ביותר למסלול שלכם, קרובה לחניון ולתחנת הרכבת.',what:'שער העיר והעלייה הראשונה אל הרחובות העתיקים.',time:'מעבר',access:'דקות הליכה מ־Parking Zeus.',photo:'בכניסה עם חומות העיר ברקע.',practical:'הכינו כרטיסים מראש כדי לא לבזבז זמן בתור.',link:maps('Porta Marina Superiore Pompeii')},
      {name:'הפורום של פומפיי',why:'המרכז הציבורי של העיר עם נוף מרשים לווזוב.',what:'מקדשים, מבני שלטון, שוק ומרחב הכיכר.',time:'25–35 דקות',access:'אחת התחנות הראשונות לאחר הכניסה.',photo:'מול מקדש יופיטר כאשר וזוב ברקע.',practical:'זה מקום טוב להסביר לילדים כיצד העיר תפקדה לפני ההתפרצות.',link:maps('Pompeii Forum')},
      {name:'המרחצאות',why:'ממחישים היטב את חיי היומיום והטכנולוגיה הרומית.',what:'חדרים חמים וקרים, תקרות מעוטרות ומערכת חימום.',time:'20–30 דקות',access:'הליכה קצרה מהפורום.',photo:'בתוך החדרים המקומרים.',practical:'ייתכנו עומסים; המתינו מספר דקות לקבוצה לצאת.',link:maps('Forum Baths Pompeii')},
      {name:'בית הווטיים או בית עשיר פתוח',why:'הדרך הטובה להבין כיצד חיו משפחות עשירות בעיר.',what:'חצר, ציורי קיר, גנים וחדרי מגורים.',time:'25–35 דקות',access:'לפי מצב הפתיחה באותו יום; בדקו במפת האתר.',photo:'בחצר הפנימית או מול ציורי הקיר.',practical:'לא כל הבתים פתוחים מדי יום — היו גמישים.',link:maps('House of the Vettii Pompeii')},
      {name:'מאפייה ורחובות פומפיי',why:'פרטים שקל לילדים להתחבר אליהם: אוכל, עגלות ומעבר חציה.',what:'אבני ריחיים, תנורים, חריצי גלגלים ואבני מעבר מוגבהות.',time:'30–45 דקות לאורך המסלול',access:'בדרך בין הבתים והפורום.',photo:'על אבני המעבר הגבוהות ברחוב.',practical:'האבנים לא אחידות; נעליים סגורות חובה.',link:maps('Pompeii bakery')},
      {name:'יציקות הנפגעים',why:'ממחישות באופן מרגש וקשה את האסון האנושי.',what:'יציקות של תושבים שנקברו באפר הוולקני.',time:'15–25 דקות',access:'תלוי בתצוגה הפתוחה במסלול ביום הביקור.',photo:'מומלץ לכבד את המקום ולא להפוך אותו לנקודת צילום משפחתית.',practical:'הכינו את בן ה־9 מראש לתוכן הרגיש.',link:maps('Pompeii plaster casts')},
      {name:'Duomo di Napoli',why:'הקתדרלה המרכזית ומקום הקשור לסן ג׳נארו, פטרון העיר.',what:'חזית, פנים הכנסייה וקפלות.',time:'25–40 דקות',access:'הליכה מ־Napoli Garibaldi או מונית קצרה.',photo:'מול החזית ברחוב הצר.',practical:'לבוש מכבד ושמירה על שקט.',link:maps('Naples Cathedral')},
      {name:'Via dei Tribunali',why:'רחוב מרכזי בעיר העתיקה עם פיצריות, כנסיות וחיי רחוב.',what:'אוכל רחוב, חנויות, סמטאות ואווירה נפוליטנית.',time:'60–90 דקות',access:'ממשיך מהדואומו ברגל.',photo:'במרכז הרחוב עם הכנסיות והמרפסות.',practical:'צפוף; תיקים מקדימה וטלפונים לא בכיס אחורי.',link:maps('Via dei Tribunali Naples')},
      {name:'San Gregorio Armeno',why:'רחוב בתי המלאכה המפורסם בפסלונים ובמיניאטורות.',what:'דמויות חג המולד, פוליטיקאים, כדורגלנים ומלאכות יד.',time:'30–45 דקות',access:'סמטה היוצאת מ־Via dei Tribunali.',photo:'בין החנויות הצבעוניות.',practical:'מתאים מאוד לילדים; שימו לב לצפיפות.',link:maps('San Gregorio Armeno Naples')},
      {name:'Spaccanapoli ו־Piazza del Gesù',why:'ציר היסטורי שממחיש את המבנה והאופי של העיר העתיקה.',what:'כנסיות, ארמונות, חנויות וכיכר גדולה.',time:'45–60 דקות',access:'הליכה דרך המרכז העתיק.',photo:'Piazza del Gesù Nuovo והאובליסק.',practical:'אפשר לעצור כאן לאוכל או משקה לפני השופינג.',link:maps('Spaccanapoli Naples')},
      {name:'Via Toledo',why:'רחוב השופינג הטוב ביותר בנאפולי.',what:'רשתות אופנה, נעליים, קוסמטיקה וחנויות מקומיות.',time:'1.5–2 שעות',access:'מטרו לתחנת Toledo או הליכה מ־Piazza del Gesù.',photo:'בכניסה לתחנת Toledo האמנותית.',practical:'שמרו זמן לחזרה לרכבת לפומפיי.',link:maps('Via Toledo Naples')},
      {name:'Galleria Umberto I',why:'גלריה מקורה מרשימה עם כיפת זכוכית, קרובה ל־Via Toledo.',what:'אדריכלות, בתי קפה וחנויות.',time:'25–40 דקות',access:'הליכה קצרה מ־Via Toledo.',photo:'ממרכז הגלריה כלפי מעלה לכיפה.',practical:'עצירה טובה במזגן לפני החזרה.',link:maps('Galleria Umberto I Naples')}
    ],
    food:["L'Antica Pizzeria da Michele",'Di Matteo','Starita'], shopping:['Via Toledo','Galleria Umberto I'],
    tips:['אל תיכנסו לנאפולי עם הרכב בגלל ZTL, תנועה וחניה.','קחו מים, כובע ונעליים סגורות לפומפיי.','לפי רמת הכשרות שלכם, הביאו אוכל מהלינה או תאמו ארוחה מראש.']
  },
  {
    date:'5.8', weekday:'יום רביעי', title:'בוקר רגוע וחזרה לרומא', image:imageBank.sorrento, intensity:'קל',
    summary:'בוקר קצר ליד הלינה, נסיעה צפונה ולינה ליד פיומיצ׳ינו כדי להוריד לחץ מיום הטיסה.',
    transport:{
      mode:'רכב שכור', icon:'🚗',
      overview:'זהו יום נסיעה ארוך יחסית. לא מוסיפים אתר כבד ושומרים מרווח לפקקים.',
      fromBase:['צ׳ק־אאוט והעמסת הרכב.','בוקר קצר ב־Meta או Vico Equense בלבד.','מסלול צפונה: SS145 → A3/E45 → A1 → GRA → A91 לכיוון Fiumicino.'],
      local:['עצירת Autogrill אחת או שתיים בדרך.','הגעה למלון ליד השדה עם חניה, או החזרת הרכב בערב אם התנאים מתאימים.'],
      fallback:'אם יש פקקים משמעותיים, דלגו על ארוחת צהריים ארוכה וסעו ישירות לפיומיצ׳ינו.'
    },
    parking:{needed:true,name:'חניה במלון ליד פיומיצ׳ינו',address:'לפי המלון שתזמינו ללילה 5–6.8',note:'בחרו מלון עם חניה ושאטל לשדה, או החזירו את הרכב כבר בערב אם הטיסה מוקדמת.',link:maps('Fiumicino Airport hotels parking')},
    secondaryParking:[{name:'GPV Piazza Mercato — Vico Equense',note:'אם עושים שיטוט אחרון במרכז לפני היציאה.',link:maps('GPV Parcheggio Piazza Mercato Vico Equense')}],
    schedule:[['08:00','צ׳ק־אאוט והעמסת הרכב'],['09:00','חוף קצר באזור Meta או קפה ב־Vico Equense'],['11:30','ארוחת צהריים מוקדמת'],['13:00','יציאה צפונה'],['16:30–18:00','הגעה למלון ליד השדה'],['19:00','ערב רגוע בפיומיצ׳ינו']],
    stops:[
      {name:'Meta או Vico Equense — בוקר אחרון',why:'פרידה רגועה מהאזור בלי להתרחק מהדרך צפונה.',what:'קפה, טיילת קצרה, חוף או קנייה אחרונה.',time:'1–2 שעות',access:'נסיעה קצרה מהלינה וחניה מקומית.',photo:'הים או התצפית ב־Vico Equense.',practical:'שמרו את המזוודות מוסתרות בתא המטען ואל תשאירו חפצי ערך.',link:maps('Meta Italy beach')},
      {name:'פיומיצ׳ינו — אזור הנמל הישן',why:'ערב נעים ליד השדה עם מסעדות וטיילת לאורך תעלת הדייגים.',what:'סירות דייג, מסעדות והליכה קצרה.',time:'1–2 שעות',access:'נסיעה קצרה מהמלון, בהתאם למיקומו.',photo:'לאורך תעלת Porto Canale.',practical:'אם הטיסה מוקדמת מאוד, עדיף לאכול במלון ולישון מוקדם.',link:maps('Fiumicino old town')}
    ],
    food:[], shopping:[],
    tips:['להזמין לילה 5–6.8 ליד השדה.','לא להשאיר מזוודות או תיקים גלויים בזמן עצירות.','שמרו קבלות דלק וכבישי אגרה עד החזרת הרכב.']
  },
  {
    date:'6.8', weekday:'יום חמישי', title:'החזרת רכב וטיסה', image:imageBank.romeStreet, intensity:'קל',
    summary:'תדלוק, צילום הרכב, החזרה מסודרת והגעה לטרמינל עם מרווח גדול.',
    transport:{
      mode:'רכב שכור → החזרה → שאטל/הליכה לטרמינל', icon:'✈️',
      overview:'תכננו זמן נוסף לתדלוק, מציאת אזור החזרת הרכב והגעה מהסוכנות לטרמינל.',
      fromBase:['צאו מהמלון בהתאם לשעת הטיסה ולתנאי ההשכרה.','תדלקו באזור פיומיצ׳ינו ולא בתחנה האחרונה בתוך השדה בלבד.','נווטו ל־Car Rental Return Fiumicino ולחברת ההשכרה הספציפית.'],
      local:['צלמו את הרכב מכל הצדדים, תא הנוסעים, מד הדלק והקילומטראז׳.','קבלו אישור החזרה בכתב או במייל.','המשיכו לטרמינל בשאטל או ברגל לפי מיקום הסוכנות.'],
      fallback:'אם הסוכנות סגורה, פעלו לפי נוהל Key Drop וצלמו היטב את הרכב והמיקום.'
    },
    parking:{needed:true,name:'אזור החזרת הרכב — Fiumicino Airport',address:'Leonardo da Vinci–Fiumicino Airport',note:'עקבו אחרי השילוט Rent a Car / Autonoleggio ולא אחרי חניון הנוסעים הרגיל.',link:maps('Car Rental Return Fiumicino Airport')},
    schedule:[['לפי הטיסה','יציאה מהמלון'],['4 שעות לפני','תדלוק ונסיעה לאזור החזרת הרכב'],['3.5 שעות לפני','צילום, בדיקה והחזרת מפתחות'],['3 שעות לפני','הגעה לטרמינל, צ׳ק־אין ובידוק']],
    stops:[], food:[], shopping:[],
    tips:['לא להסתמך על תחנת הדלק האחרונה בשדה — לתדלק באזור פיומיצ׳ינו.','בדקו שלא נשאר דבר בתא המטען, בדלתות ומתחת למושבים.','שמרו את אישור ההחזרה עד לקבלת החשבון הסופי.']
  }
];


export const weatherCities = [
  {name:'רומא',lat:41.9028,lng:12.4964},
  {name:'סורנטו',lat:40.6263,lng:14.3758},
  {name:'פוזיטנו',lat:40.6281,lng:14.4850},
  {name:'קפרי',lat:40.5509,lng:14.2429}
];
