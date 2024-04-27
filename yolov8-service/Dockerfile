# 
FROM tiangolo/uvicorn-gunicorn:python3.11

RUN apt update && \
    apt install -y htop libgl1-mesa-glx libglib2.0-0
# 
WORKDIR /code

# 
COPY ./requirements.txt /code/requirements.txt
RUN pip install --upgrade pip
# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 
COPY ./app /code/app

# 
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3333"]
