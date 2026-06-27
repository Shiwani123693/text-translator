import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Translator() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const panelRef = useRef(null);

  // Every single language fully mapped with its matching Microsoft Cloud Edge TTS voice profile
  const languages = [
    { code: 'af', name: 'Afrikaans', voice: 'af-ZA-WillemNeural' },
    { code: 'sq', name: 'Albanian', voice: 'sq-AL-IlirNeural' },
    { code: 'am', name: 'Amharic', voice: 'am-ET-AmehaNeural' },
    { code: 'ar', name: 'Arabic', voice: 'ar-EG-SalmaNeural' },
    { code: 'hy', name: 'Armenian', voice: 'hy-AM-AramNeural' },
    { code: 'as', name: 'Assamese', voice: 'as-IN-YashNeural' },
    { code: 'ay', name: 'Aymara', voice: 'es-BO-MarceloNeural' }, 
    { code: 'az', name: 'Azerbaijani', voice: 'az-AZ-BabekNeural' },
    { code: 'bm', name: 'Bambara', voice: 'fr-FR-EloiseNeural' },
    { code: 'eu', name: 'Basque', voice: 'eu-ES-AinhoaNeural' },
    { code: 'be', name: 'Belarusian', voice: 'be-BY-DmitryNeural' },
    { code: 'bn', name: 'Bengali', voice: 'bn-IN-BashkarNeural' },
    { code: 'bho', name: 'Bhojpuri', voice: 'hi-IN-MadhurNeural' },
    { code: 'bs', name: 'Bosnian', voice: 'bs-BA-GoranNeural' },
    { code: 'bg', name: 'Bulgarian', voice: 'bg-BG-BorislavNeural' },
    { code: 'ca', name: 'Catalan', voice: 'ca-ES-JoanaNeural' },
    { code: 'ceb', name: 'Cebuano', voice: 'fil-PH-AngeloNeural' },
    { code: 'ny', name: 'Chichewa', voice: 'en-ZA-LukeNeural' },
    { code: 'zh', name: 'Chinese (Simplified)', voice: 'zh-CN-XiaoxiaoNeural' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', voice: 'zh-TW-HsiaoChenNeural' },
    { code: 'co', name: 'Corsican', voice: 'fr-FR-RemyNeural' },
    { code: 'hr', name: 'Croatian', voice: 'hr-HR-SreckoNeural' },
    { code: 'cs', name: 'Czech', voice: 'cs-CZ-AntoninNeural' },
    { code: 'da', name: 'Danish', voice: 'da-DK-JeppeNeural' },
    { code: 'dv', name: 'Dhivehi', voice: 'en-IN-PrabhatNeural' },
    { code: 'doi', name: 'Dogri', voice: 'hi-IN-MadhurNeural' },
    { code: 'nl', name: 'Dutch', voice: 'nl-NL-ColetteNeural' },
    { code: 'en', name: 'English', voice: 'en-US-AriaNeural' },
    { code: 'eo', name: 'Esperanto', voice: 'en-US-GuyNeural' },
    { code: 'et', name: 'Estonian', voice: 'et-EE-KertNeural' },
    { code: 'ee', name: 'Ewe', voice: 'en-GH-AnnanNeural' },
    { code: 'tl', name: 'Filipino', voice: 'fil-PH-BlessicaNeural' },
    { code: 'fi', name: 'Finnish', voice: 'fi-FI-HarriNeural' },
    { code: 'fr', name: 'French', voice: 'fr-FR-DeniseNeural' },
    { code: 'fy', name: 'Frisian', voice: 'nl-NL-MaartenNeural' },
    { code: 'gl', name: 'Galician', voice: 'gl-ES-RoiNeural' },
    { code: 'ka', name: 'Georgian', voice: 'ka-GE-GiorgiNeural' },
    { code: 'de', name: 'German', voice: 'de-DE-ConradNeural' },
    { code: 'el', name: 'Greek', voice: 'el-GR-NestorasNeural' },
    { code: 'gn', name: 'Guarani', voice: 'es-PY-JorgeNeural' },
    { code: 'gu', name: 'Gujarati', voice: 'gu-IN-DhwaniNeural' },
    { code: 'ht', name: 'Haitian Creole', voice: 'fr-FR-RemyNeural' },
    { code: 'ha', name: 'Hausa', voice: 'ha-NG-AliyuNeural' },
    { code: 'haw', name: 'Hawaiian', voice: 'en-US-AriaNeural' },
    { code: 'iw', name: 'Hebrew', voice: 'he-IL-AvriNeural' },
    { code: 'hi', name: 'Hindi', voice: 'hi-IN-MadhurNeural' },
    { code: 'hmn', name: 'Hmong', voice: 'zh-CN-YunxiNeural' },
    { code: 'hu', name: 'Hungarian', voice: 'hu-HU-TamasNeural' },
    { code: 'is', name: 'Icelandic', voice: 'is-IS-GunnarNeural' },
    { code: 'ig', name: 'Igbo', voice: 'ig-NG-NnamdiNeural' },
    { code: 'ilo', name: 'Ilocano' , voice: 'fil-PH-AngeloNeural'},
    { code: 'id', name: 'Indonesian', voice: 'id-ID-ArdiNeural' },
    { code: 'ga', name: 'Irish', voice: 'ga-IE-ColmNeural' },
    { code: 'it', name: 'Italian', voice: 'it-IT-ElsaNeural' },
    { code: 'ja', name: 'Japanese', voice: 'ja-JP-NanamiNeural' },
    { code: 'jw', name: 'Javanese', voice: 'jv-ID-DimasNeural' },
    { code: 'kn', name: 'Kannada', voice: 'kn-IN-GaganNeural' },
    { code: 'kk', name: 'Kazakh', voice: 'kk-KZ-DauletNeural' },
    { code: 'km', name: 'Khmer', voice: 'km-KH-PisethNeural' },
    { code: 'rw', name: 'Kinyarwanda', voice: 'en-TZ-ElimuNeural' },
    { code: 'gom', name: 'Konkani', voice: 'hi-IN-SwaraNeural' },
    { code: 'ko', name: 'Korean', voice: 'ko-KR-SunHiNeural' },
    { code: 'kri', name: 'Krio', voice: 'en-NG-AbeoNeural' },
    { code: 'ku', name: 'Kurdish (Kurmanji)', voice: 'tr-TR-AhmetNeural' },
    { code: 'ckb', name: 'Kurdish (Sorani)', voice: 'ar-IQ-BasselNeural' },
    { code: 'ky', name: 'Kyrgyz', voice: 'ru-RU-DmitryNeural' },
    { code: 'lo', name: 'Lao', voice: 'lo-LA-ChanthavongNeural' },
    { code: 'la', name: 'Latin', voice: 'it-IT-DiegoNeural' },
    { code: 'lv', name: 'Latvian', voice: 'lv-LV-NilsNeural' },
    { code: 'ln', name: 'Lingala', voice: 'fr-CD-CharlineNeural' },
    { code: 'lt', name: 'Lithuanian', voice: 'lt-LT-LeonasNeural' },
    { code: 'lg', name: 'Luganda', voice: 'en-UG-AsasiNeural' },
    { code: 'lb', name: 'Luxembourgish', voice: 'de-DE-KillianNeural' },
    { code: 'mk', name: 'Macedonian', voice: 'mk-MK-AleksandarNeural' },
    { code: 'mai', name: 'Maithili', voice: 'hi-IN-SwaraNeural' },
    { code: 'mg', name: 'Malagasy', voice: 'fr-MG-MahavalonaNeural' },
    { code: 'ms', name: 'Malay', voice: 'ms-MY-OsmanNeural' },
    { code: 'ml', name: 'Malayalam', voice: 'ml-IN-MidhunNeural' },
    { code: 'mt', name: 'Maltese', voice: 'mt-MT-JosephNeural' },
    { code: 'mi', name: 'Maori', voice: 'en-NZ-MitchellNeural' },
    { code: 'mr', name: 'Marathi', voice: 'mr-IN-ManoharNeural' },
    { code: 'mni-Mtei', name: 'Meiteilon (Manipuri)', voice: 'bn-IN-BashkarNeural' },
    { code: 'lus', name: 'Mizo', voice: 'en-IN-PrabhatNeural' },
    { code: 'mn', name: 'Mongolian', voice: 'mn-MN-BataaNeural' },
    { code: 'my', name: 'Myanmar (Burmese)', voice: 'my-MM-ThihaNeural' },
    { code: 'ne', name: 'Nepali', voice: 'ne-NP-SagarNeural' },
    { code: 'no', name: 'Norwegian', voice: 'no-NO-FinnNeural' },
    { code: 'or', name: 'Odia (Oriya)', voice: 'hi-IN-MadhurNeural' },
    { code: 'om', name: 'Oromo', voice: 'en-KE-AsiliNeural' },
    { code: 'ps', name: 'Pashto', voice: 'ps-AF-GulKhanNeural' },
    { code: 'fa', name: 'Persian', voice: 'fa-IR-DilaraNeural' },
    { code: 'pl', name: 'Polish', voice: 'pl-PL-MarekNeural' },
    { code: 'pt', name: 'Portuguese', voice: 'pt-BR-AntonioNeural' },
    { code: 'pa', name: 'Punjabi', voice: 'pa-IN-HarjitNeural' },
    { code: 'qu', name: 'Quechua', voice: 'es-PE-AlexNeural' },
    { code: 'ro', name: 'Romanian', voice: 'ro-RO-EmilNeural' },
    { code: 'ru', name: 'Russian', voice: 'ru-RU-DmitryNeural' },
    { code: 'sm', name: 'Samoan', voice: 'en-NZ-MitchellNeural' },
    { code: 'sa', name: 'Sanskrit', voice: 'hi-IN-SwaraNeural' },
    { code: 'gd', name: 'Scots Gaelic', voice: 'en-GB-RyanNeural' },
    { code: 'nso', name: 'Sepedi', voice: 'en-ZA-LukeNeural' },
    { code: 'sr', name: 'Serbian', voice: 'sr-RS-NicholasNeural' },
    { code: 'st', name: 'Sesotho', voice: 'en-ZA-LukeNeural' },
    { code: 'sn', name: 'Shona', voice: 'en-ZW-AdhiamboNeural' },
    { code: 'sd', name: 'Sindhi', voice: 'ur-PK-AsadNeural' },
    { code: 'si', name: 'Sinhala', voice: 'si-LK-SameeraNeural' },
    { code: 'sk', name: 'Slovak', voice: 'sk-SK-LukasNeural' },
    { code: 'sl', name: 'Slovenian', voice: 'sl-SI-RokNeural' },
    { code: 'so', name: 'Somali', voice: 'so-SO-MuuseNeural' },
    { code: 'es', name: 'Spanish', voice: 'es-ES-AlvaroNeural' },
    { code: 'su', name: 'Sundanese', voice: 'su-ID-JajangNeural' },
    { code: 'sw', name: 'Swahili', voice: 'sw-KE-RafikiNeural' },
    { code: 'sv', name: 'Swedish', voice: 'sv-SE-MattiasNeural' },
    { code: 'tg', name: 'Tajik', voice: 'ru-RU-DmitryNeural' },
    { code: 'ta', name: 'Tamil', voice: 'ta-IN-ValluvarNeural' },
    { code: 'tt', name: 'Tatar', voice: 'ru-RU-SvetlanaNeural' },
    { code: 'te', name: 'Telugu', voice: 'te-IN-MohanNeural' },
    { code: 'th', name: 'Thai', voice: 'th-TH-NiwatNeural' },
    { code: 'ti', name: 'Tigrinya', voice: 'ti-ET-YohannesNeural' },
    { code: 'ts', name: 'Tsonga', voice: 'en-ZA-LukeNeural' },
    { code: 'tr', name: 'Turkish', voice: 'tr-TR-AhmetNeural' },
    { code: 'tk', name: 'Turkmen', voice: 'ru-RU-DmitryNeural' },
    { code: 'ak', name: 'Twi', voice: 'en-GH-AnnanNeural' },
    { code: 'uk', name: 'Ukrainian', voice: 'uk-UA-OstapNeural' },
    { code: 'ur', name: 'Urdu', voice: 'ur-PK-AsadNeural' },
    { code: 'ug', name: 'Uyghur', voice: 'zh-CN-YunxiNeural' },
    { code: 'uz', name: 'Uzbek', voice: 'uz-UZ-SardorNeural' },
    { code: 'vi', name: 'Vietnamese', voice: 'vi-VN-NamMinhNeural' },
    { code: 'cy', name: 'Welsh', voice: 'cy-GB-AledNeural' },
    { code: 'xh', name: 'Xhosa', voice: 'en-ZA-LukeNeural' },
    { code: 'yi', name: 'Yiddish', voice: 'de-DE-ConradNeural' },
    { code: 'yo', name: 'Yoruba', voice: 'yo-NG-WaleNeural' },
    { code: 'zu', name: 'Zulu', voice: 'zu-ZA-ThembaNeural' }
  ];

  const [targetLang, setTargetLang] = useState({ code: 'es', name: 'Spanish', voice: 'es-ES-AlvaroNeural' });

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please switch to Google Chrome or Microsoft Edge!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        if (event.results && event.results[0]) {
          setText(event.results[0][0].transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  const speakTextCloud = async (textToSpeak, targetVoiceProfile) => {
    if (!textToSpeak) return;
    setAudioLoading(true);

    const API_KEY = "4354da9834mshb6c8cb67a91ff4ap17458bjsnbf7a4c4a7bbb";
    const API_HOST = "streamlined-edge-tts.p.rapidapi.com";

    try {
      const response = await axios.request({
        method: 'POST',
        url: 'https://streamlined-edge-tts.p.rapidapi.com/tts',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST
        },
        data: {
          voice: targetVoiceProfile,
          text: textToSpeak
        },
        responseType: 'blob'
      });

      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error("Cloud text synthesization dropped:", error);
      alert("Cloud Audio failed to generate voice file.");
    } finally {
      setAudioLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setTranslatedText('');

    const API_KEY = "4354da9834mshb6c8cb67a91ff4ap17458bjsnbf7a4c4a7bbb";
    const API_HOST = "google-translate113.p.rapidapi.com";

    const encodedParams = new URLSearchParams();
    encodedParams.append('from', 'auto');
    encodedParams.append('to', targetLang.code);
    encodedParams.append('text', text);

    try {
      const response = await axios.request({
        method: 'POST',
        url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST
        },
        data: encodedParams
      });
      setTranslatedText(response.data.trans || "No text received.");
    } catch (error) {
      setTranslatedText('Translation request failed.');
    } finally {
      setLoading(false);
    }
  };

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 text-white relative">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">🌍 Smart Text Translator</h2>
      
      <div className="space-y-4">
        {/* Source Text Input Deck */}
        <div className="relative bg-gray-800 rounded-xl p-1 border border-gray-700">
          <textarea
            className="w-full p-4 bg-transparent focus:outline-none text-white resize-none h-32 text-lg pb-12 pr-10"
            placeholder="Type your English phrase here or hit the mic button..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          {/* ✖ Dedicated Clear Text Button (Appears only when there's input text) */}
          {text && (
            <button
              type="button"
              onClick={() => {
                setText('');
                setTranslatedText('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-full w-6 h-6 flex items-center justify-center transition-all text-xs font-bold shadow"
              title="Clear text input"
            >
              ✕
            </button>
          )}

          <div className="absolute bottom-2 left-4 flex items-center space-x-3">
            <button
              type="button"
              onClick={startListening}
              className={`p-2.5 rounded-full transition-all text-sm ${
                isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title="Click to speak"
            >
              🎤
            </button>
            <button
              type="button"
              onClick={() => speakTextCloud(text, 'en-US-AriaNeural')}
              className="p-2.5 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition text-sm"
              title="Listen to original text"
            >
              🔊
            </button>
          </div>
        </div>

        {/* Target Language Selection Bar Layout */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4" ref={panelRef}>
          <div className="relative flex-grow">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 text-left focus:outline-none flex justify-between items-center transition"
            >
              <div>
                <span className="text-xs text-gray-400 block tracking-wider uppercase">Translate Into</span>
                <span className="text-base font-semibold text-indigo-300">{targetLang.name}</span>
              </div>
              <span className="bg-gray-700 px-3 py-1 rounded-md text-xs font-mono text-gray-300">
                {isOpen ? 'CLOSE ▲' : 'VIEW ALL LANGUAGES ▼'}
              </span>
            </button>

            {/* Language Selection Grid Drop Panel Panel */}
            {isOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-gray-950 border border-gray-700 rounded-2xl shadow-2xl z-50 p-4">
                <div className="flex items-center space-x-3 mb-4 bg-gray-900 p-2 rounded-xl border border-gray-800">
                  <span className="text-gray-500 pl-2">🔍</span>
                  <input
                    type="text"
                    placeholder="Type to filter instantly..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-1.5 text-sm bg-transparent outline-none text-white placeholder-gray-500"
                    autoFocus
                  />
                </div>

                <div className="max-h-64 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 scrollbar-thin">
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setTargetLang(lang);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      className={`text-left px-3 py-2 text-xs rounded-lg transition-all truncate ${
                        targetLang.code === lang.code ? 'bg-indigo-600 text-white font-bold' : 'bg-gray-900 hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleTranslate}
            disabled={loading}
            className="sm:w-44 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center text-base"
          >
            {loading ? 'Working...' : 'Translate Now'}
          </button>
        </div>

        {/* Output Screen Container Box with Cloud Audio Engine */}
        <div className="relative bg-gray-950 rounded-xl p-1 border border-gray-850">
          <div className="w-full p-4 bg-transparent h-32 text-lg text-gray-100 overflow-auto whitespace-pre-wrap pb-14">
            {translatedText || <span className="text-gray-600 italic text-base">Your translation will appear here...</span>}
          </div>
          
          <div className="absolute bottom-2 left-4">
            <button
              type="button"
              onClick={() => speakTextCloud(translatedText, targetLang.voice)}
              disabled={!translatedText || audioLoading}
              className={`p-2 px-3 text-xs font-semibold rounded-full border transition flex items-center space-x-1 ${
                translatedText && !audioLoading
                  ? 'bg-indigo-900/40 text-indigo-300 border-indigo-800 hover:bg-indigo-800 hover:text-white shadow-md cursor-pointer' 
                  : 'bg-gray-900 text-gray-600 border-gray-850 opacity-50 cursor-not-allowed'
              }`}
            >
              <span>🔊</span> 
              <span>{audioLoading ? 'Generating Cloud Audio...' : 'Listen Out Loud'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}