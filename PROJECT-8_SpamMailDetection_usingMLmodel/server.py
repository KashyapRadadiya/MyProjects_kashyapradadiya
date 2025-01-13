import json
import pandas as pd
from http.server import BaseHTTPRequestHandler, HTTPServer
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


data = pd.read_csv("D:/PROJECTS/PROJECT-8_SpamMailDetection_usingML/spamData3.csv")

data.loc[data['Category'] == 'spam', 'Category'] = 1
data.loc[data['Category'] == 'ham', 'Category'] = 0
X = data['Message']
Y = data['Category']

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=3)

feature_extraction = TfidfVectorizer(min_df=1, stop_words='english', lowercase=True)

X_train_features = feature_extraction.fit_transform(X_train)
X_test_features = feature_extraction.transform(X_test)

Y_train = Y_train.astype('int')
Y_test = Y_test.astype('int')


model = LogisticRegression()
model.fit(X_train_features, Y_train)

# HTTP Server
class SpamDetectionHandler(BaseHTTPRequestHandler):
    def _set_headers(self, content_type="application/json"):
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow CORS
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type') 
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_POST(self):
        self._set_headers()

        # Read the input data 
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        email_text = data.get('email')

        if not email_text:
            response = {'error': 'Email text is required'}
        else:
            # Make prediction
            print(email_text) ########################################################
            input_data_features = feature_extraction.transform([email_text])
            prediction = model.predict(input_data_features)
            print(f'Result of prediction {prediction}') #####################################################
            result = "Spam Mail" if prediction == 1 else "Genuine Mail"
            response = {'prediction': result}

        self.wfile.write(json.dumps(response).encode('utf-8'))

def run_server():
    port = 8080
    server_address = ('', port)
    httpd = HTTPServer(server_address, SpamDetectionHandler)
    print(f"Server is running on port number : {port}")
    # http://localhost:{port}
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
