import os
import numpy as np
import re
import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from nltk.corpus import stopwords

# Get the absolute path to the model and tokenizer files
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "bangla_sentiment_model_all.h5")
tokenizer_path = os.path.join(current_dir, "tokenizer_all.pkl")

# Load the model and tokenizer
print("Loading model from:", model_path)
model = load_model(model_path)

print("Loading tokenizer from:", tokenizer_path)
with open(tokenizer_path, 'rb') as f:
    tokenizer = pickle.load(f)

# Define label encoder classes
label_encoder_classes = ['Negative', 'Neutral', 'Positive']

# Define Bangla stop words
stop_words = set(stopwords.words('bengali'))

# Function to clean Bangla text
def clean_bangla_text(text):
    text = str(text)
    text = re.sub(r'[^\u0980-\u09FF\s]', '', text)  # Remove non-Bangla characters
    text = re.sub(r'[\u09E6-\u09EF]', '', text)     # Remove Bangla numbers
    text = re.sub(r'[৷ঃ]', '', text)               # Remove specific punctuation
    text = ' '.join(text.split())                   # Remove extra whitespace
    return text

# Function to remove stop words
def remove_stop_words(text):
    if isinstance(text, str):
        filtered_text = ' '.join([word for word in text.split() if word not in stop_words])
        return filtered_text
    return text

# Combined preprocessing function
def preprocess_text(text):
    cleaned_text = clean_bangla_text(text)
    no_stopwords_text = remove_stop_words(cleaned_text)
    return no_stopwords_text

# Function to predict sentiment
def predict_sentiment(raw_text, max_len=100):
    preprocessed_text = preprocess_text(raw_text)
    sequence = tokenizer.texts_to_sequences([preprocessed_text])
    padded = pad_sequences(sequence, maxlen=max_len, padding='post')
    prediction = model.predict(padded)[0]
    sentiment_probs = {label: round(prob * 100, 2) for label, prob in zip(label_encoder_classes, prediction)}
    predicted_sentiment = label_encoder_classes[np.argmax(prediction)]
    return sentiment_probs, predicted_sentiment

# Test the model loading
if __name__ == "__main__":
    print("Model and tokenizer loaded successfully!")