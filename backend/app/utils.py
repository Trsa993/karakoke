from passlib.context import CryptContext
from PIL import Image

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash(password: str):
    return pwd_context.hash(password)


def verify(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_dominant_color(image_path):
    image = Image.open(image_path)
    image = image.resize((25, 25))
    result = image.convert('P', palette=Image.ADAPTIVE, colors=1)
    print(result)
    dominant_color = result.getpalette()[:3]
    return "#{:02x}{:02x}{:02x}".format(dominant_color[0], dominant_color[1], dominant_color[2])
