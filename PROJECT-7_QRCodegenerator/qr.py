import qrcode as qr
# txt = "Hi i am kashyap\nand this is practice program"
img = qr.make("https://www.linkedin.com/in/kashyap-radadiya-437940339/")
# img = qr.make(txt)
img.save("LinkedinQR.png")