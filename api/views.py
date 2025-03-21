from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .ml_model import predict_sentiment

class SentimentAnalysisView(APIView):
    def post(self, request):
        # Extract the input text from the request
        raw_text = request.data.get('text', '').strip()
        if not raw_text:
            return Response({"error": "দয়া করে কিছু লিখুন!"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Call the sentiment analysis function
            sentiment_probs, predicted_sentiment = predict_sentiment(raw_text)
            return Response({
                "text": raw_text,
                "sentiment_probabilities": sentiment_probs,
                "predicted_sentiment": predicted_sentiment
            }, status=status.HTTP_200_OK)
        except Exception as e:
            # Handle unexpected errors
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        

def home(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')