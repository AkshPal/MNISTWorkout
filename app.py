from flask import Flask, request, jsonify
import torch
from torchvision import transforms
from PIL import Image
import io
from model import CNN  # Import the model from model.py

app = Flask(__name__)

# Load the trained model
model = CNN()
model.load_state_dict(torch.load("model.pth", map_location=torch.device("cpu")))
model.eval()

# Define image transformations
transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((28, 28)),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    img = Image.open(io.BytesIO(file.read()))
    img = transform(img).unsqueeze(0)  # Add batch dimension

    with torch.no_grad():
        output = model(img)
        prediction = torch.argmax(output, dim=1).item()

    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
