import os
import nltk

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
NLTK_DATA_DIR = os.path.join(BASE_DIR, "nltk_data")

os.makedirs(NLTK_DATA_DIR, exist_ok=True)
nltk.data.path.append(NLTK_DATA_DIR)
nltk.download("stopwords", download_dir=NLTK_DATA_DIR)
