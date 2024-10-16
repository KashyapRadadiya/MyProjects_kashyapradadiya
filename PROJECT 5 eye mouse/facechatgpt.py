import cv2
import pyautogui

# Initialize the camera
cap = cv2.VideoCapture(0)

# Load the pre-trained face detection model
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Get the screen size
screen_width, screen_height = pyautogui.size()

# Set a scaling factor to adjust the sensitivity of mouse movement
scaling_factor = 1.5

if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    if not ret:
        print("Error: Could not read frame.")
        break

    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    # If faces are detected, move the mouse
    for (x, y, w, h) in faces:
        # Calculate the center of the face
        face_center_x = x + w // 2
        face_center_y = y + h // 2

        # Map the face center position to the screen size
        screen_x = int(screen_width - (face_center_x * screen_width / frame.shape[1] * scaling_factor))
        screen_y = int(face_center_y * screen_height / frame.shape[0] * scaling_factor)

        # Move the mouse
        pyautogui.moveTo(screen_x, screen_y)

        # Draw a rectangle around the face
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

    # Display the resulting frame
    cv2.imshow('Face Mouse Control', frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything is done, release the capture
cap.release()
cv2.destroyAllWindows()
