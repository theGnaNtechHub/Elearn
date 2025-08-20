from flask import Flask, request, jsonify
import google.generativeai as genai
import os

# Set your API key
GOOGLE_API_KEY = "AIzaSyC1xDTX25QAdjH_Dxk5XCDHFBEeD95u0pU"
genai.configure(api_key=GOOGLE_API_KEY)

# Instantiate Gemini model
model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config={
        "temperature": 0.7,
        "top_p": 0.9,
        "max_output_tokens": 2048
    }
)

app = Flask(__name__)

@app.route('/', methods=['POST'])
def genie():
    user_input = request.form['query']
    
    # Force pseudo-code output unless language specified
    prompt = f"""
You are Genie, a logical assistant for a learning platform called VteacH.

Always respond in pseudo-code format by default, unless the user specifies a language like Python, JavaScript, etc.

Make your responses:
- Clear and step-by-step.
- Styled in <pre><code> HTML tags for formatting.
- Add logical explanation where relevant.

User Query:
\"\"\"
{user_input}
\"\"\"
"""

    try:
        response = model.generate_content(prompt)
        generated_html = f"<h2>Genie Response:</h2><pre><code>{response.text}</code></pre>"
        return generated_html
    except Exception as e:
        return f"<p style='color:red;'>Error: {str(e)}</p>"
