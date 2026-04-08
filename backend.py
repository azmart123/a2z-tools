from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import io
import os
import openai  # Placeholder for OpenAI integration

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Tesseract path if needed (uncomment and set path on Windows)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Placeholder OpenAI API key - replace with your actual key
# openai.api_key = 'your-openai-api-key-here'

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Placeholder response - replace with actual OpenAI integration
        # For now, return a simple echo response
        response = f"You said: {user_message}. This is a placeholder response. Please integrate with OpenAI API."

        # Uncomment and modify the following for actual OpenAI integration:
        # response = openai.ChatCompletion.create(
        #     model="gpt-3.5-turbo",
        #     messages=[
        #         {"role": "system", "content": "You are a helpful AI assistant."},
        #         {"role": "user", "content": user_message}
        #     ],
        #     max_tokens=150,
        #     temperature=0.7
        # )['choices'][0]['message']['content']

        return jsonify({'response': response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ocr', methods=['POST'])
def ocr():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400

        if not file.content_type.startswith('image/'):
            return jsonify({'error': 'File is not an image'}), 400

        # Read image from file
        image = Image.open(io.BytesIO(file.read()))

        # Convert to RGB if necessary (for PNG with transparency)
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Perform OCR
        text = pytesseract.image_to_string(image)

        # Clean up the text
        text = text.strip()

        if not text:
            return jsonify({'error': 'No text found in the image'}), 400

        return jsonify({'text': text})

    except Exception as e:
        return jsonify({'error': f'OCR processing failed: {str(e)}'}), 500

@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Aflu AI Tools Backend API', 'endpoints': ['/chat', '/ocr']})

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Chat endpoint: http://localhost:5000/chat")
    print("OCR endpoint: http://localhost:5000/ocr")
    print("Make sure to install required packages:")
    print("pip install flask flask-cors pillow pytesseract openai")
    print("Also install Tesseract OCR from: https://github.com/UB-Mannheim/tesseract/wiki")
    app.run(debug=True, host='0.0.0.0', port=5000)