export type Project = {
  slug: string
  title: string
  tagline: string
  description: string
  tech: string[]
  github?: string
  live?: string
  report?: string
  category: 'AI/ML' | 'FinTech' | 'Full-Stack' | 'Data Science'
  accent: string
  featured?: boolean
  year: string
}

export const projects: Project[] = [
  {
    slug: 'finsentry',
    title: 'FinSentry',
    tagline: 'AML transaction monitoring & alert queue',
    description:
      'Flags suspicious accounts the way a bank AML team does — a 9-typology rule engine (structuring, smurfing, round-tripping), an IsolationForest + LOF + Mahalanobis anomaly ensemble and NetworkX money-flow graph analysis, blended into an explainable 0–100 risk score with ranked alerts. 0.93 precision / 0.90 recall against injected ground truth on synthetic data.',
    tech: ['Python', 'scikit-learn', 'NetworkX', 'SciPy', 'Plotly', 'Streamlit'],
    github: 'https://github.com/DMZ22/financial-anomaly-detector',
    live: 'https://finsentry-aml.vercel.app',
    report: '/reports/finsentry.pdf',
    category: 'FinTech',
    accent: 'from-sky-400 via-cyan-400 to-blue-500',
    featured: true,
    year: '2026',
  },
  {
    slug: 'mediscan-ai',
    title: 'MediScan AI',
    tagline: 'One-stop clinical AI platform',
    description:
      'Screen for 7+ diseases, analyze lab reports, check drug interactions and chat with an AI health assistant. Stacking ensemble (RF + XGBoost + LightGBM + GBM) on 70k+ CDC records hits 83% ROC-AUC with 88% recall. Django REST + React 18 + Framer Motion frontend.',
    tech: ['Django', 'React', 'TypeScript', 'Gemini AI', 'OpenFDA', 'XGBoost'],
    github: 'https://github.com/DMZ22/mediscan-ai',
    live: 'https://frontend-lake-three-20.vercel.app',
    report: '/reports/mediscan-ai.pdf',
    category: 'AI/ML',
    accent: 'from-cyan-400 via-teal-400 to-emerald-400',
    featured: true,
    year: '2026',
  },
  {
    slug: 'visionquant',
    title: 'VisionQuant',
    tagline: 'Multi-strategy AI trading with computer vision',
    description:
      'Research prototype that treats chart images as first-class input — reconstructs OHLC from pixels via OpenCV + Hough transforms, then fuses rule-based and ML strategies (patterns, structure, S/R, breakout, CNN) into a single calibrated signal. Docker + Streamlit deploy.',
    tech: ['Python', 'OpenCV', 'PyTorch', 'Streamlit', 'Docker', 'CNN'],
    github: 'https://github.com/DMZ22/visionquant',
    report: '/reports/visionquant.pdf',
    category: 'AI/ML',
    accent: 'from-amber-400 via-orange-500 to-rose-500',
    featured: true,
    year: '2026',
  },
  {
    slug: 'quest-ai',
    title: 'Quest AI',
    tagline: 'Gamified habit tracker — better than Habitica',
    description:
      'Turn real-life goals into an RPG — build habits, complete dailies, slay to-do list bosses and level up a character with classes, gear, pets and mounts. AI coach (Gemini / OpenAI) with offline fallback. 100% free, offline-first, PWA.',
    tech: ['React 19', 'Vite', 'TypeScript', 'Tailwind', 'Gemini AI', 'PWA'],
    github: 'https://github.com/DMZ22/quest-ai',
    live: 'https://dmz22.github.io/quest-ai/',
    report: '/reports/quest-ai.pdf',
    category: 'Full-Stack',
    accent: 'from-lime-400 via-emerald-400 to-teal-500',
    featured: true,
    year: '2026',
  },
  {
    slug: 'customer-churn',
    title: 'Customer Churn Analysis',
    tagline: 'End-to-end ML pipeline: SQL → ML → API → UI',
    description:
      'Full pipeline predicting customer churn on 5,000 synthetic customers. SQLite schema + analytical queries, three models (Logistic Regression, Random Forest, XGBoost) with GridSearchCV tuning, FastAPI inference endpoint and interactive Streamlit dashboard.',
    tech: ['Python', 'SQL', 'XGBoost', 'FastAPI', 'Streamlit', 'Docker'],
    github: 'https://github.com/DMZ22/customer-churn-analysis',
    report: '/reports/customer-churn.pdf',
    category: 'Data Science',
    accent: 'from-blue-500 via-indigo-500 to-violet-500',
    year: '2026',
  },
  {
    slug: 'smart-money-tracker',
    title: 'Smart Money Tracker',
    tagline: 'Personal finance analytics with ML insights',
    description:
      'Full-stack finance app — FastAPI backend with NumPy-based linear regression for spending insights and health scoring, Firebase Auth + Firestore for real-time sync, Flutter cross-platform client with fl_chart dashboards.',
    tech: ['FastAPI', 'NumPy', 'Firebase', 'Firestore'],
    github: 'https://github.com/DMZ22/smart-money-tracker',
    report: '/reports/smart-money-tracker.pdf',
    category: 'Full-Stack',
    accent: 'from-pink-500 via-rose-500 to-red-500',
    year: '2026',
  },
  {
    slug: 'stock-price-dashboard',
    title: 'Stock Price Dashboard',
    tagline: 'LSTM buy/sell signals on live market data',
    description:
      'Lightweight dashboard generating buy/sell signals using LSTM forecasting over Finnhub + Yfinance feeds. Most accurate on 1h candlesticks; early research project that laid the foundation for Stock Trader Pro.',
    tech: ['Python', 'LSTM', 'Keras', 'Finnhub API', 'yfinance'],
    github: 'https://github.com/DMZ22/Stock-Price-Dashboard',
    category: 'FinTech',
    accent: 'from-fuchsia-500 via-purple-500 to-indigo-500',
    year: '2025',
  },
  {
    slug: 'stock-predictor-pro',
    title: 'Stock Predictor Pro',
    tagline: 'Real-time signals dashboard for 90+ assets',
    description:
      'Live market dashboard covering 90+ stocks, cryptos, forex pairs and commodities — a technical-indicator engine produces composite BUY / SELL / HOLD calls with confidence scoring over Yahoo Finance feeds with per-symbol caching. Deployed serverless on Vercel.',
    tech: ['Python', 'yfinance', 'Technical Analysis', 'Vercel'],
    github: 'https://github.com/DMZ22/stock-predictor-pro',
    live: 'https://stock-predictor-gold.vercel.app',
    report: '/reports/stock-predictor-pro.pdf',
    category: 'FinTech',
    accent: 'from-teal-400 via-cyan-500 to-sky-500',
    year: '2026',
  },
  {
    slug: 'phantom',
    title: 'Phantom',
    tagline: 'Movie discovery & booking platform',
    description:
      'Django-powered movie discovery and booking platform with TMDB integration, session-based auth and seat-selection checkout flow.',
    tech: ['Django', 'Python', 'PostgreSQL', 'TMDB API', 'Bootstrap'],
    github: 'https://github.com/DMZ22/phantom',
    live: 'https://phantom-fnvl.onrender.com',
    report: '/reports/phantom.pdf',
    category: 'Full-Stack',
    accent: 'from-slate-400 via-zinc-400 to-stone-500',
    year: '2026',
  },
  {
    slug: 'movie-recommender',
    title: 'Movie Recommender',
    tagline: 'Content-based movie recommendation engine',
    description:
      'Classic content-based filtering recommender built with Python, scikit-learn and cosine similarity over TMDB metadata.',
    tech: ['Python', 'scikit-learn', 'pandas', 'NLTK'],
    github: 'https://github.com/DMZ22/Movie-Recommender-System-',
    report: '/reports/movie-recommender.pdf',
    category: 'Data Science',
    accent: 'from-red-500 via-orange-500 to-yellow-500',
    year: '2025',
  },
  {
    slug: 'novelnest',
    title: 'NovelNest',
    tagline: 'Online book browsing & reviews',
    description:
      'A cozy book discovery web app — browse, review and track reads with a clean minimal UI.',
    tech: ['JavaScript', 'React', 'Node.js'],
    github: 'https://github.com/DMZ22/novelnest',
    live: 'https://novelnest-wdfo.vercel.app',
    report: '/reports/novelnest.pdf',
    category: 'Full-Stack',
    accent: 'from-emerald-400 via-green-500 to-lime-500',
    year: '2025',
  },
  {
    slug: 'stock-trader-pro',
    title: 'Stock Trader Pro',
    tagline: 'Production AI trading dashboard with 230+ assets',
    description:
      'Django trading dashboard featuring scalp trade signals, multi-timeframe confluence, 20+ technical indicators, LSTM forecasting, news sentiment, backtesting and Firebase auth. Covers 230+ symbols across US/Indian stocks, 60+ cryptos, commodities, forex and global ETFs.',
    tech: ['Django', 'Python', 'LSTM', 'PostgreSQL', 'Firebase', 'TradingView'],
    github: 'https://github.com/DMZ22/Stock-Trader-Pro',
    report: '/reports/stock-trader-pro.pdf',
    category: 'FinTech',
    accent: 'from-violet-500 via-fuchsia-500 to-pink-500',
    featured: true,
    year: '2026',
  },
]

export const stats = [
  { label: 'Projects Shipped', value: 10, suffix: '+' },
  { label: 'Lines of Python', value: 50, suffix: 'k+' },
  { label: 'ML Models Trained', value: 15, suffix: '+' },
  { label: 'Years Coding', value: 4, suffix: '' },
]

export const skills = {
  'Languages': ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Go'],
  'Backend': ['Django', 'FastAPI', 'Node.js', 'REST APIs', 'PostgreSQL', 'Redis', 'Docker'],
  'Frontend': ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
  'AI / ML': ['PyTorch', 'TensorFlow', 'scikit-learn', 'XGBoost', 'LightGBM', 'OpenCV', 'LSTM', 'CNN'],
  'LLM / APIs': ['Gemini', 'OpenAI', 'OpenFDA', 'Finnhub', 'Yahoo Finance', 'TMDB'],
  'Cloud / Ops': ['Azure', 'Vercel', 'Render', 'Firebase', 'Streamlit Cloud', 'GitHub Actions'],
}
