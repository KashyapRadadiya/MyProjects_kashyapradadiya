# Kashyap Radadiya
import cv2
import mediapipe
import pyautogui

screen_w , screen_h = pyautogui.size()

#opens the camera
cam = cv2.VideoCapture(0)
if not cam.isOpened():
    print("Camera not opened !!!")
    exit()
print("Camera opened !!!")

#create face mesh 
faceMesh = mediapipe.solutions.face_mesh.FaceMesh(refine_landmarks=True)
 
while True:
    #captures the frames
    ret, frame = cam.read()
    #flip the frame
    frame = cv2.flip(frame,1)
    if not ret:
        print("Frame not captured !!!")
        break

    #convert frames to more trackable video formate and trace face
    rgbFrame = cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
    output = faceMesh.process(rgbFrame)
    landmarkPoints = output.multi_face_landmarks
    # print(landmarkPoints)

    frame_h , frame_w , _ = frame.shape 
    
    #track landmarks on the face
    if landmarkPoints:
        landmarks = landmarkPoints[0].landmark
        #calculate distance in pixal numbers
            #[474:478] that can track only eye not whole face
        for id , landmark in enumerate(landmarks[474:478]):
            x = int(landmark.x * frame_w)
            y = int(landmark.y * frame_h)
            cv2.circle(frame,(x,y),2,(0,255,0))

            if id == 1:
                screen_x = int(landmark.x * screen_w)    
                screen_y = int(landmark.y * screen_h)
                #move mouse cursor
                pyautogui.moveTo(screen_x,screen_y)
        
        #click with eye
        left = [landmarks[145],landmarks[159]]
        for landmark in left:
            x = int(landmark.x * frame_w)
            y = int(landmark.y * frame_h)
            cv2.circle(frame,(x,y),2,(0,255,255))
        
        if (left[0].y - left[1].y) < 0.009:
            pyautogui.click()
            pyautogui.sleep(1.5)

    #shows the facescreen
    cv2.imshow("camera",frame)
    if cv2.waitKey(1) & 0xff == ord('q'):
        break

