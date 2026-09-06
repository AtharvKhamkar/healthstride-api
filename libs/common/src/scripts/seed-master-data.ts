import 'dotenv/config';
import { Client } from 'pg';

const DATABASE_URL = process.env.POSTGRESQL_DATABASE_URL;

if (!DATABASE_URL) {
  console.error(
    'POSTGRESQL_DATABASE_URL is not set. Provide it via environment or apps/auth-service/.env',
  );
  process.exit(1);
}

async function seed() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: false });

  try {
    await client.connect();
    console.log('Connected to database.');

    await client.query('BEGIN');

    // --- mst_specializations ---
    console.log('Seeding master.mst_specializations...');
    await client.query(
      `INSERT INTO master.mst_specializations (specialization_name, description) VALUES
       ('General Medicine','Primary care and general medical practice'),
       ('Family Medicine','Comprehensive healthcare for individuals and families across all ages'),
       ('Internal Medicine','Diagnosis and nonsurgical treatment of diseases in adults'),
       ('Cardiology','Heart and cardiovascular system'),
       ('Cardiothoracic Surgery','Surgical treatment of the heart, lungs, and chest'),
       ('Dermatology','Skin, hair, and nails'),
       ('Dentistry','Oral health and dental care'),
       ('Orthodontics','Correction of teeth and jaw alignment'),
       ('Pediatrics','Medical care of infants, children, and adolescents'),
       ('Neonatology','Care of newborn infants, especially premature or ill'),
       ('Orthopedics','Musculoskeletal system'),
       ('Rheumatology','Autoimmune and inflammatory joint/muscle conditions'),
       ('Gynecology','Female reproductive health'),
       ('Obstetrics','Pregnancy, childbirth, and postpartum care'),
       ('Neurology','Nervous system'),
       ('Neurosurgery','Surgical treatment of the brain and nervous system'),
       ('Ophthalmology','Eye and vision'),
       ('Otolaryngology (ENT)','Ear, nose, and throat disorders'),
       ('Physiotherapy','Physical rehabilitation and therapy'),
       ('Psychiatry','Mental health and emotional well-being'),
       ('Psychology','Assessment and therapy of mental and behavioral health'),
       ('Pediatric Cardiology','Heart conditions in children'),
       ('Endocrinology','Hormonal and metabolic disorders, including diabetes and thyroid'),
       ('Gastroenterology','Digestive system and liver disorders'),
       ('Hepatology','Liver, gallbladder, and biliary tract disorders'),
       ('Pulmonology','Respiratory system and lungs'),
       ('Nephrology','Kidney diseases and disorders'),
       ('Urology','Urinary tract and male reproductive system'),
       ('Hematology','Blood and blood-forming organs'),
       ('Oncology','Cancer diagnosis and treatment'),
       ('Radiation Oncology','Cancer treatment using radiation'),
       ('Infectious Disease','Infections and communicable diseases'),
       ('Allergy and Immunology','Allergies and immune system disorders'),
       ('Anesthesiology','Pain management and anesthesia care'),
       ('Emergency Medicine','Acute and urgent medical care'),
       ('Sports Medicine','Injuries and performance of active individuals'),
       ('Rehabilitation Medicine','Restoring function after injury or illness'),
       ('Geriatrics','Healthcare of the elderly'),
       ('Pathology','Diagnosis via laboratory studies of tissue and fluids'),
       ('Radiology','Medical imaging for diagnosis'),
       ('Plastic Surgery','Reconstructive and cosmetic surgery'),
       ('General Surgery','Surgical treatment of abdominal organs and general conditions'),
       ('Pediatric Surgery','Surgical care of children'),
       ('Vascular Surgery','Surgical treatment of blood vessels'),
       ('Pain Management','Treatment of chronic pain'),
       ('Sleep Medicine','Diagnosis and treatment of sleep disorders'),
       ('Occupational Therapy','Helping patients perform daily activities'),
       ('Speech Therapy','Assessment and treatment of speech and communication disorders'),
       ('Nutrition and Dietetics','Diet and nutritional guidance for health'),
       ('Ayurveda','Traditional Ayurvedic medicine'),
       ('Homeopathy','Homeopathic medicine and remedies'),
       ('Unani Medicine','Traditional Unani-system medical practice'),
       ('Alternative Medicine','Non-conventional therapeutic approaches'),
       ('Cosmetology','Skin and aesthetic cosmetic treatments'),
       ('Chiropractic','Manual therapy of the musculoskeletal system'),
       ('Acupuncture','Traditional Chinese medicine technique using needles'),
       ('Veterinary Medicine','Healthcare of animals')
       ON CONFLICT (specialization_name) DO NOTHING`,
    );

    // --- mst_country_codes ---
    console.log('Seeding master.mst_country_codes...');
    await client.query(
      `INSERT INTO master.mst_country_codes (country_code, country_name, calling_code) VALUES
       ('AF','Afghanistan','+93'),('AL','Albania','+355'),('DZ','Algeria','+213'),('AD','Andorra','+376'),('AO','Angola','+244'),('AG','Antigua and Barbuda','+1-268'),('AR','Argentina','+54'),('AM','Armenia','+374'),('AU','Australia','+61'),('AT','Austria','+43'),('AZ','Azerbaijan','+994'),('BS','Bahamas','+1-242'),('BH','Bahrain','+973'),('BD','Bangladesh','+880'),('BB','Barbados','+1-246'),('BY','Belarus','+375'),('BE','Belgium','+32'),('BZ','Belize','+501'),('BJ','Benin','+229'),('BT','Bhutan','+975'),('BO','Bolivia','+591'),('BA','Bosnia and Herzegovina','+387'),('BW','Botswana','+267'),('BR','Brazil','+55'),('BN','Brunei','+673'),('BG','Bulgaria','+359'),('BF','Burkina Faso','+226'),('BI','Burundi','+257'),('KH','Cambodia','+855'),('CM','Cameroon','+237'),('CA','Canada','+1'),('CV','Cape Verde','+238'),('CF','Central African Republic','+236'),('TD','Chad','+235'),('CL','Chile','+56'),('CN','China','+86'),('CO','Colombia','+57'),('KM','Comoros','+269'),('CG','Congo','+242'),('CR','Costa Rica','+506'),('HR','Croatia','+385'),('CU','Cuba','+53'),('CY','Cyprus','+357'),('CZ','Czech Republic','+420'),('DK','Denmark','+45'),('DJ','Djibouti','+253'),('DM','Dominica','+1-767'),('DO','Dominican Republic','+1-809'),('EC','Ecuador','+593'),('EG','Egypt','+20'),('SV','El Salvador','+503'),('GQ','Equatorial Guinea','+240'),('ER','Eritrea','+291'),('EE','Estonia','+372'),('SZ','Eswatini','+268'),('ET','Ethiopia','+251'),('FJ','Fiji','+679'),('FI','Finland','+358'),('FR','France','+33'),('GA','Gabon','+241'),('GM','Gambia','+220'),('GE','Georgia','+995'),('DE','Germany','+49'),('GH','Ghana','+233'),('GR','Greece','+30'),('GD','Grenada','+1-473'),('GT','Guatemala','+502'),('GN','Guinea','+224'),('GW','Guinea-Bissau','+245'),('GY','Guyana','+592'),('HT','Haiti','+509'),('HN','Honduras','+504'),('HU','Hungary','+36'),('IS','Iceland','+354'),('IN','India','+91'),('ID','Indonesia','+62'),('IR','Iran','+98'),('IQ','Iraq','+964'),('IE','Ireland','+353'),('IL','Israel','+972'),('IT','Italy','+39'),('JM','Jamaica','+1-876'),('JP','Japan','+81'),('JO','Jordan','+962'),('KZ','Kazakhstan','+7'),('KE','Kenya','+254'),('KI','Kiribati','+686'),('KW','Kuwait','+965'),('KG','Kyrgyzstan','+996'),('LA','Laos','+856'),('LV','Latvia','+371'),('LB','Lebanon','+961'),('LS','Lesotho','+266'),('LR','Liberia','+231'),('LY','Libya','+218'),('LI','Liechtenstein','+423'),('LT','Lithuania','+370'),('LU','Luxembourg','+352'),('MG','Madagascar','+261'),('MW','Malawi','+265'),('MY','Malaysia','+60'),('MV','Maldives','+960'),('ML','Mali','+223'),('MT','Malta','+356'),('MH','Marshall Islands','+692'),('MR','Mauritania','+222'),('MU','Mauritius','+230'),('MX','Mexico','+52'),('FM','Micronesia','+691'),('MD','Moldova','+373'),('MC','Monaco','+377'),('MN','Mongolia','+976'),('ME','Montenegro','+382'),('MA','Morocco','+212'),('MZ','Mozambique','+258'),('MM','Myanmar','+95'),('NA','Namibia','+264'),('NR','Nauru','+674'),('NP','Nepal','+977'),('NL','Netherlands','+31'),('NZ','New Zealand','+64'),('NI','Nicaragua','+505'),('NE','Niger','+227'),('NG','Nigeria','+234'),('KP','North Korea','+850'),('MK','North Macedonia','+389'),('NO','Norway','+47'),('OM','Oman','+968'),('PK','Pakistan','+92'),('PW','Palau','+680'),('PA','Panama','+507'),('PG','Papua New Guinea','+675'),('PY','Paraguay','+595'),('PE','Peru','+51'),('PH','Philippines','+63'),('PL','Poland','+48'),('PT','Portugal','+351'),('QA','Qatar','+974'),('RO','Romania','+40'),('RU','Russia','+7'),('RW','Rwanda','+250'),('KN','Saint Kitts and Nevis','+1-869'),('LC','Saint Lucia','+1-758'),('VC','Saint Vincent and the Grenadines','+1-784'),('WS','Samoa','+685'),('SM','San Marino','+378'),('SA','Saudi Arabia','+966'),('SN','Senegal','+221'),('RS','Serbia','+381'),('SC','Seychelles','+248'),('SL','Sierra Leone','+232'),('SG','Singapore','+65'),('SK','Slovakia','+421'),('SI','Slovenia','+386'),('SB','Solomon Islands','+677'),('SO','Somalia','+252'),('ZA','South Africa','+27'),('KR','South Korea','+82'),('SS','South Sudan','+211'),('ES','Spain','+34'),('LK','Sri Lanka','+94'),('SD','Sudan','+249'),('SR','Suriname','+597'),('SE','Sweden','+46'),('CH','Switzerland','+41'),('SY','Syria','+963'),('TW','Taiwan','+886'),('TJ','Tajikistan','+992'),('TZ','Tanzania','+255'),('TH','Thailand','+66'),('TG','Togo','+228'),('TO','Tonga','+676'),('TT','Trinidad and Tobago','+1-868'),('TN','Tunisia','+216'),('TR','Turkey','+90'),('TM','Turkmenistan','+993'),('TV','Tuvalu','+688'),('UG','Uganda','+256'),('UA','Ukraine','+380'),('AE','United Arab Emirates','+971'),('GB','United Kingdom','+44'),('US','United States','+1'),('UY','Uruguay','+598'),('UZ','Uzbekistan','+998'),('VU','Vanuatu','+678'),('VA','Vatican City','+379'),('VE','Venezuela','+58'),('VN','Vietnam','+84'),('YE','Yemen','+967'),('ZM','Zambia','+260'),('ZW','Zimbabwe','+263')
       ON CONFLICT (country_code) DO NOTHING`,
    );

    // --- mst_currencies ---
    console.log('Seeding master.mst_currencies...');
    await client.query(
      `INSERT INTO master.mst_currencies (currency_code, currency_name, currency_symbol) VALUES
       ('AED','UAE Dirham','د.إ'),('AFN','Afghan Afghani','؋'),('ALL','Albanian Lek','L'),('AMD','Armenian Dram','֏'),('ANG','Netherlands Antillean Guilder','ƒ'),('AOA','Angolan Kwanza','Kz'),('ARS','Argentine Peso','$'),('AUD','Australian Dollar','$'),('AWG','Aruban Florin','ƒ'),('AZN','Azerbaijani Manat','₼'),('BAM','Bosnia-Herzegovina Convertible Mark','KM'),('BBD','Barbadian Dollar','$'),('BDT','Bangladeshi Taka','৳'),('BGN','Bulgarian Lev','лв'),('BHD','Bahraini Dinar','.د.ب'),('BIF','Burundian Franc','Fr'),('BMD','Bermudian Dollar','$'),('BND','Brunei Dollar','$'),('BOB','Bolivian Boliviano','Bs.'),('BRL','Brazilian Real','R$'),('BSD','Bahamian Dollar','$'),('BTN','Bhutanese Ngultrum','Nu.'),('BWP','Botswana Pula','P'),('BYN','Belarusian Ruble','Br'),('BZD','Belize Dollar','$'),('CAD','Canadian Dollar','$'),('CDF','Congolese Franc','Fr'),('CHF','Swiss Franc','Fr'),('CLP','Chilean Peso','$'),('CNY','Chinese Yuan','¥'),('COP','Colombian Peso','$'),('CRC','Costa Rican Colón','₡'),('CUP','Cuban Peso','$'),('CVE','Cape Verdean Escudo','$'),('CZK','Czech Koruna','Kč'),('DJF','Djiboutian Franc','Fr'),('DKK','Danish Krone','kr'),('DOP','Dominican Peso','RD$'),('DZD','Algerian Dinar','د.ج'),('EGP','Egyptian Pound','£'),('ERN','Eritrean Nakfa','Nfk'),('ETB','Ethiopian Birr','Br'),('EUR','Euro','€'),('FJD','Fijian Dollar','$'),('FKP','Falkland Islands Pound','£'),('GBP','British Pound','£'),('GEL','Georgian Lari','₾'),('GHS','Ghanaian Cedi','₵'),('GIP','Gibraltar Pound','£'),('GMD','Gambian Dalasi','D'),('GNF','Guinean Franc','Fr'),('GTQ','Guatemalan Quetzal','Q'),('GYD','Guyanese Dollar','$'),('HKD','Hong Kong Dollar','$'),('HNL','Honduran Lempira','L'),('HRK','Croatian Kuna','kn'),('HTG','Haitian Gourde','G'),('HUF','Hungarian Forint','Ft'),('IDR','Indonesian Rupiah','Rp'),('ILS','Israeli New Shekel','₪'),('INR','Indian Rupee','₹'),('IQD','Iraqi Dinar','ع.د'),('IRR','Iranian Rial','﷼'),('ISK','Icelandic Króna','kr'),('JMD','Jamaican Dollar','$'),('JOD','Jordanian Dinar','د.ا'),('JPY','Japanese Yen','¥'),('KES','Kenyan Shilling','Sh'),('KGS','Kyrgyzstani Som','с'),('KHR','Cambodian Riel','៛'),('KMF','Comorian Franc','Fr'),('KPW','North Korean Won','₩'),('KRW','South Korean Won','₩'),('KWD','Kuwaiti Dinar','د.ك'),('KYD','Cayman Islands Dollar','$'),('KZT','Kazakhstani Tenge','₸'),('LAK','Lao Kip','₭'),('LBP','Lebanese Pound','ل.ل'),('LKR','Sri Lankan Rupee','Rs'),('LRD','Liberian Dollar','$'),('LSL','Lesotho Loti','L'),('LYD','Libyan Dinar','ل.د'),('MAD','Moroccan Dirham','د.م.'),('MDL','Moldovan Leu','L'),('MGA','Malagasy Ariary','Ar'),('MKD','Macedonian Denar','ден'),('MMK','Myanmar Kyat','Ks'),('MNT','Mongolian Tögrög','₮'),('MOP','Macanese Pataca','P'),('MRU','Mauritanian Ouguiya','UM'),('MUR','Mauritian Rupee','₨'),('MVR','Maldivian Rufiyaa','Rf'),('MWK','Malawian Kwacha','MK'),('MXN','Mexican Peso','$'),('MYR','Malaysian Ringgit','RM'),('MZN','Mozambican Metical','MT'),('NAD','Namibian Dollar','$'),('NGN','Nigerian Naira','₦'),('NIO','Nicaraguan Córdoba','C$'),('NOK','Norwegian Krone','kr'),('NPR','Nepalese Rupee','₨'),('NZD','New Zealand Dollar','$'),('OMR','Omani Rial','ر.ع.'),('PAB','Panamanian Balboa','B/.'),('PEN','Peruvian Sol','S/'),('PGK','Papua New Guinean Kina','K'),('PHP','Philippine Peso','₱'),('PKR','Pakistani Rupee','₨'),('PLN','Polish Złoty','zł'),('PYG','Paraguayan Guaraní','₲'),('QAR','Qatari Riyal','ر.ق'),('RON','Romanian Leu','lei'),('RSD','Serbian Dinar','дин'),('RUB','Russian Ruble','₽'),('RWF','Rwandan Franc','Fr'),('SAR','Saudi Riyal','﷼'),('SBD','Solomon Islands Dollar','$'),('SCR','Seychellois Rupee','₨'),('SDG','Sudanese Pound','ج.س.'),('SEK','Swedish Krona','kr'),('SGD','Singapore Dollar','S$'),('SHP','Saint Helena Pound','£'),('SLL','Sierra Leonean Leone','Le'),('SOS','Somali Shilling','Sh'),('SRD','Surinamese Dollar','$'),('SSP','South Sudanese Pound','£'),('STN','São Tomé and Príncipe Dobra','Db'),('SYP','Syrian Pound','£S'),('SZL','Swazi Lilangeni','L'),('THB','Thai Baht','฿'),('TJS','Tajikistani Somoni','SM'),('TMT','Turkmenistani Manat','m'),('TND','Tunisian Dinar','د.ت'),('TOP','Tongan Paʻanga','T$'),('TRY','Turkish Lira','₺'),('TTD','Trinidad and Tobago Dollar','$'),('TWD','New Taiwan Dollar','NT$'),('TZS','Tanzanian Shilling','Sh'),('UAH','Ukrainian Hryvnia','₴'),('UGX','Ugandan Shilling','USh'),('USD','US Dollar','$'),('UYU','Uruguayan Peso','$'),('UZS','Uzbekistani Soʻm','soʻm'),('VES','Venezuelan Bolívar','Bs'),('VND','Vietnamese Đồng','₫'),('VUV','Vanuatu Vatu','Vt'),('WST','Samoan Tālā','T'),('XAF','Central African CFA Franc','Fr'),('XCD','East Caribbean Dollar','$'),('XOF','West African CFA Franc','Fr'),('XPF','CFP Franc','₣'),('YER','Yemeni Rial','﷼'),('ZAR','South African Rand','R'),('ZMW','Zambian Kwacha','ZK'),('ZWL','Zimbabwean Dollar','$')
       ON CONFLICT (currency_code) DO NOTHING`,
    );

    // --- mst_health_data_sources ---
    console.log('Seeding master.mst_health_data_sources...');
    await client.query(
      `INSERT INTO master.mst_health_data_sources (source_code, source_name, description) VALUES
       ('GOOGLE_FIT','Google Fit','Google Fit health data'),
       ('APPLE_HEALTH','Apple HealthKit','Apple HealthKit health data'),
       ('MANUAL','Manual Entry','Health data entered manually'),
       ('FITBIT','Fitbit','Fitbit wearable health data'),
       ('SAMSUNG','Samsung Health','Samsung Health data'),
       ('GARMIN','Garmin','Garmin health data')
       ON CONFLICT (source_code) DO NOTHING`,
    );

    // --- mst_roles ---
    console.log('Seeding master.mst_roles...');
    await client.query(
      `INSERT INTO master.mst_roles (role_name, description) VALUES
       ('SUPER_ADMIN','Super admin with full system access'),
       ('CLINIC_OWNER','Owner of a clinic'),
       ('DOCTOR','Doctor within a clinic'),
       ('STAFF','Clinic staff member'),
       ('PATIENT','Patient'),
       ('ADMIN','System administrator')
       ON CONFLICT (role_name) DO NOTHING`,
    );

    // --- mst_permissions ---
    console.log('Seeding master.mst_permissions...');
    await client.query(
      `INSERT INTO master.mst_permissions (permission_key, module, description) VALUES
       ('user.create','user','Create a user'),
       ('user.read','user','Read a user'),
       ('user.update','user','Update a user'),
       ('user.delete','user','Delete a user'),
       ('clinic.create','clinic','Create a clinic'),
       ('clinic.read','clinic','Read a clinic'),
       ('clinic.update','clinic','Update a clinic'),
       ('clinic.delete','clinic','Delete a clinic'),
       ('doctor.create','doctor','Create a doctor'),
       ('doctor.read','doctor','Read a doctor'),
       ('doctor.update','doctor','Update a doctor'),
       ('doctor.delete','doctor','Delete a doctor'),
       ('patient.create','patient','Create a patient'),
       ('patient.read','patient','Read a patient'),
       ('patient.update','patient','Update a patient'),
       ('patient.delete','patient','Delete a patient')
       ON CONFLICT (permission_key) DO NOTHING`,
    );

    await client.query('COMMIT');
    console.log('Master data seeded successfully.');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Seeding failed, rolled back.', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seed();
