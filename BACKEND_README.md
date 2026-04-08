# Aflu AI Tools Backend

This backend provides API endpoints for the Chat Aflu AI and Image to Text (OCR) tools.

## Prerequisites

1. **Python 3.7+** installed on your system
2. **Tesseract OCR** installed:
   - **Windows**: Download from https://github.com/UB-Mannheim/tesseract/wiki and install
   - **macOS**: `brew install tesseract`
   - **Linux**: `sudo apt-get install tesseract-ocr`

## Installation

1. Navigate to the project directory:
   ```bash
   cd "c:\Users\afeef\OneDrive\Desktop\A2Z Store\New github(2)\a2z tools\a2z-tools"
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

### For Chat Functionality (OpenAI Integration)
1. Get an OpenAI API key from https://platform.openai.com/
2. In `backend.py`, replace `'your-openai-api-key-here'` with your actual API key:
   ```python
   openai.api_key = 'sk-your-actual-api-key-here'
   ```

### For OCR Functionality
- Tesseract should work out of the box on most systems
- If Tesseract is installed in a custom location, update the path in `backend.py`:
  ```python
  pytesseract.pytesseract.tesseract_cmd = r'C:\path\to\tesseract.exe'
  ```

## Running the Server

1. Start the Flask development server:
   ```bash
   python backend.py
   ```

2. The server will start on `http://localhost:5000`

## API Endpoints

### Chat Endpoint
- **URL**: `http://localhost:5000/chat`
- **Method**: POST
- **Content-Type**: application/json
- **Body**:
  ```json
  {
    "message": "Hello, how are you?"
  }
  ```
- **Response**:
  ```json
  {
    "response": "AI response here"
  }
  ```

### OCR Endpoint
- **URL**: `http://localhost:5000/ocr`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Body**: Form data with `image` field containing the image file
- **Response**:
  ```json
  {
    "text": "Extracted text from image"
  }
  ```

## Frontend Integration

The frontend files (`tools/chat-aflu-ai.html` and `tools/image-to-text.html`) are configured to connect to `http://localhost:5000`.

To test the tools:
1. Start the Flask server as described above
2. Open the HTML files in a web browser or serve them via a web server
3. The tools will communicate with the backend automatically

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure Flask-CORS is installed and the CORS(app) line is present in backend.py.

### Tesseract Not Found
- Verify Tesseract is installed
- Check the installation path and update `pytesseract.pytesseract.tesseract_cmd` if necessary
- Test Tesseract installation: `tesseract --version`

### OpenAI API Errors
- Verify your API key is correct
- Check your OpenAI account has credits
- Ensure the API key has the necessary permissions

### Port Already in Use
If port 5000 is busy, you can change the port in the `app.run()` call at the bottom of backend.py.

## Security Notes

- This is a development setup. For production, implement proper authentication and rate limiting
- The current setup allows all origins due to CORS(app). Restrict this in production
- Never commit API keys to version control. Use environment variables instead