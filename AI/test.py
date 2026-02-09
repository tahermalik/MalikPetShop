import os

if(os.path.exists("dummy/dummy.txt")):
    os.remove("dummy/dummy.txt")
    print("file remove")
else:
    print("file not removed")