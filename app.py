from flask import Flask, render_template, request, jsonify, send_from_directory
from deep_translator import GoogleTranslator
from gtts import gTTS
import os
import uuid

app = Flask(__name__)
# specific specific translator instance not strictly needed globally, but fine


# Ensure audio directory exists
AUDIO_DIR = os.path.join(app.root_path, 'static', 'audio')
os.makedirs(AUDIO_DIR, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate_text():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400

        # Translate to Kannada
        translated_text = GoogleTranslator(source='auto', target='kn').translate(text)
        # deep-translator returns string directly

        # Generate Audio
        tts = gTTS(text=translated_text, lang='kn', slow=False)
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)
        tts.save(filepath)

        return jsonify({
            'translation': translated_text,
            'audio_url': f"/static/audio/{filename}"
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/cleanup', methods=['POST'])
def cleanup_audio():
    # Optional endpoint to clean up old audio files later
    # For now, we'll just leave them or let the user implementation define cleanup
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)
